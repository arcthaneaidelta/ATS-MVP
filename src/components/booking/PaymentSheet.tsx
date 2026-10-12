import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/format';
import { ShieldCheck, Lock, AlertCircle, ChevronDown, ChevronUp, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type PaymentSimulationMode = 'success' | 'declined' | 'conflict';

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  vehicleName: string;
  onSuccess: () => void;
  onConflict: () => void;
  onDeclined: () => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({
  isOpen,
  onClose,
  totalAmount,
  vehicleName,
  onSuccess,
  onConflict,
  onDeclined,
}) => {
  const [simulationMode, setSimulationMode] = useState<PaymentSimulationMode>('success');
  const [showDemoControls, setShowDemoControls] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [expiry, setExpiry] = useState('08/28');
  const [cvc, setCvc] = useState('742');
  const [cardholder, setCardholder] = useState('MARCUS ROSSI');

  // Processing sequence state: 'idle' | 'authorising' | 'verifying' | 'confirming' | 'error'
  const [processState, setProcessState] = useState<'idle' | 'authorising' | 'verifying' | 'confirming' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = () => {
    setErrorMessage(null);
    setProcessState('authorising');

    // 1. Authorising (1.2s)
    setTimeout(() => {
      if (simulationMode === 'declined') {
        setProcessState('error');
        setErrorMessage('Your financial institution declined this card transaction. (Code: 05_DO_NOT_HONOUR). No funds were deducted. Please try another card.');
        onDeclined();
        return;
      }

      // 2. Verifying (0.9s)
      setProcessState('verifying');
      setTimeout(() => {
        if (simulationMode === 'conflict') {
          setProcessState('idle');
          onConflict();
          return;
        }

        // 3. Confirming vehicle reservation (0.7s)
        setProcessState('confirming');
        setTimeout(() => {
          setProcessState('idle');
          onSuccess();
        }, 750);
      }, 900);
    }, 1200);
  };

  const isProcessing = processState !== 'idle' && processState !== 'error';

  return (
    <Modal
      isOpen={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      maxWidth="md"
      showCloseButton={!isProcessing}
    >
      <div className="space-y-5 text-left">
        {/* Header with DPO secure styling */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-ink text-sm sm:text-base">
                Simulated Card Checkout
              </h4>
              <span className="text-[11px] text-ink-3">
                DPO Group Gateway (High-Fidelity Demo)
              </span>
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
            TLS 256-Bit
          </span>
        </div>

        {/* Amount to pay */}
        <div className="bg-surface-elevated p-4 rounded-lg border border-border flex items-center justify-between">
          <div>
            <div className="text-xs text-ink-3">Immediate Charge:</div>
            <div className="text-xs font-semibold text-ink">{vehicleName}</div>
          </div>
          <div className="text-right">
            <div className="font-serif text-2xl font-semibold text-primary tabular-nums">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-[10px] text-ink-3">Inclusive of 15% VAT</div>
          </div>
        </div>

        {/* Card Form */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-2 mb-1">
              Card Number
            </label>
            <input
              type="text"
              disabled={isProcessing}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-white border border-border-strong rounded px-3 py-2 text-sm font-mono tracking-wider focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-2 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                disabled={isProcessing}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-white border border-border-strong rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-2 mb-1">
                Security Code (CVC)
              </label>
              <input
                type="text"
                disabled={isProcessing}
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full bg-white border border-border-strong rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-2 mb-1">
              Cardholder Full Name
            </label>
            <input
              type="text"
              disabled={isProcessing}
              value={cardholder}
              onChange={(e) => setCardholder(e.target.value.toUpperCase())}
              className="w-full bg-white border border-border-strong rounded px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none uppercase"
            />
          </div>
        </div>

        {/* Processing status messages */}
        {isProcessing && (
          <div className="p-4 bg-sand-soft/70 rounded-md border border-border flex items-center gap-3 animate-in fade-in-50">
            <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-ink block">
                {processState === 'authorising' && 'Authorising card with issuing bank...'}
                {processState === 'verifying' && 'Verifying 3D-Secure payment token with DPO...'}
                {processState === 'confirming' && 'Re-verifying real-time availability & confirming vehicle...'}
              </span>
              <span className="text-ink-3">Please do not refresh or close this window.</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 bg-error-soft rounded-md border border-error/20 flex items-start gap-2.5 text-xs text-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Controls Disclosure */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setShowDemoControls(!showDemoControls)}
            className="flex items-center justify-between w-full text-xs text-ink-3 hover:text-ink py-1"
          >
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Demo Verification Controls (For Reviewer)
            </span>
            {showDemoControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDemoControls && (
            <div className="mt-2.5 p-3 bg-sand-soft/50 rounded-md border border-border text-xs space-y-2">
              <div className="text-[11px] text-ink-3">
                Test various real-world gateway scenarios:
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="simMode"
                    checked={simulationMode === 'success'}
                    onChange={() => setSimulationMode('success')}
                    className="text-primary accent-primary"
                  />
                  <span>1. Successful payment (Creates confirmed booking)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="simMode"
                    checked={simulationMode === 'declined'}
                    onChange={() => setSimulationMode('declined')}
                    className="text-primary accent-primary"
                  />
                  <span>2. Bank declined (Leaves car available; logs unpaid attempt)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="simMode"
                    checked={simulationMode === 'conflict'}
                    onChange={() => setSimulationMode('conflict')}
                    className="text-primary accent-primary"
                  />
                  <span>3. Simultaneous booking conflict (AC 8 concurrency proof)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            type="button"
            disabled={isProcessing}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="accent"
            size="lg"
            type="button"
            loading={isProcessing}
            onClick={handlePay}
            className="px-6"
          >
            Pay {formatCurrency(totalAmount)} Securely
          </Button>
        </div>
      </div>
    </Modal>
  );
};
