import React, { useState } from 'react';
import { Course } from '../../types';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { processPayment } from '../../services/payments';
import {
  X,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  Building,
  GraduationCap,
} from 'lucide-react';

interface CheckoutDrawerProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  course,
  onClose,
  onSuccess,
}) => {
  const { enrollInCourse } = useAcademyStore();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState('');

  const [paymentTab, setPaymentTab] = useState<'card' | 'wallet' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [cardHolder, setCardHolder] = useState('Hira Siddiqui');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('Authorising payment...');
  const [declineError, setDeclineError] = useState<string | null>(null);
  const [show3dsModal, setShow3dsModal] = useState(false);
  const [isSuccessReceipt, setIsSuccessReceipt] = useState(false);

  // Discount calculation
  const discountAmount = Number(((course.price * discountPercent) / 100).toFixed(2));
  const finalPrice = Math.max(0, Number((course.price - discountAmount).toFixed(2)));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      toast('Coupon WELCOME10 applied (10% off)', 'success');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10');
    }
  };

  const handlePay = async () => {
    setDeclineError(null);
    setIsProcessing(true);

    if (course.price === 0) {
      enrollInCourse(course.slug);
      setIsProcessing(false);
      setIsSuccessReceipt(true);
      return;
    }

    try {
      const result = await processPayment(cardNumber, (step) => setProcessingStep(step));

      if (result.status === 'declined') {
        setIsProcessing(false);
        setDeclineError(result.message);
        toast(result.message, 'error');
        return;
      }

      if (result.status === 'requires_3ds') {
        setIsProcessing(false);
        setShow3dsModal(true);
        return;
      }

      // Approved!
      enrollInCourse(course.slug);
      setIsProcessing(false);
      setIsSuccessReceipt(true);
      toast('Enrollment confirmed!', 'success');
    } catch (err) {
      setIsProcessing(false);
      setDeclineError('An unexpected gateway error occurred.');
    }
  };

  const handle3dsApprove = () => {
    setShow3dsModal(false);
    enrollInCourse(course.slug);
    setIsSuccessReceipt(true);
    toast('Enrollment confirmed!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-elevated border-l border-line p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-left font-sans">
        {!isSuccessReceipt ? (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-line mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider">
                  Course Checkout
                </span>
                <h3 className="font-serif text-2xl text-ink font-bold">{course.title}</h3>
              </div>
              <button onClick={onClose} className="p-1 text-ink-3 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Summary Card */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">{course.title}</span>
                <span className="font-mono font-bold text-ink text-sm">
                  ${course.price === 0 ? '0.00' : course.price.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-ink-3">
                Full lifetime access · {course.lessonCount} video lessons · Verifiable certificate
              </p>
            </div>

            {/* Coupon Field */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 mb-6">
              <label className="block text-[10px] uppercase font-bold text-ink-3">
                Promo Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 rounded-md bg-elevated border border-line text-xs font-mono text-ink outline-none"
                  />
                </div>
                <Button type="submit" variant="ghost" size="sm">
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-[11px] text-err">{couponError}</p>}
              {discountPercent > 0 && (
                <p className="text-[11px] text-ok flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>10% Discount Applied (-${discountAmount.toFixed(2)})</span>
                </p>
              )}
            </form>

            {/* Total Line Item */}
            <div className="p-3 rounded-xl bg-bg border border-line space-y-1 font-mono text-xs mb-6">
              <div className="flex justify-between text-ink-3">
                <span>Tuition:</span>
                <span>${course.price.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-ok">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-line flex justify-between font-bold text-sm text-ink">
                <span>Total Due:</span>
                <span>${finalPrice.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-line text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`flex-1 py-2 font-medium border-b-2 ${
                    paymentTab === 'card'
                      ? 'border-slate text-slate font-bold'
                      : 'border-transparent text-ink-3'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('wallet')}
                  className={`flex-1 py-2 font-medium border-b-2 ${
                    paymentTab === 'wallet'
                      ? 'border-slate text-slate font-bold'
                      : 'border-transparent text-ink-3'
                  }`}
                >
                  Apple / Google Pay
                </button>
              </div>

              {paymentTab === 'card' && (
                <div className="space-y-3">
                  <Input
                    label="Cardholder Name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    hint="Test: 4242... (success) or 4000...0002 (decline)"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>

                  {declineError && (
                    <div className="p-3 rounded-lg bg-err-tint border border-err/30 text-err text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{declineError}</span>
                    </div>
                  )}
                </div>
              )}

              {paymentTab === 'wallet' && (
                <div className="p-6 rounded-xl bg-surface border border-line text-center space-y-2">
                  <Smartphone className="w-8 h-8 mx-auto text-slate" />
                  <p className="text-xs font-semibold text-ink">Simulated Fast Wallet</p>
                  <p className="text-[11px] text-ink-3">
                    Click Confirm below to authorize via digital wallet token.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Receipt View */
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-ok-tint text-ok flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-serif text-3xl text-ink">Enrollment Confirmed!</h3>
            <p className="text-xs text-ink-2 max-w-sm mx-auto leading-relaxed">
              You now have full access to <strong>{course.title}</strong>. Your curriculum progress has been linked to your student dashboard.
            </p>
            <div className="p-3 rounded-xl bg-surface border border-line text-xs font-mono max-w-xs mx-auto text-left space-y-1">
              <div className="flex justify-between">
                <span>Receipt:</span>
                <span className="font-bold text-ink">#REC-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>${finalPrice.toFixed(2)} USD</span>
              </div>
            </div>
            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={onSuccess}
                className="bg-slate text-white"
              >
                <span>Start Learning Now</span>
              </Button>
            </div>
          </div>
        )}

        {/* Footer Submit Button */}
        {!isSuccessReceipt && (
          <div className="pt-6 border-t border-line space-y-2">
            <Button
              variant="primary"
              size="md"
              block
              isLoading={isProcessing}
              loadingText={processingStep}
              onClick={handlePay}
              className="bg-slate text-white"
            >
              <span>Confirm & Enroll · ${finalPrice.toFixed(2)} USD</span>
            </Button>
            <p className="text-[10px] text-center text-ink-3">
              Simulated sandbox checkout · 14-day satisfaction guarantee
            </p>
          </div>
        )}

        {/* 3DS Challenge Modal */}
        {show3dsModal && (
          <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
            <div className="w-80 bg-white rounded-2xl p-6 border border-line shadow-2xl text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-slate mx-auto" />
              <h4 className="font-serif text-lg text-ink font-bold">3-D Secure Verification</h4>
              <p className="text-xs text-ink-2">
                Simulated issuer challenge for ${finalPrice.toFixed(2)}.
              </p>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" block onClick={() => setShow3dsModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" block onClick={handle3dsApprove} className="bg-slate text-white">
                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
