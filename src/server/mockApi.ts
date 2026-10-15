import { useStore } from '../store/useStore';
import {
  UserRole,
  Buyer,
  Quote,
  Booking,
  PlanId,
  EligibilityResult,
  MockApiLog,
} from '../data/types';
import { evaluateEligibility } from './rules';
import {
  transitionToUnderReview,
  transitionToApproved,
  transitionToRejected,
  transitionToReconsideration,
  transitionToCancelled,
  transitionToCompleted,
  rollupPaymentStatus,
} from './stateMachine';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
  rule?: string;
  error?: string;
}

// Generates pseudo-random latency within PRD target bounds
const getLatency = (isSlow: boolean): number => {
  if (isSlow) return 4000;
  return Math.floor(Math.random() * (650 - 260 + 1)) + 260;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeApiCall<T>(
  method: string,
  path: string,
  ruleDescription: string,
  handler: (state: ReturnType<typeof useStore.getState>) => ApiResponse<T>
): Promise<ApiResponse<T>> {
  const state = useStore.getState();
  const latency = getLatency(state.failures.slowResponse);

  await delay(latency);

  // Check simulated expired session failure
  if (state.failures.expiredSession) {
    const errorResponse: ApiResponse<T> = {
      status: 401,
      body: null as unknown as T,
      rule: 'AUTH_SESSION_EXPIRED',
      error: 'Session token expired. Please re-authenticate.',
    };
    logCall(method, path, state.currentRole, 401, 'AUTH_SESSION_EXPIRED', latency);
    return errorResponse;
  }

  // Check network error on write failure
  if (state.failures.networkErrorNextWrite && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    state.setFailures({ networkErrorNextWrite: false }); // One-shot
    const errorResponse: ApiResponse<T> = {
      status: 503,
      body: null as unknown as T,
      rule: 'SIMULATED_NETWORK_FAILURE',
      error: 'Network connection failed (simulated). Please retry.',
    };
    logCall(method, path, state.currentRole, 503, 'SIMULATED_NETWORK_FAILURE', latency);
    return errorResponse;
  }

  // Execute actual business handler
  const result = handler(useStore.getState());
  logCall(method, path, state.currentRole, result.status, result.rule || ruleDescription, latency);
  return result;
}

function logCall(
  method: string,
  path: string,
  role: UserRole,
  status: number,
  ruleApplied: string,
  durationMs: number
) {
  const log: MockApiLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    method,
    path,
    role,
    status,
    ruleApplied,
    durationMs,
  };
  useStore.getState().addApiLog(log);
}

