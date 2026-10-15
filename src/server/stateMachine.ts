import {
  Booking,
  BookingStatus,
  PaymentLine,
  UserRole,
  Quote,
} from '../data/types';
import { DEMO_CURRENT_DATE } from './rules';

export interface TransitionResult {
  success: boolean;
  booking?: Booking;
  error?: string;
  ruleCode?: string;
}

/**
 * Recalculate booking status based on payment lines
 */
export function rollupPaymentStatus(currentStatus: BookingStatus, paymentLines: PaymentLine[]): BookingStatus {
  if (['cancelled', 'rejected', 'rejected_final'].includes(currentStatus)) {
    return currentStatus;
  }
  if (currentStatus === 'completed') {
    return 'completed';
  }
  if (!paymentLines || paymentLines.length === 0) {
    return currentStatus;
  }

  const allConfirmed = paymentLines.every((pl) => pl.status === 'confirmed');
  if (allConfirmed) {
    return 'fully_paid';
  }

  const anyConfirmedOrProof = paymentLines.some(
    (pl) => pl.status === 'confirmed' || pl.status === 'proof_uploaded'
  );
  if (anyConfirmedOrProof) {
    return 'partially_paid';
  }

  return 'payment_pending';
}

/**
 * Evaluates whether an admin can complete a booking
 */
export function canCompleteBooking(booking: Booking): { allowed: boolean; pendingLines: PaymentLine[] } {
  if (booking.status === 'completed') {
    return { allowed: false, pendingLines: [] };
  }
  const pendingLines = booking.paymentLines.filter((pl) => pl.status !== 'confirmed');
  return {
    allowed: pendingLines.length === 0 && booking.paymentLines.length > 0,
    pendingLines,
  };
}

/**
 * Transition booking to under_review
 */
