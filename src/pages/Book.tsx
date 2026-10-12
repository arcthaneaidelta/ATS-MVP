import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { Stepper, HoldTimer } from '../components/booking/Stepper';
import { CoverCard } from '../components/booking/CoverCard';
import { DetailsForm, type CustomerFormData } from '../components/booking/DetailsForm';
import { SummaryPanel } from '../components/booking/SummaryPanel';
import { PaymentSheet } from '../components/booking/PaymentSheet';
import { ConflictScreen } from '../components/booking/ConflictScreen';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { quotePrice } from '../lib/pricing';
import { isAvailable } from '../lib/availability';
import { useToast } from '../components/ui/Toast';
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    vehicles, 
    insurance, 
    searchContext, 
    setSearchContext, 
    bookings, 
    blocks, 
    createBooking, 
    holdExpiresAt, 
    startHold, 
    clearHold,
    addActivity
  } = useDemoStore();

  const vehicleIdFromQuery = searchParams.get('vehicle') || 'hilux-dc';
  const fromQuery = searchParams.get('from') || searchContext.from || '2026-11-06';
  const toQuery = searchParams.get('to') || searchContext.to || '2026-11-14';

  const [currentStep, setCurrentStep] = useState(0); // 0: Dates/Car, 1: Cover, 2: Details, 3: Payment
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleIdFromQuery);
  const [startDate, setStartDate] = useState(fromQuery);
  const [endDate, setEndDate] = useState(toQuery);
  const [selectedCoverId, setSelectedCoverId] = useState(searchParams.get('cover') || 'reduced');

  const [customerData, setCustomerData] = useState<CustomerFormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    driverLicence: '',
    licenceCountry: '',
    flightNumber: '',
    pickupLocation: 'Windhoek Hosea Kutako International Airport (WDH)',
    notes: '',
    termsAccepted: false,
  });

  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const cover = insurance.find((i) => i.id === selectedCoverId) || insurance[1];

  const breakdown = quotePrice(vehicle, cover, startDate, endDate);

  // Sync hold timer when moving to Step 2 (Details)
  useEffect(() => {
    if (currentStep === 2 && !holdExpiresAt) {
      startHold();
    }
  }, [currentStep, holdExpiresAt, startHold]);

  const steps = ['Dates & Vehicle', 'Damage Cover', 'Driver Details', 'Payment'];

  const handleNextFromDates = () => {
    // Validate availability before proceeding
    const available = isAvailable(vehicle.id, startDate, endDate, bookings, blocks);
    if (!available) {
      toast({
        type: 'error',
        title: 'Vehicle Unavailable',
        message: 'This vehicle is not available for those dates. Please change vehicle or dates.',
      });
      return;
    }
    setSearchContext({ from: startDate, to: endDate });
    setCurrentStep(1);
  };

  const handleDetailsSubmit = (data: CustomerFormData) => {
    setCustomerData(data);
    setCurrentStep(3);
  };

  const handlePaymentSuccess = () => {
    setPaymentSheetOpen(false);
    clearHold();

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const res = createBooking({
      vehicleId: vehicle.id,
      startDate,
      endDate,
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      customerCountry: customerData.country,
      driverLicence: customerData.driverLicence,
      licenceCountry: customerData.licenceCountry,
      flightNumber: customerData.flightNumber,
      pickupLocation: customerData.pickupLocation,
      notes: customerData.notes,
      coverId: cover.id,
      rentalTotal: breakdown.rentalTotal,
      coverTotal: breakdown.coverTotal,
      totalAmount: breakdown.totalDueNow,
      securityDeposit: breakdown.refundableSecurityDeposit,
      depositStatus: 'held',
      status: 'confirmed',
      paymentStatus: 'paid_in_full',
      source: 'online',
    });

    if (res.success && res.reference) {
      navigate(`/book/confirmed/${res.reference}`);
    }
  };

  const handlePaymentDeclined = () => {
    // Leaves vehicle available: an unpaid attempt is logged but never becomes a reservation
    addActivity({
      type: 'overlap_prevented',
      title: 'Unpaid Attempt (Card Declined)',
      description: `${customerData.fullName || 'Customer'} — card declined for ${vehicle.name} (${startDate} to ${endDate}). No reservation created; vehicle remains available.`,
      reference: 'UNPAID-ATTEMPT',
    });
    toast({
      type: 'warning',
      title: 'Payment Declined by Bank',
      message: 'Card was declined. Your reservation is on hold; no charges occurred.',
    });
  };

  const handlePaymentConflict = () => {
    setPaymentSheetOpen(false);
    setHasConflict(true);
    // Records overlap prevented in admin store
    createBooking(
      {
        vehicleId: vehicle.id,
        startDate,
        endDate,
        customerName: customerData.fullName,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerCountry: customerData.country,
        driverLicence: customerData.driverLicence,
        licenceCountry: customerData.licenceCountry,
        flightNumber: customerData.flightNumber,
        pickupLocation: customerData.pickupLocation,
        coverId: cover.id,
        rentalTotal: breakdown.rentalTotal,
        coverTotal: breakdown.coverTotal,
        totalAmount: breakdown.totalDueNow,
        securityDeposit: breakdown.refundableSecurityDeposit,
        depositStatus: 'not_held',
        status: 'pending',
        paymentStatus: 'unpaid_attempt',
        source: 'online',
      },
      true // force conflict simulation!
    );
  };

  if (hasConflict) {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-8 max-w-content mx-auto">
        <ConflictScreen
          attemptedVehicleId={vehicle.id}
          onResetDates={() => {
            setHasConflict(false);
            setCurrentStep(0);
          }}
        />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-4 sm:px-8 max-w-content mx-auto text-left">
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-10">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(idx) => setCurrentStep(idx)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Interactive Flow Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 0: DATES & VEHICLE CONFIRMATION */}
          {currentStep === 0 && (
            <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-normal text-ink">
                  1. Confirm Trip Dates & Vehicle
                </h3>
                <p className="text-xs sm:text-sm text-ink-2 mt-1">
                  Adjust travel dates or swap vehicles before proceeding to insurance.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-3 mb-1.5">
                  Rental Period
                </label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s);
                    setEndDate(e);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-3 mb-2">
                  Selected Vehicle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.map((v) => {
                    const isSelected = v.id === selectedVehicleId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/10 bg-accent-soft/30'
                            : 'border-border bg-white hover:bg-sand-soft/40'
                        }`}
                      >
                        <img
                          src={v.images[0]}
                          alt={v.name}
                          className="w-14 h-11 rounded object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-ink truncate">{v.name}</div>
                          <div className="text-[10px] text-ink-3">{v.type}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button variant="primary" size="lg" onClick={handleNextFromDates}>
                  Continue to Cover Options →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: DAMAGE COVER */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-ink">
                    2. Select Damage Waiver Cover
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-2 mt-1">
                    Customer excess is the maximum financial contribution in case of vehicle damage. Choose your preferred excess level.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {insurance.map((pkg) => (
                    <CoverCard
                      key={pkg.id}
                      pkg={pkg}
                      days={breakdown.days}
                      isSelected={selectedCoverId === pkg.id}
                      onSelect={() => setSelectedCoverId(pkg.id)}
                    />
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                    ← Back to Vehicle
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => setCurrentStep(2)}>
                    Continue to Driver Details →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DRIVER DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <DetailsForm
                initialData={customerData}
                onSubmit={handleDetailsSubmit}
                onBack={() => setCurrentStep(1)}
              />
            </div>
          )}

          {/* STEP 3: PAYMENT REVIEW */}
          {currentStep === 3 && (
            <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-normal text-ink">
                  4. Review & Confirm Booking
                </h3>
                <p className="text-xs sm:text-sm text-ink-2 mt-1">
                  Verify your trip summary and proceed to the simulated DPO card payment sheet.
                </p>
              </div>

              {/* Verified Driver Summary */}
              <div className="p-4 bg-surface-elevated rounded-lg border border-border text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-border font-semibold text-ink">
                  <span>Driver & Handover Information</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-accent hover:underline text-[11px]"
                  >
                    Edit Details
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-ink-2">
                  <div><strong>Name:</strong> {customerData.fullName}</div>
                  <div><strong>Email:</strong> {customerData.email}</div>
                  <div><strong>Mobile:</strong> {customerData.phone}</div>
                  <div><strong>Licence:</strong> {customerData.driverLicence}</div>
                </div>
                <div className="pt-1 text-ink-3">
                  <strong>Pick-up:</strong> {customerData.pickupLocation}
                </div>
              </div>

              {/* Explanatory notes on the 3 money lines */}
              <div className="p-4 bg-sand-soft/50 rounded-lg border border-border text-xs text-ink-2 space-y-2">
                <div className="font-semibold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Important Financial Clarity</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-ink-3">
                  <li><strong>Total Due Now ({breakdown.days} days):</strong> Charged today via card payment.</li>
                  <li><strong>Security Deposit ({breakdown.refundableSecurityDeposit.toLocaleString()} NAD):</strong> Held as pre-authorisation hold at vehicle pickup in Windhoek. Not charged.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  ← Back to Details
                </Button>

                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setPaymentSheetOpen(true)}
                  icon={<Lock className="w-4 h-4" />}
                >
                  Pay {breakdown.totalDueNow.toLocaleString()} NAD Securely
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Summary Column (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <SummaryPanel
            vehicle={vehicle}
            cover={cover}
            startDate={startDate}
            endDate={endDate}
            breakdown={breakdown}
            holdExpiresAt={holdExpiresAt}
            onEditDates={() => setCurrentStep(0)}
            onEditVehicle={() => setCurrentStep(0)}
            onEditCover={() => setCurrentStep(1)}
            onHoldExpire={() => {
              clearHold();
              setPaymentSheetOpen(false);
              setHoldExpired(true);
            }}
          />
        </div>
      </div>

      {/* Simulated Payment Sheet Modal */}
      <PaymentSheet
        isOpen={paymentSheetOpen}
        onClose={() => setPaymentSheetOpen(false)}
        totalAmount={breakdown.totalDueNow}
        vehicleName={vehicle.name}
        onSuccess={handlePaymentSuccess}
        onDeclined={handlePaymentDeclined}
        onConflict={handlePaymentConflict}
      />

      {/* Hold expiry — form data is retained */}
      <Modal
        isOpen={holdExpired}
        onClose={() => setHoldExpired(false)}
        title="Your hold expired"
        description="We hold a vehicle for 10 minutes while you check out."
      >
        <div className="space-y-4 text-left text-sm text-ink-2">
          <p>
            Check availability again to continue. Your details have been kept, so you won't need to retype them.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setHoldExpired(false); setCurrentStep(0); }}>
              Change dates
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setHoldExpired(false);
                if (isAvailable(vehicle.id, startDate, endDate, bookings, blocks)) {
                  startHold();
                  toast({ type: 'success', title: 'Still available', message: 'Your vehicle is held for another 10 minutes.' });
                } else {
                  setHasConflict(true);
                }
              }}
            >
              Check availability again
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
