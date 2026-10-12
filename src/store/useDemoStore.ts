import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Vehicle, 
  InsurancePackage, 
  Booking, 
  VehicleBlock, 
  Quotation, 
  ActivityItem, 
  SearchContext,
  RateBracket
} from '../types';
import { 
  SEED_VEHICLES, 
  SEED_INSURANCE, 
  SEED_BOOKINGS, 
  SEED_BLOCKS, 
  SEED_QUOTATIONS, 
  SEED_ACTIVITIES 
} from '../data/seed';
import { isAvailable } from '../lib/availability';
import { addDays, format } from 'date-fns';

interface DemoStore {
  vehicles: Vehicle[];
  insurance: InsurancePackage[];
  bookings: Booking[];
  blocks: VehicleBlock[];
  quotations: Quotation[];
  activities: ActivityItem[];
  searchContext: SearchContext;
  adminAuthenticated: boolean;
  holdExpiresAt: number | null; // Timestamp for 10-minute hold

  // Search actions
  setSearchContext: (context: Partial<SearchContext>) => void;
  clearSearchDates: () => void;

  // Booking actions
  createBooking: (
    booking: Omit<Booking, 'id' | 'reference' | 'createdAt'>, 
    forceConflict?: boolean
  ) => { success: boolean; reference?: string; error?: string };
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;

  // Hold timer actions
  startHold: () => void;
  clearHold: () => void;

  // Block actions
  addBlock: (block: Omit<VehicleBlock, 'id'>) => { success: boolean; error?: string };
  removeBlock: (id: string) => void;

  // Quotation actions
  addQuotation: (quote: Omit<Quotation, 'id' | 'reference' | 'createdAt'>) => { reference: string };
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  issueQuotation: (
    id: string, 
    quotedAmount: number, 
    bookingDepositAmount: number, 
    validUntil: string,
    lineItems?: Array<{ id: string; description: string; amount: number }>,
    discountAmount?: number,
    discountNote?: string
  ) => void;
  confirmQuotationBooking: (quoteId: string, coverId: string) => { success: boolean; reference?: string; error?: string };

  // Fleet & pricing management actions
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => { success: boolean; error?: string };
  updateVehicleBrackets: (vehicleId: string, brackets: RateBracket[]) => void;
  copyBracketsToOthers: (sourceVehicleId: string) => void;

  // Insurance actions
  updateInsurancePackage: (id: string, updates: Partial<InsurancePackage>) => void;

  // Admin auth & demo state
  setAdminAuthenticated: (authenticated: boolean) => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  resetDemoData: () => void;
}

