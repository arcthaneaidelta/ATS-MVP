import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { AddressField } from '../ui/AddressField';
import { useAppStore } from '../../store';
import { useToast } from '../ui/Toast';
import { ArrowDownLeft, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

export const AddFundsDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { user, simulateDeposit } = useAppStore();
  const { toast } = useToast();

  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [depositStep, setDepositStep] = useState<number>(0); // 0 idle, 1 detected, 2 confirming 3/12, 3 confirming 12/12, 4 credited
  const [simError, setSimError] = useState<string | null>(null);

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : depositAmount;

  const handleSimulate = async () => {
    if (activeAmount < 5) {
      setSimError('Below $5.00 minimum. Sub-minimum deposits require manual compliance review.');
      return;
    }
    setSimError(null);
    setIsSimulating(true);

    try {
      await simulateDeposit(activeAmount, (step) => {
        setDepositStep(step);
      });

      toast({
        type: 'success',
        title: 'Deposit Credited',
        message: `${formatCurrency(activeAmount)} USDC has been credited to your available balance.`
      });

      setTimeout(() => {
        setIsSimulating(false);
        setDepositStep(0);
        onClose();
      }, 1200);
    } catch {
      setIsSimulating(false);
      setDepositStep(0);
    }
  };

  const handleWrongNetworkSim = () => {
    setSimError('Received on unsupported network (Ethereum Mainnet). Assets held in recovery custody. Contact support.');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      preventClose={isSimulating}
      title="Add Funds"
      subtitle="Fund your sub-wallet balance via Base L2 USDC"
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Network and Currency Header Chip */}
        <div className="flex items-center justify-between p-3 bg-[#EDE9E1] rounded-md border border-[#DDD8CD]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E7D5A]" />
            <span className="text-xs font-semibold text-[#1B2420]">
              Network: Base (Ethereum L2)
            </span>
          </div>
          <span className="text-xs font-mono text-[#2C4A3E] font-medium bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DDD8CD]">
            Asset: USDC
          </span>
        </div>

        {/* QR Code and Address Card */}
        <div className="flex flex-col items-center bg-[#FBF9F5] border border-[#DDD8CD] rounded-lg p-5">
          <div className="p-3 bg-white border border-[#DDD8CD] rounded-md mb-4 shadow-sm">
            <QRCodeSVG
              value={user.depositAddress}
              size={156}
              level="M"
              includeMargin={false}
              fgColor="#1B2420"
            />
          </div>

          <div className="w-full">
            <AddressField
              label="Your Dedicated Sub-Wallet Deposit Address"
              address={user.depositAddress}
              isTruncated={false}
            />
          </div>

          <div className="w-full flex items-center justify-between text-[11px] text-[#7C867F] mt-3 pt-3 border-t border-[#DDD8CD]">
            <span>Minimum: $5.00 USDC</span>
            <span>Network fee: ≈ $0.002</span>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="p-3.5 bg-[#EDE9E1]/50 border border-[#DDD8CD] rounded-md flex items-start gap-2.5 text-xs text-[#4A5650]">
          <ArrowDownLeft className="w-4 h-4 text-[#2C4A3E] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Funds sent to this address are automatically swept into your account dollar balance. No wallet extension or manual claim required.
          </p>
        </div>

        {/* In-progress Deposit Lifecycle Stepper */}
        {isSimulating && (
          <div className="p-4 bg-[#FFFFFF] border border-[#2C4A3E] rounded-md shadow-sm flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1B2420]">
              <span>Simulated Deposit Status</span>
              <span className="font-mono text-[#2C4A3E]">{formatCurrency(activeAmount)}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    depositStep >= 1 ? 'bg-[#2C4A3E] text-white' : 'bg-[#DDD8CD]'
                  }`}
                >
                  {depositStep > 1 ? '✓' : '1'}
                </div>
                <span className={depositStep >= 1 ? 'font-medium text-[#1B2420]' : 'text-[#7C867F]'}>
                  Detected incoming tx on Base mempool
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    depositStep >= 2 ? 'bg-[#2C4A3E] text-white' : 'bg-[#DDD8CD]'
                  }`}
                >
                  {depositStep > 2 ? '✓' : '2'}
                </div>
                <span className={depositStep >= 2 ? 'font-medium text-[#1B2420]' : 'text-[#7C867F]'}>
                  Confirming (3 / 12 block validations)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    depositStep >= 3 ? 'bg-[#2C4A3E] text-white' : 'bg-[#DDD8CD]'
                  }`}
                >
                  {depositStep > 3 ? '✓' : '3'}
                </div>
                <span className={depositStep >= 3 ? 'font-medium text-[#1B2420]' : 'text-[#7C867F]'}>
                  Confirming (12 / 12 block finality reached)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    depositStep >= 4 ? 'bg-[#3E7D5A] text-white' : 'bg-[#DDD8CD]'
                  }`}
                >
                  ✓
                </div>
                <span className={depositStep >= 4 ? 'font-semibold text-[#3E7D5A]' : 'text-[#7C867F]'}>
                  Credited to dollar balance
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Controls Section (Dashed border box per PRD Section 11.2) */}
        <div className="p-4 bg-[#FBF9F5] border-2 border-dashed border-[#C7C1B3] rounded-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F]">
              Demo Control · Simulate Deposit
            </span>
            <span className="text-[10px] bg-[#EDE9E1] px-1.5 py-0.5 rounded text-[#4A5650] font-mono">
              Testnet Mock
            </span>
          </div>

          <p className="text-xs text-[#4A5650]">
            Simulate a realistic Base L2 deposit and watch the automatic sweep confirmation flow.
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={isSimulating}
                onClick={() => {
                  setDepositAmount(amt);
                  setCustomAmount('');
                }}
                className={`h-9 rounded text-xs font-mono font-medium transition-colors border cursor-pointer ${
                  depositAmount === amt && !customAmount
                    ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]'
                    : 'bg-[#EDE9E1] text-[#1B2420] border-[#DDD8CD] hover:bg-[#DDD8CD]'
                }`}
              >
                ${amt}
              </button>
            ))}

            <input
              type="number"
              placeholder="Custom"
              value={customAmount}
              disabled={isSimulating}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="h-9 px-2 bg-[#EDE9E1] border border-[#DDD8CD] rounded text-xs font-mono text-center focus:outline-none focus:border-[#2C4A3E]"
            />
          </div>

          {simError && (
            <div className="p-2.5 bg-[#A8453A]/10 border border-[#A8453A]/30 rounded text-xs text-[#A8453A] flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{simError}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="primary"
              size="md"
              isLoading={isSimulating}
              onClick={handleSimulate}
            >
              Simulate ${activeAmount.toFixed(2)} Deposit
            </Button>

            <button
              type="button"
              disabled={isSimulating}
              onClick={handleWrongNetworkSim}
              className="text-xs text-[#7C867F] hover:text-[#A8453A] underline text-center cursor-pointer py-1"
            >
              Simulate Wrong Network Error (Edge Case Test)
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