export function transitionToUnderReview(booking: Booking, actorRole: UserRole, actorName: string): TransitionResult {
  if (actorRole !== 'admin') {
    return { success: false, error: 'Only admins can review submitted bookings', ruleCode: 'ROLE_ADMIN_REQUIRED' };
  }
  if (booking.status !== 'submitted') {
    return { success: false, error: `Cannot review booking from '${booking.status}' status` };
  }

  const updated: Booking = {
    ...booking,
    status: 'under_review',
    updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' 15 Oct 2026',
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: 'Review started',
        fromStatus: 'submitted',
        toStatus: 'under_review',
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}

/**
 * Approve booking (creates payment lines from quote)
 */
export function transitionToApproved(
  booking: Booking,
  quote: Quote,
  actorRole: UserRole,
  actorName: string
): TransitionResult {
  if (actorRole !== 'admin') {
    return { success: false, error: 'Only admins can approve bookings', ruleCode: 'ROLE_ADMIN_REQUIRED' };
  }
  if (!['submitted', 'under_review', 'reconsideration_requested'].includes(booking.status)) {
    return { success: false, error: `Cannot approve booking from '${booking.status}' status` };
  }

  // Quote freshness check at decision time (PRD 5.4 edge case)
  if (quote.validityDate < DEMO_CURRENT_DATE || quote.status === 'expired') {
    return {
      success: false,
      error: `Approval blocked: Quote ${quote.reference} expired on ${quote.validityDate}. Please ask the buyer to refresh the quote.`,
      ruleCode: 'QUOTE_EXPIRED_AT_DECISION',
    };
  }

  // Generate payment lines per supplier from the quote
  const paymentLines: PaymentLine[] = quote.supplierLines.map((sl, index) => ({
    id: `pl-${booking.id}-${index + 1}`,
    supplierId: sl.supplierId,
    supplierName: sl.supplierName,
    serviceType: sl.serviceType,
    amount: sl.amount,
    dueDate: '28 Oct 2026',
    status: 'not_paid',
  }));

  const updated: Booking = {
    ...booking,
    status: 'payment_pending', // Automatically advances to payment_pending once lines exist
    paymentLines,
    updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: `Approved booking. Generated ${paymentLines.length} supplier payment lines.`,
        fromStatus: booking.status,
        toStatus: 'payment_pending',
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}

/**
 * Reject booking
 */
export function transitionToRejected(
  booking: Booking,
  reason: string,
  actorRole: UserRole,
  actorName: string
): TransitionResult {
  if (actorRole !== 'admin') {
    return { success: false, error: 'Only admins can reject bookings', ruleCode: 'ROLE_ADMIN_REQUIRED' };
  }
  if (!['submitted', 'under_review', 'reconsideration_requested'].includes(booking.status)) {
    return { success: false, error: `Cannot reject booking from '${booking.status}' status` };
  }
  if (!reason || reason.trim().length < 10) {
    return {
      success: false,
      error: 'A detailed rejection reason of at least 10 characters is strictly required.',
      ruleCode: 'REJECTION_REASON_TOO_SHORT',
    };
  }

  const isFinal = booking.status === 'reconsideration_requested';
  const newStatus: BookingStatus = isFinal ? 'rejected_final' : 'rejected';

  const updated: Booking = {
    ...booking,
    status: newStatus,
    rejectionReason: reason.trim(),
    updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: isFinal ? 'Final rejection issued' : 'Booking rejected',
        reason: reason.trim(),
        fromStatus: booking.status,
        toStatus: newStatus,
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}

/**
 * Request reconsideration (buyer) - STRICTLY ONCE PER BOOKING
 */
export function transitionToReconsideration(
  booking: Booking,
  note: string,
  actorRole: UserRole,
  actorName: string
): TransitionResult {
  if (actorRole !== 'buyer') {
    return { success: false, error: 'Only buyers can request reconsideration', ruleCode: 'ROLE_BUYER_REQUIRED' };
  }
  if (booking.status !== 'rejected') {
    return { success: false, error: 'Reconsideration can only be requested for rejected bookings.' };
  }
  if (booking.reconsiderationUsed) {
    return {
      success: false,
      error: 'Reconsideration has already been used for this booking. Only one appeal is permitted.',
      ruleCode: 'RECONSIDERATION_LIMIT_EXCEEDED',
    };
  }
  if (!note || note.trim().length < 10) {
    return {
      success: false,
      error: 'Please provide a note (at least 10 characters) explaining the changes or justification.',
      ruleCode: 'NOTE_REQUIRED',
    };
  }

  const updated: Booking = {
    ...booking,
    status: 'reconsideration_requested',
    reconsiderationNote: note.trim(),
    reconsiderationUsed: true,
    updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: 'Requested reconsideration (one-time)',
        reason: note.trim(),
        fromStatus: 'rejected',
        toStatus: 'reconsideration_requested',
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}

/**
 * Cancel booking
 */
export function transitionToCancelled(
  booking: Booking,
  reason: string,
  actorRole: UserRole,
  actorName: string
): TransitionResult {
  // Buyer can cancel pre-approval; admin can cancel anytime
  if (actorRole === 'buyer') {
    if (!['submitted', 'under_review'].includes(booking.status)) {
      return {
        success: false,
        error: 'Buyers can only cancel bookings prior to approval. Contact operator to cancel active payments.',
      };
    }
  } else if (actorRole !== 'admin') {
    return { success: false, error: 'Unauthorized to cancel this booking.' };
  }

  if (actorRole === 'admin' && (!reason || reason.trim().length < 5)) {
    return { success: false, error: 'Admin cancellation requires a reason.' };
  }

  const updated: Booking = {
    ...booking,
    status: 'cancelled',
    cancelReason: reason?.trim() || 'Cancelled by buyer prior to approval',
    updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: 'Cancelled booking',
        reason: reason?.trim(),
        fromStatus: booking.status,
        toStatus: 'cancelled',
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}

/**
 * Complete booking (Admin only, all payments must be confirmed)
 */
export function transitionToCompleted(
  booking: Booking,
  actorRole: UserRole,
  actorName: string
): TransitionResult {
  if (actorRole !== 'admin') {
    return { success: false, error: 'Only admins can mark a booking as completed', ruleCode: 'ROLE_ADMIN_REQUIRED' };
  }

  const { allowed, pendingLines } = canCompleteBooking(booking);
  if (!allowed) {
    const pendingNames = pendingLines.map((p) => `${p.supplierName} ($${p.amount.toLocaleString()})`).join(', ');
    return {
      success: false,
      error: `Completion blocked: Outstanding unconfirmed payments on: ${pendingNames}`,
      ruleCode: 'UNCONFIRMED_PAYMENTS_EXIST',
    };
  }

  const updated: Booking = {
    ...booking,
    status: 'completed',
    updatedAt: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: '15 Oct 2026, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actor: actorName,
        role: actorRole,
        action: 'Marked booking completed (all supplier lines confirmed)',
        fromStatus: booking.status,
        toStatus: 'completed',
      },
      ...booking.history,
    ],
  };

  return { success: true, booking: updated };
}
