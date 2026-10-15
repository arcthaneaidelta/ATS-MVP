export type UserRole = 'buyer' | 'admin' | 'coordinator';

export type PlanId = 'explorer' | 'professional' | 'enterprise';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  pricePerMonth: number;
  bookingsPerMonth: number;
  bookingValuePerMonth: number;
  seats: number;
  notes: string;
  isPopular?: boolean;
}

export type SubscriptionStatus = 'active' | 'past_due' | 'free';

export interface Buyer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  country: string;
  joinedDate: string; // e.g. "12 Jan 2025"
  seatCount: number;
  planId: PlanId;
  subscriptionStatus: SubscriptionStatus;
  renewalDate: string;
  bookingsThisMonth: number;
  valueThisMonth: number;
  lastActivity: string;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'hotel' | 'transport' | 'guide' | 'rail' | 'activity';
  currency: string;
  location: string;
}

export interface Tour {
  id: string;
  title: string;
  region: string;
  durationDays: number;
  supplierIds: string[];
}

export type QuoteStatus = 'issued' | 'expired' | 'booked';

export interface QuoteSupplierLine {
  id: string;
  supplierId: string;
  supplierName: string;
  serviceType: string;
  amount: number;
}

export interface Quote {
  id: string;
  reference: string;
  buyerId: string;
  tourId: string;
  tourTitle: string;
  travellersCount: number;
  travelDates: string; // e.g. "18 Nov 2026 – 25 Nov 2026"
  totalAmount: number;
  status: QuoteStatus;
  issuedDate: string;
  validityDate: string; // ISO date YYYY-MM-DD or readable
  supplierLines: QuoteSupplierLine[];
}

export type BookingStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'reconsideration_requested'
  | 'rejected_final'
  | 'cancelled'
  | 'payment_pending'
  | 'partially_paid'
  | 'fully_paid'
  | 'completed';

export type PaymentLineStatus = 'not_paid' | 'proof_uploaded' | 'confirmed' | 'disputed';

export interface PaymentLine {
  id: string;
  supplierId: string;
  supplierName: string;
  serviceType: string;
  amount: number;
  dueDate: string;
  status: PaymentLineStatus;
  proofFileName?: string;
  proofUploadedAt?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  disputeReason?: string;
}

export interface BookingMessage {
  id: string;
  bookingId: string;
  senderName: string;
  senderRole: 'buyer' | 'admin';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent';
}

export interface BookingHistoryItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  reason?: string;
  fromStatus?: BookingStatus;
  toStatus?: BookingStatus;
}

export interface Booking {
  id: string;
  reference: string; // e.g. "BK-2601"
  buyerId: string;
  buyerName: string;
  quoteId: string;
  tourTitle: string;
  travellersCount: number;
  travelDates: string;
  totalAmount: number;
  status: BookingStatus;
  notes?: string;
  rejectionReason?: string;
  reconsiderationNote?: string;
  reconsiderationUsed: boolean;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  paymentLines: PaymentLine[];
  messages: BookingMessage[];
  history: BookingHistoryItem[];
}

export interface EligibilityCheckItem {
  ruleId: number;
  name: string;
  status: 'pass' | 'fail' | 'skipped' | 'pending';
  message: string;
  fixAction?: {
    label: string;
    actionType: 'activate_plan' | 'refresh_quote' | 'view_usage';
  };
}

export interface EligibilityResult {
  allPassed: boolean;
  checks: EligibilityCheckItem[];
}

export interface MockApiLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  role: UserRole;
  status: number;
  ruleApplied: string;
  durationMs: number;
  payload?: any;
}

export interface FailureSimulationConfig {
  networkErrorNextWrite: boolean;
  slowResponse: boolean;
  expiredSession: boolean;
}
