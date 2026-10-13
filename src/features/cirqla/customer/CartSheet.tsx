import React, { useState } from 'react';
import { useCirqlaStore } from '../../../store/cirqla';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { processPayment } from '../../../services/payments';
import { useToast } from '../../../components/ui/Toast';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface CartSheetProps {
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
  accent: string;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  onClose,
  onOrderSuccess,
  accent,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTip,
    setCartTip,
    cartCustomerName,
    setCartCustomerName,
    cartNotes,
    setCartNotes,
    cartTable,
    placeOrder,
    activeTenantId,
  } = useCirqlaStore();

  const { toast } = useToast();

  const [paymentTab, setPaymentTab] = useState<'card' | 'wallet' | 'counter'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('882');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('Authorising...');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [show3dsModal, setShow3dsModal] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const serviceCharge = Number((subtotal * 0.05).toFixed(2));
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + serviceCharge + tax + cartTip).toFixed(2));

  const handlePay = async () => {
    if (cart.length === 0) return;
    setPaymentError(null);
    setIsProcessing(true);

    if (paymentTab === 'wallet') {
      setProcessingStep('Biometric verifying...');
      await new Promise((r) => setTimeout(r, 1000));
      const order = placeOrder({
        tenantId: activeTenantId,
        branchId: 'Central',
        table: cartTable,
        customerName: cartCustomerName || 'Guest Diner',
        notes: cartNotes,
        subtotal,
        serviceCharge,
        tax,
        tip: cartTip,
        total,
        paymentStatus: 'Paid',
        paymentMethod: 'wallet',
      });
      setIsProcessing(false);
      onOrderSuccess(order.id);
      return;
    }

    if (paymentTab === 'counter') {
      const order = placeOrder({
        tenantId: activeTenantId,
        branchId: 'Central',
        table: cartTable,
        customerName: cartCustomerName || 'Guest Diner',
        notes: cartNotes,
        subtotal,
        serviceCharge,
        tax,
        tip: cartTip,
        total,
        paymentStatus: 'Pay at counter',
        paymentMethod: 'counter',
      });
      setIsProcessing(false);
      onOrderSuccess(order.id);
      return;
    }

    // Card Payment via payment service
    try {
      const result = await processPayment(cardNumber, (step) => setProcessingStep(step));

      if (result.status === 'declined') {
        setIsProcessing(false);
        setPaymentError(result.message);
        toast(result.message, 'error');
        return;
      }

      if (result.status === 'requires_3ds') {
        setIsProcessing(false);
        setShow3dsModal(true);
        return;
      }

      // Approved!
      const order = placeOrder({
        tenantId: activeTenantId,
        branchId: 'Central',
        table: cartTable,
        customerName: cartCustomerName || 'Guest Diner',
        notes: cartNotes,
        subtotal,
        serviceCharge,
        tax,
        tip: cartTip,
        total,
        paymentStatus: 'Paid',
        paymentMethod: 'card',
      });

      setIsProcessing(false);
      onOrderSuccess(order.id);
    } catch (err) {
      setIsProcessing(false);
      setPaymentError('An unexpected payment gateway error occurred.');
    }
  };

  const handle3dsApprove = () => {
    setShow3dsModal(false);
    const order = placeOrder({
      tenantId: activeTenantId,
      branchId: 'Central',
      table: cartTable,
      customerName: cartCustomerName || 'Guest Diner',
      notes: cartNotes,
      subtotal,
      serviceCharge,
      tax,
      tip: cartTip,
      total,
      paymentStatus: 'Paid',
      paymentMethod: 'card',
    });
    onOrderSuccess(order.id);
  };

  return (
    <div className="absolute inset-0 z-40 bg-ink/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 text-left">
      <div className="w-full max-h-[92%] bg-elevated rounded-t-3xl border-t border-line shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-3 border-b border-line flex items-center justify-between shrink-0 bg-surface/60">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-ink tracking-wider">
              Your Order · Table {cartTable}
            </span>
            <span className="font-mono text-xs text-ink-3">({cart.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-3 hover:text-ink rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-ink-3">
              Your cart is empty. Tap + on dishes to add them.
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-surface border border-line flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink text-xs truncate">
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-xs text-ink ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-[11px] text-ink-3 truncate mt-0.5">
                          {item.modifiers.map((m) => m.optionName).join(', ')}
                        </p>
                      )}
                      {item.instructions && (
                        <p className="text-[10px] text-clay italic mt-0.5">
                          Note: {item.instructions}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-bg border border-line flex items-center justify-center text-ink"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-bg border border-line flex items-center justify-center text-ink"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-err/70 hover:text-err ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Diner Name & Notes */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                    Name for Order
                  </label>
                  <input
                    type="text"
                    placeholder="Marcus V."
                    value={cartCustomerName}
                    onChange={(e) => setCartCustomerName(e.target.value)}
                    className="w-full h-8 px-2 rounded bg-surface border border-line text-xs font-sans text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                    Table Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Bring together"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                    className="w-full h-8 px-2 rounded bg-surface border border-line text-xs font-sans text-ink outline-none"
                  />
                </div>
              </div>

              {/* Tip Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                  Add Tip for the Team
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 2.0, 3.5, 5.0].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCartTip(t)}
                      className={`py-1.5 rounded text-xs font-mono font-medium border ${
                        cartTip === t
                          ? 'bg-elevated border-primary text-primary font-bold'
                          : 'bg-surface border-line text-ink-3'
                      }`}
                    >
                      {t === 0 ? 'No tip' : `$${t.toFixed(2)}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="p-3 rounded-xl bg-surface border border-line space-y-1 font-mono text-xs">
                <div className="flex justify-between text-ink-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-3 text-[11px]">
                  <span>Service charge (5%)</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-3 text-[11px]">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {cartTip > 0 && (
                  <div className="flex justify-between text-clay text-[11px]">
                    <span>Staff tip</span>
                    <span>${cartTip.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-line flex justify-between font-bold text-sm text-ink">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <div className="flex border-b border-line text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('card')}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium ${
                      paymentTab === 'card'
                        ? 'border-clay text-clay font-bold'
                        : 'border-transparent text-ink-3'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('wallet')}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium ${
                      paymentTab === 'wallet'
                        ? 'border-clay text-clay font-bold'
                        : 'border-transparent text-ink-3'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('counter')}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium ${
                      paymentTab === 'counter'
                        ? 'border-clay text-clay font-bold'
                        : 'border-transparent text-ink-3'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Counter</span>
                  </button>
                </div>

                {paymentTab === 'card' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                        Card Number (Test Cards Enabled)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-8 px-2.5 rounded bg-elevated border border-line font-mono text-xs text-ink outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-8 px-2.5 rounded bg-elevated border border-line font-mono text-xs text-ink outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full h-8 px-2.5 rounded bg-elevated border border-line font-mono text-xs text-ink outline-none"
                        />
                      </div>
                    </div>

                    {/* Test card hint pill */}
                    <div className="p-2 rounded bg-bg border border-line text-[10px] text-ink-3 font-mono">
                      <span>Success: <code>4242...</code> · Decline: <code>4000...0002</code></span>
                    </div>

                    {paymentError && (
                      <div className="p-2.5 rounded-lg bg-err-tint border border-err/30 text-err text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{paymentError}</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentTab === 'wallet' && (
                  <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-2">
                    <Smartphone className="w-6 h-6 mx-auto text-primary" />
                    <p className="text-xs font-semibold text-ink">Simulated Fast Checkout</p>
                    <p className="text-[11px] text-ink-3">
                      One-tap biometric checkout will authorize with stored credential.
                    </p>
                  </div>
                )}

                {paymentTab === 'counter' && (
                  <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-2">
                    <Banknote className="w-6 h-6 mx-auto text-ok" />
                    <p className="text-xs font-semibold text-ink">Pay at Counter Upon Collection</p>
                    <p className="text-[11px] text-ink-3">
                      Your order will be fired to the kitchen immediately.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sticky Pay Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-line bg-elevated shrink-0">
            <Button
              variant="primary"
              size="md"
              block
              isLoading={isProcessing}
              loadingText={processingStep}
              onClick={handlePay}
              style={{ backgroundColor: accent }}
            >
              <span>Pay & Send to Kitchen · ${total.toFixed(2)}</span>
            </Button>
          </div>
        )}
      </div>

      {/* 3-D Secure Challenge Modal Simulation */}
      {show3dsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60">
          <div className="w-80 bg-white rounded-xl p-5 border border-line shadow-2xl text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
            <h4 className="font-serif text-lg text-ink font-semibold">3-D Secure Challenge</h4>
            <p className="text-xs text-ink-2">
              Your bank requires verification for this ${total.toFixed(2)} transaction.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                block
                onClick={() => {
                  setShow3dsModal(false);
                  setPaymentError('3-D Secure authentication was cancelled.');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                block
                onClick={handle3dsApprove}
                style={{ backgroundColor: accent }}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