export const mockApi = {
  // GET /api/buyers
  getBuyers: async (): Promise<ApiResponse<Buyer[]>> => {
    return executeApiCall('GET', '/api/buyers', 'ADMIN_BUYERS_READ', (state) => {
      if (state.currentRole !== 'admin') {
        return {
          status: 403,
          body: [],
          rule: 'ROLE_ADMIN_REQUIRED',
          error: 'Only administrators can inspect buyer company registries.',
        };
      }
      return { status: 200, body: state.buyers };
    });
  },

  // GET /api/buyers/:id
  getBuyer: async (id: string): Promise<ApiResponse<Buyer | null>> => {
    return executeApiCall('GET', `/api/buyers/${id}`, 'BUYER_DETAIL_READ', (state) => {
      // Admin can view any buyer; buyer can only view own account
      if (state.currentRole === 'buyer' && state.activeBuyerId !== id) {
        return {
          status: 403,
          body: null,
          rule: 'TENANT_ISOLATION_RULE',
          error: 'Access denied: Buyers cannot view other agency accounts.',
        };
      }
      const buyer = state.buyers.find((b) => b.id === id) || null;
      return { status: buyer ? 200 : 404, body: buyer };
    });
  },

  // POST /api/buyers/:id/plan (Activate or change plan)
  updateBuyerPlan: async (
    buyerId: string,
    planId: PlanId,
    cardNumberLast4?: string
  ): Promise<ApiResponse<{ buyer: Buyer; planActivated: string }>> => {
    return executeApiCall('POST', `/api/buyers/${buyerId}/plan`, 'PLAN_ACTIVATION_RULE', (state) => {
      if (state.currentRole === 'coordinator') {
        return {
          status: 403,
          body: null as any,
          rule: 'ROLE_NOT_AUTHORIZED',
          error: 'Coordinators cannot modify buyer subscriptions.',
        };
      }
      if (state.currentRole === 'buyer' && state.activeBuyerId !== buyerId) {
        return {
          status: 403,
          body: null as any,
          rule: 'TENANT_ISOLATION_RULE',
          error: 'Cannot modify plan for a different buyer organization.',
        };
      }

      // Check test card failure simulation (PRD 6.1: card ending in 0002 triggers decline)
      if (cardNumberLast4 && cardNumberLast4.endsWith('0002')) {
        return {
          status: 402,
          body: null as any,
          rule: 'PAYMENT_CARD_DECLINED',
          error: 'Payment declined: Test card ending in 0002 was rejected by the card network.',
        };
      }

      const targetBuyer = state.buyers.find((b) => b.id === buyerId);
      if (!targetBuyer) {
        return { status: 404, body: null as any, error: 'Buyer not found' };
      }

      const targetPlan = state.plans.find((p) => p.id === planId);
      if (!targetPlan) {
        return { status: 400, body: null as any, error: 'Invalid plan selected' };
      }

      const updatedBuyer: Buyer = {
        ...targetBuyer,
        planId,
        subscriptionStatus: planId === 'explorer' ? 'free' : 'active',
        renewalDate: planId === 'explorer' ? '—' : '15 Nov 2026',
        lastActivity: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      state.updateBuyer(buyerId, updatedBuyer);

      return {
        status: 200,
        body: { buyer: updatedBuyer, planActivated: targetPlan.name },
        rule: `PLAN_UPGRADED_TO_${planId.toUpperCase()}`,
      };
    });
  },

  // GET /api/quotes
  getQuotes: async (): Promise<ApiResponse<Quote[]>> => {
    return executeApiCall('GET', '/api/quotes', 'QUOTES_LIST_READ', (state) => {
      if (state.currentRole === 'buyer') {
        const filtered = state.quotes.filter((q) => q.buyerId === state.activeBuyerId);
        return { status: 200, body: filtered };
      }
      return { status: 200, body: state.quotes };
    });
  },

  // GET /api/quotes/:id
  getQuote: async (id: string): Promise<ApiResponse<Quote | null>> => {
    return executeApiCall('GET', `/api/quotes/${id}`, 'QUOTE_DETAIL_READ', (state) => {
      const quote = state.quotes.find((q) => q.id === id) || null;
      if (!quote) return { status: 404, body: null };
      if (state.currentRole === 'buyer' && quote.buyerId !== state.activeBuyerId) {
        return {
          status: 403,
          body: null,
          rule: 'TENANT_ISOLATION_RULE',
          error: 'You do not have permission to view quotes from another agency.',
        };
      }
      return { status: 200, body: quote };
    });
  },

  // POST /api/quotes/:id/refresh
  refreshQuote: async (quoteId: string): Promise<ApiResponse<Quote>> => {
    return executeApiCall('POST', `/api/quotes/${quoteId}/refresh`, 'QUOTE_REFRESH_RULE', (state) => {
      const quote = state.quotes.find((q) => q.id === quoteId);
      if (!quote) return { status: 404, body: null as any, error: 'Quote not found' };

      const refreshed: Quote = {
        ...quote,
        status: 'issued',
        issuedDate: '15 Oct 2026',
        validityDate: '2026-10-29', // 14 days freshness
      };

      state.updateQuote(refreshed);
      return { status: 200, body: refreshed, rule: 'QUOTE_REFRESHED_14_DAYS' };
    });
  },

  // POST /api/eligibility/check
  checkEligibility: async (quoteId: string): Promise<ApiResponse<EligibilityResult>> => {
    return executeApiCall('POST', `/api/quotes/${quoteId}/eligibility`, 'SERVER_ELIGIBILITY_CHECK_RULES_1_TO_5', (state) => {
      const quote = state.quotes.find((q) => q.id === quoteId);
      if (!quote) {
        return {
          status: 404,
          body: { allPassed: false, checks: [] },
          error: 'Quote not found',
        };
      }

      const buyer = state.buyers.find((b) => b.id === state.activeBuyerId);
      if (!buyer) {
        return {
          status: 404,
          body: { allPassed: false, checks: [] },
          error: 'Buyer organization not found',
        };
      }

      const plan = state.plans.find((p) => p.id === buyer.planId) || state.plans[0];
      const result = evaluateEligibility(buyer, quote, plan, state.currentRole);

      return {
        status: 200,
        body: result,
        rule: result.allPassed ? 'ALL_5_ELIGIBILITY_RULES_PASSED' : 'ELIGIBILITY_REQUIREMENTS_NOT_MET',
      };
    });
  },

  // POST /api/bookings (Submit booking)
  submitBooking: async (
    quoteId: string,
    notes?: string
  ): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', '/api/bookings', 'BOOKING_SUBMISSION_EVALUATION', (state) => {
      const quote = state.quotes.find((q) => q.id === quoteId);
      if (!quote) {
        return { status: 404, body: null as any, error: 'Quote not found' };
      }

      const buyer = state.buyers.find((b) => b.id === state.activeBuyerId);
      if (!buyer) {
        return { status: 404, body: null as any, error: 'Buyer not found' };
      }

      const plan = state.plans.find((p) => p.id === buyer.planId) || state.plans[0];
      const eligibility = evaluateEligibility(buyer, quote, plan, state.currentRole);

      if (!eligibility.allPassed) {
        const firstFail = eligibility.checks.find((c) => c.status === 'fail');
        return {
          status: 422,
          body: null as any,
          rule: 'ELIGIBILITY_FAILED_ON_SUBMIT',
          error: firstFail?.message || 'Booking submission rejected: Eligibility rules failed.',
        };
      }

      // Mark quote as booked
      state.updateQuote({ ...quote, status: 'booked' });

      // Increment buyer allowance usage
      state.updateBuyer(buyer.id, {
        bookingsThisMonth: buyer.bookingsThisMonth + 1,
        valueThisMonth: buyer.valueThisMonth + quote.totalAmount,
        lastActivity: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      });

      const nextNum = 2600 + state.bookings.length + 1;
      const newBooking: Booking = {
        id: `bk-${nextNum}`,
        reference: `BK-${nextNum}`,
        buyerId: buyer.id,
        buyerName: buyer.name,
        quoteId: quote.id,
        tourTitle: quote.tourTitle,
        travellersCount: quote.travellersCount,
        travelDates: quote.travelDates,
        totalAmount: quote.totalAmount,
        status: 'submitted',
        notes: notes?.trim() || undefined,
        reconsiderationUsed: false,
        createdAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        paymentLines: [],
        messages: [
          {
            id: `msg-${Date.now()}`,
            bookingId: `bk-${nextNum}`,
            senderName: `${buyer.contactName} (${buyer.name})`,
            senderRole: 'buyer',
            content: `Booking requested under quote ${quote.reference}. ${notes ? `Note: "${notes}"` : ''}`,
            timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
          },
        ],
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            actor: buyer.contactName,
            role: 'buyer',
            action: 'Submitted booking through portal wizard',
            toStatus: 'submitted',
          },
        ],
      };

      state.addBooking(newBooking);
      return { status: 201, body: newBooking, rule: 'BOOKING_CREATED_AND_ELIGIBILITY_PASSED' };
    });
  },

  // GET /api/bookings
  getBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return executeApiCall('GET', '/api/bookings', 'BOOKINGS_LIST_READ', (state) => {
      if (state.currentRole === 'buyer') {
        const filtered = state.bookings.filter((b) => b.buyerId === state.activeBuyerId);
        return { status: 200, body: filtered };
      }
      return { status: 200, body: state.bookings };
    });
  },

  // GET /api/bookings/:id
  getBooking: async (id: string): Promise<ApiResponse<Booking | null>> => {
    return executeApiCall('GET', `/api/bookings/${id}`, 'BOOKING_DETAIL_READ', (state) => {
      const booking = state.bookings.find((b) => b.id === id) || null;
      if (!booking) return { status: 404, body: null };

      if (state.currentRole === 'buyer' && booking.buyerId !== state.activeBuyerId) {
        return {
          status: 403,
          body: null,
          rule: 'TENANT_ISOLATION_RULE',
          error: 'Access denied: You can only view bookings for your own agency account.',
        };
      }
      return { status: 200, body: booking };
    });
  },

  // POST /api/bookings/:id/review (Admin starts review)
  startBookingReview: async (id: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/review`, 'ADMIN_REVIEW_START', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const res = transitionToUnderReview(booking, state.currentRole, 'Operator Staff');
      if (!res.success || !res.booking) {
        return { status: 400, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: 'BOOKING_STATE_UNDER_REVIEW' };
    });
  },

  // POST /api/bookings/:id/approve (Admin approves)
  approveBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/approve`, 'ADMIN_APPROVAL_GATE', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const quote = state.quotes.find((q) => q.id === booking.quoteId);
      if (!quote) return { status: 404, body: null as any, error: 'Underlying quote not found' };

      const res = transitionToApproved(booking, quote, state.currentRole, 'Sarah Jenkins (Admin)');
      if (!res.success || !res.booking) {
        return { status: 422, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: 'BOOKING_APPROVED_SUPPLIER_LINES_CREATED' };
    });
  },

  // POST /api/bookings/:id/reject
  rejectBooking: async (id: string, reason: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/reject`, 'ADMIN_REJECTION_REASON_GATE', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const res = transitionToRejected(booking, reason, state.currentRole, 'Sarah Jenkins (Admin)');
      if (!res.success || !res.booking) {
        return { status: 422, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: res.booking.status === 'rejected_final' ? 'REJECTED_FINAL' : 'REJECTED_WITH_REASON' };
    });
  },

  // POST /api/bookings/:id/reconsider (Buyer reconsideration)
  requestReconsideration: async (id: string, note: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/reconsider`, 'ONE_TIME_RECONSIDERATION_LIMIT', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const buyer = state.buyers.find((b) => b.id === state.activeBuyerId);
      const res = transitionToReconsideration(booking, note, state.currentRole, buyer?.contactName || 'Buyer Staff');
      if (!res.success || !res.booking) {
        return { status: 422, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: 'RECONSIDERATION_SUBMITTED_ONCE' };
    });
  },

  // POST /api/bookings/:id/cancel
  cancelBooking: async (id: string, reason?: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/cancel`, 'BOOKING_CANCELLATION_RULE', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const actorName = state.currentRole === 'buyer' ? 'Buyer Agency' : 'Sarah Jenkins (Admin)';
      const res = transitionToCancelled(booking, reason || '', state.currentRole, actorName);
      if (!res.success || !res.booking) {
        return { status: 422, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: 'BOOKING_CANCELLED' };
    });
  },

  // POST /api/bookings/:id/complete
  completeBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${id}/complete`, 'ADMIN_COMPLETION_ALL_PAYMENTS_RULE', (state) => {
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      const res = transitionToCompleted(booking, state.currentRole, 'Sarah Jenkins (Admin)');
      if (!res.success || !res.booking) {
        return { status: 422, body: null as any, rule: res.ruleCode, error: res.error };
      }

      state.updateBooking(res.booking);
      return { status: 200, body: res.booking, rule: 'BOOKING_COMPLETED_SUCCESSFULLY' };
    });
  },

  // POST /api/bookings/:id/payments/:lineId/proof
  uploadPaymentProof: async (
    bookingId: string,
    lineId: string,
    fileName: string
  ): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${bookingId}/payments/${lineId}/proof`, 'BUYER_PAYMENT_PROOF_UPLOAD', (state) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      if (state.currentRole !== 'buyer') {
        return {
          status: 403,
          body: null as any,
          rule: 'ROLE_BUYER_REQUIRED',
          error: 'Only buyers can upload supplier payment proof.',
        };
      }

      const targetLine = booking.paymentLines.find((pl) => pl.id === lineId);
      if (!targetLine) return { status: 404, body: null as any, error: 'Payment line not found' };

      const updatedLines = booking.paymentLines.map((pl) =>
        pl.id === lineId
          ? {
              ...pl,
              status: 'proof_uploaded' as const,
              proofFileName: fileName,
              proofUploadedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
          : pl
      );

      const newStatus = rollupPaymentStatus(booking.status, updatedLines);
      const updatedBooking: Booking = {
        ...booking,
        status: newStatus,
        paymentLines: updatedLines,
        updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            actor: 'Buyer Agency',
            role: 'buyer',
            action: `Uploaded proof (${fileName}) for ${targetLine.supplierName}`,
          },
          ...booking.history,
        ],
      };

      state.updateBooking(updatedBooking);
      return { status: 200, body: updatedBooking, rule: 'PAYMENT_PROOF_REGISTERED' };
    });
  },

  // POST /api/bookings/:id/payments/:lineId/confirm
  confirmPaymentLine: async (
    bookingId: string,
    lineId: string,
    isOverride = false
  ): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${bookingId}/payments/${lineId}/confirm`, 'COORDINATOR_PAYMENT_CONFIRMATION', (state) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      if (!['coordinator', 'admin'].includes(state.currentRole)) {
        return {
          status: 403,
          body: null as any,
          rule: 'ROLE_COORDINATOR_OR_ADMIN_REQUIRED',
          error: 'Only coordinators or admins can confirm supplier payments.',
        };
      }

      const targetLine = booking.paymentLines.find((pl) => pl.id === lineId);
      if (!targetLine) return { status: 404, body: null as any, error: 'Payment line not found' };

      const actorLabel =
        state.currentRole === 'coordinator'
          ? 'Clara Vance (Coordinator)'
          : 'Sarah Jenkins (Admin Override)';

      const updatedLines = booking.paymentLines.map((pl) =>
        pl.id === lineId
          ? {
              ...pl,
              status: 'confirmed' as const,
              confirmedBy: actorLabel,
              confirmedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
          : pl
      );

      const newStatus = rollupPaymentStatus(booking.status, updatedLines);
      const updatedBooking: Booking = {
        ...booking,
        status: newStatus,
        paymentLines: updatedLines,
        updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            actor: actorLabel,
            role: state.currentRole,
            action: `${isOverride ? 'Admin Override: ' : ''}Confirmed payment for ${targetLine.supplierName} ($${targetLine.amount.toLocaleString()})`,
            toStatus: newStatus,
          },
          ...booking.history,
        ],
      };

      state.updateBooking(updatedBooking);
      return { status: 200, body: updatedBooking, rule: isOverride ? 'ADMIN_OVERRIDE_CONFIRMATION' : 'COORDINATOR_CONFIRMATION_RECORDED' };
    });
  },

  // POST /api/bookings/:id/payments/:lineId/dispute
  disputePaymentLine: async (
    bookingId: string,
    lineId: string,
    reason: string
  ): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${bookingId}/payments/${lineId}/dispute`, 'COORDINATOR_PAYMENT_DISPUTE', (state) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      if (!['coordinator', 'admin'].includes(state.currentRole)) {
        return {
          status: 403,
          body: null as any,
          rule: 'ROLE_COORDINATOR_OR_ADMIN_REQUIRED',
          error: 'Only coordinators or admins can dispute payment proof.',
        };
      }

      if (!reason || reason.trim().length < 5) {
        return {
          status: 422,
          body: null as any,
          rule: 'DISPUTE_REASON_REQUIRED',
          error: 'Dispute reason is required.',
        };
      }

      const updatedLines = booking.paymentLines.map((pl) =>
        pl.id === lineId
          ? {
              ...pl,
              status: 'disputed' as const,
              disputeReason: reason.trim(),
            }
          : pl
      );

      const newStatus = rollupPaymentStatus(booking.status, updatedLines);
      const updatedBooking: Booking = {
        ...booking,
        status: newStatus,
        paymentLines: updatedLines,
        updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            actor: state.currentRole === 'coordinator' ? 'Clara Vance (Coordinator)' : 'Sarah Jenkins (Admin)',
            role: state.currentRole,
            action: `Disputed payment proof: ${reason.trim()}`,
          },
          ...booking.history,
        ],
      };

      state.updateBooking(updatedBooking);
      return { status: 200, body: updatedBooking, rule: 'PAYMENT_LINE_DISPUTED' };
    });
  },

  // POST /api/bookings/:id/messages
  sendMessage: async (
    bookingId: string,
    content: string
  ): Promise<ApiResponse<Booking>> => {
    return executeApiCall('POST', `/api/bookings/${bookingId}/messages`, 'BOOKING_THREAD_MESSAGE_APPEND', (state) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) return { status: 404, body: null as any, error: 'Booking not found' };

      if (!['buyer', 'admin'].includes(state.currentRole)) {
        return {
          status: 403,
          body: null as any,
          rule: 'ROLE_NOT_AUTHORIZED',
          error: 'Only buyers and operator admins participate in booking correspondence.',
        };
      }

      const senderName =
        state.currentRole === 'admin'
          ? 'Sarah Jenkins (Admin)'
          : state.buyers.find((b) => b.id === state.activeBuyerId)?.contactName || 'Buyer Staff';

      const newMessage = {
        id: `msg-${Date.now()}`,
        bookingId,
        senderName,
        senderRole: state.currentRole as 'buyer' | 'admin',
        content: content.trim(),
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const,
      };

      const updatedBooking: Booking = {
        ...booking,
        messages: [...booking.messages, newMessage],
        updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      state.updateBooking(updatedBooking);
      return { status: 201, body: updatedBooking, rule: 'MESSAGE_SENT_TO_THREAD' };
    });
  },
};