const defaultFrom = format(addDays(new Date(), 3), 'yyyy-MM-dd');
const defaultTo = format(addDays(new Date(), 10), 'yyyy-MM-dd');

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      vehicles: SEED_VEHICLES,
      insurance: SEED_INSURANCE,
      bookings: SEED_BOOKINGS,
      blocks: SEED_BLOCKS,
      quotations: SEED_QUOTATIONS,
      activities: SEED_ACTIVITIES,
      searchContext: {
        from: defaultFrom,
        to: defaultTo,
        type: 'all'
      },
      adminAuthenticated: true,
      holdExpiresAt: null,

      setSearchContext: (context) => set((state) => ({
        searchContext: { ...state.searchContext, ...context }
      })),

      clearSearchDates: () => set((state) => ({
        searchContext: { ...state.searchContext, from: '', to: '' }
      })),

      startHold: () => {
        // 10 minutes hold
        set({ holdExpiresAt: Date.now() + 10 * 60 * 1000 });
      },

      clearHold: () => set({ holdExpiresAt: null }),

      createBooking: (bookingData, forceConflict = false) => {
        const { vehicles, bookings, blocks } = get();
        const vehicle = vehicles.find(v => v.id === bookingData.vehicleId);
        const vehicleName = vehicle?.name || 'Selected Vehicle';

        // 1. Check concurrency / conflict simulation
        if (forceConflict) {
          // Log overlap prevented in admin activity feed
          get().addActivity({
            type: 'overlap_prevented',
            title: 'Simultaneous Booking Conflict Prevented',
            description: `A concurrent payment attempt for ${vehicleName} was declined because another customer completed checkout first.`,
            reference: 'CONFLICT-AC8'
          });
          return { success: false, error: 'Vehicle was just reserved by another customer for those dates.' };
        }

        // 2. Real-time availability validation inside transaction
        const available = isAvailable(
          bookingData.vehicleId, 
          bookingData.startDate, 
          bookingData.endDate, 
          bookings, 
          blocks
        );

        if (!available) {
          get().addActivity({
            type: 'overlap_prevented',
            title: 'Overlap Prevented at Checkout',
            description: `Checkout rejected for ${vehicleName}: requested dates (${bookingData.startDate} to ${bookingData.endDate}) conflict with an existing reservation.`,
            reference: 'OVERLAP-RULE'
          });
          return { success: false, error: 'Sorry, this vehicle is no longer available for your selected dates.' };
        }

        // 3. Generate sequential reference number FSR-2026-XXXX
        const randRef = Math.floor(1000 + Math.random() * 9000);
        const reference = `FSR-2026-${randRef}`;
        const newBooking: Booking = {
          ...bookingData,
          id: `book-${Date.now()}`,
          reference,
          createdAt: format(new Date(), 'yyyy-MM-dd')
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          holdExpiresAt: null
        }));

        // Log payment verified activity
        get().addActivity({
          type: 'payment_verified',
          title: 'Online Payment Verified',
          description: `Payment of N$${newBooking.totalAmount.toLocaleString()} verified via simulated DPO for ${vehicleName} (${newBooking.customerName}).`,
          reference
        });

        return { success: true, reference };
      },

      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
      })),

      cancelBooking: (id) => set((state) => {
        const booking = state.bookings.find(b => b.id === id);
        return {
          bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b),
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: 'Just now',
              type: 'booking_created',
              title: 'Booking Cancelled',
              description: `Reservation ${booking?.reference || id} was marked as cancelled.`,
              reference: booking?.reference
            },
            ...state.activities
          ]
        };
      }),

      addBlock: (blockData) => {
        const { bookings, blocks } = get();
        // Check if overlaps with confirmed booking
        const conflictsWithBooking = bookings.some(b => 
          b.vehicleId === blockData.vehicleId && 
          b.status === 'confirmed' &&
          b.startDate < blockData.endDate && 
          b.endDate > blockData.startDate
        );

        if (conflictsWithBooking) {
          return { success: false, error: 'Cannot block vehicle: dates overlap with an existing confirmed booking.' };
        }

        const newBlock: VehicleBlock = {
          ...blockData,
          id: `block-${Date.now()}`
        };

        set((state) => ({
          blocks: [...state.blocks, newBlock]
        }));

        get().addActivity({
          type: 'maintenance_scheduled',
          title: 'Vehicle Block Added',
          description: `${blockData.title} applied from ${blockData.startDate} to ${blockData.endDate}.`,
          reference: newBlock.id
        });

        return { success: true };
      },

      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id)
      })),

      addQuotation: (quoteData) => {
        const randRef = Math.floor(100 + Math.random() * 900);
        const reference = `FSQ-2026-0${randRef}`;
        const newQuote: Quotation = {
          ...quoteData,
          id: `quote-${Date.now()}`,
          reference,
          createdAt: format(new Date(), 'yyyy-MM-dd')
        };

        set((state) => ({
          quotations: [newQuote, ...state.quotations]
        }));

        get().addActivity({
          type: 'quote_received',
          title: `New Quotation Request ${reference}`,
          description: `${newQuote.customerName} requested a quotation for ${newQuote.startDate} to ${newQuote.endDate}.`,
          reference
        });

        return { reference };
      },

      updateQuotation: (id, updates) => set((state) => ({
        quotations: state.quotations.map(q => q.id === id ? { ...q, ...updates } : q)
      })),

      issueQuotation: (id, quotedAmount, bookingDepositAmount, validUntil, lineItems, discountAmount, discountNote) => {
        set((state) => ({
          quotations: state.quotations.map(q => q.id === id ? {
            ...q,
            status: 'quoted',
            quotedAmount,
            bookingDepositAmount,
            validUntil,
            lineItems: lineItems || q.lineItems,
            discountAmount,
            discountNote
          } : q)
        }));

        const quote = get().quotations.find(q => q.id === id);
        get().addActivity({
          type: 'quote_received',
          title: `Quotation Issued ${quote?.reference}`,
          description: `Quote issued to ${quote?.customerName} (Total: N$${quotedAmount.toLocaleString()}, Deposit required: N$${bookingDepositAmount.toLocaleString()}).`,
          reference: quote?.reference
        });
      },

      confirmQuotationBooking: (quoteId, coverId) => {
        const { quotations, vehicles, bookings, blocks } = get();
        const quote = quotations.find(q => q.id === quoteId);
        if (!quote) return { success: false, error: 'Quotation not found.' };

        const targetVehicleId = quote.vehiclePreference[0] || 'hilux-dc';
        const targetVehicle = vehicles.find(v => v.id === targetVehicleId);

        // Availability check
        const available = isAvailable(targetVehicleId, quote.startDate, quote.endDate, bookings, blocks);
        if (!available) {
          return { success: false, error: `Vehicle is no longer available between ${quote.startDate} and ${quote.endDate}.` };
        }

        const randRef = Math.floor(1000 + Math.random() * 9000);
        const bookingRef = `FSR-2026-${randRef}`;

        const newBooking: Booking = {
          id: `book-${Date.now()}`,
          reference: bookingRef,
          vehicleId: targetVehicleId,
          startDate: quote.startDate,
          endDate: quote.endDate,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          customerPhone: quote.customerPhone,
          customerCountry: quote.customerCountry || 'Namibia',
          driverLicence: 'VERIFIED-ON-QUOTE',
          licenceCountry: quote.customerCountry || 'Namibia',
          pickupLocation: quote.pickupLocation,
          coverId,
          rentalTotal: quote.quotedAmount || 10000,
          coverTotal: 0,
          totalAmount: quote.quotedAmount || 10000,
          securityDeposit: targetVehicle?.securityDeposit || 12000,
          depositStatus: 'not_held',
          status: 'confirmed',
          paymentStatus: 'deposit_paid',
          source: 'quote',
          createdAt: format(new Date(), 'yyyy-MM-dd')
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          quotations: state.quotations.map(q => q.id === quoteId ? { ...q, status: 'confirmed' } : q)
        }));

        get().addActivity({
          type: 'payment_verified',
          title: `Booking Confirmed from Quote ${quote.reference}`,
          description: `Converted quotation into confirmed booking ${bookingRef} for ${quote.customerName}.`,
          reference: bookingRef
        });

        return { success: true, reference: bookingRef };
      },

      updateVehicle: (id, updates) => set((state) => ({
        vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
      })),

      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, vehicle]
      })),

      deleteVehicle: (id) => {
        const { bookings } = get();
        const hasFutureBookings = bookings.some(b => b.vehicleId === id && b.status === 'confirmed');
        if (hasFutureBookings) {
          return { success: false, error: 'Cannot delete vehicle: active or upcoming confirmed bookings exist.' };
        }
        set((state) => ({
          vehicles: state.vehicles.filter(v => v.id !== id)
        }));
        return { success: true };
      },

      updateVehicleBrackets: (vehicleId, brackets) => set((state) => ({
        vehicles: state.vehicles.map(v => v.id === vehicleId ? { ...v, brackets } : v)
      })),

      copyBracketsToOthers: (sourceVehicleId) => {
        const { vehicles } = get();
        const source = vehicles.find(v => v.id === sourceVehicleId);
        if (!source) return;
        set((state) => ({
          vehicles: state.vehicles.map(v => v.id !== sourceVehicleId ? { ...v, brackets: JSON.parse(JSON.stringify(source.brackets)) } : v)
        }));
      },

      updateInsurancePackage: (id, updates) => set((state) => ({
        insurance: state.insurance.map(i => i.id === id ? { ...i, ...updates } : i)
      })),

      setAdminAuthenticated: (authenticated) => set({ adminAuthenticated: authenticated }),

      addActivity: (activityData) => set((state) => ({
        activities: [
          {
            ...activityData,
            id: `act-${Date.now()}`,
            timestamp: 'Just now'
          },
          ...state.activities.slice(0, 19) // keep top 20
        ]
      })),

      resetDemoData: () => {
        set({
          vehicles: SEED_VEHICLES,
          insurance: SEED_INSURANCE,
          bookings: SEED_BOOKINGS,
          blocks: SEED_BLOCKS,
          quotations: SEED_QUOTATIONS,
          activities: SEED_ACTIVITIES,
          searchContext: {
            from: defaultFrom,
            to: defaultTo,
            type: 'all'
          },
          holdExpiresAt: null
        });
      }
    }),
    {
      name: 'fsr-demo-v1'
    }
  )
);
