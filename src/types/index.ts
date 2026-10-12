export interface RateBracket {
  from: number;
  to: number | null; // null means unbounded (e.g. 21+)
  dailyRate: number;
}

export type VehicleCategory = '4x4' | 'suv' | 'compact' | 'van';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  category: VehicleCategory;
  seats: number;
  transmission: 'Manual' | 'Automatic';
  fuel: 'Diesel' | 'Petrol';
  luggage: string;
  features: string[];
  description: string;
  images: string[];
  brackets: RateBracket[];
  securityDeposit: number;
  active: boolean;
  featured?: boolean;
}

export interface InsurancePackage {
  id: string;
  name: string;
  dailyPrice: number;
  excess: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  popular?: boolean;
  active: boolean;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid_attempt' | 'paid_in_full' | 'deposit_paid' | 'refunded';
export type SecurityDepositStatus = 'not_held' | 'held' | 'released';
export type BookingSource = 'online' | 'quote' | 'offline';

export interface Booking {
  id: string;
  reference: string;
  vehicleId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  driverLicence: string;
  licenceCountry: string;
  flightNumber?: string;
  pickupLocation: string;
  notes?: string;
  coverId: string;
  rentalTotal: number;
  coverTotal: number;
  totalAmount: number;
  securityDeposit: number;
  depositStatus: SecurityDepositStatus;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  source: BookingSource;
  createdAt: string;
}

export interface VehicleBlock {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  reason: 'maintenance' | 'offline_booking' | 'admin_hold';
  title: string;
  customerName?: string;
  notes?: string;
}

export type QuotationStatus = 'new' | 'in_review' | 'quoted' | 'deposit_paid' | 'confirmed' | 'expired';

export interface QuotationLineItem {
  id: string;
  description: string;
  amount: number;
}

export interface Quotation {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry?: string;
  startDate: string;
  endDate: string;
  vehiclePreference: string[]; // vehicle ids
  driverCount: number;
  pickupLocation: string;
  dropoffLocation: string;
  message?: string;
  status: QuotationStatus;
  quotedAmount?: number;
  bookingDepositAmount?: number;
  validUntil?: string;
  lineItems?: QuotationLineItem[];
  discountAmount?: number;
  discountNote?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'payment_verified' | 'quote_received' | 'overlap_prevented' | 'booking_created' | 'maintenance_scheduled';
  title: string;
  description: string;
  reference?: string;
}

export interface PriceQuoteBreakdown {
  days: number;
  bracket: RateBracket;
  dailyRate: number;
  rentalTotal: number;
  coverDailyPrice: number;
  coverTotal: number;
  totalDueNow: number;
  refundableSecurityDeposit: number;
  bookingDeposit: number; // for quotes
  standardDailyRate: number;
  savingsTotal: number;
}

export interface SearchContext {
  from: string;
  to: string;
  type: string; // 'all' | '4x4' | 'suv' | 'compact' | 'van'
}
