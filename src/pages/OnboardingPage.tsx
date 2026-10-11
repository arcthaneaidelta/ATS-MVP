import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store';
import { isValidEthereumAddress } from '../lib/validate';
import { Check, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, addDestination } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [region, setRegion] = useState<string>('United Kingdom');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState<boolean>(true);
  const [destName, setDestName] = useState<string>('Kraken · USDC (Base)');
  const [destAddress, setDestAddress] = useState<string>('0x9C4d88e7A250B3eFa49B7b4759cD9fA1e6D4E21a');
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleStep1 = () => {
    if (!region || !isAgeConfirmed) return;
    updateUser({ region, eligibilityConfirmed: true });
    setStep(2);
  };

  const handleStep2 = async (skip = false) => {
    if (!skip) {
      if (!isValidEthereumAddress(destAddress)) {
        setAddressError('Please provide a valid 42-character 0x EVM address on Base.');
        return;
      }
      await addDestination({
        name: destName || 'Primary Wallet',
        address: destAddress,
        network: 'Base'
      });
    }
    setStep(3);
  };

  const handleFinish = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center p-6 text-left">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-8 shadow-[0_6px_20px_rgba(27,36,32,0.08)]">
        {/* Progress Hairline */}
        <div className="w-full h-1 bg-[#EDE9E1] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#2C4A3E] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Eligibility & Jurisdiction (A5 Enhancement) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B08A4E] block mb-1">
                Step 1 of 3 · Regulatory Compliance (A5)
              </span>
              <h2 className="text-2xl font-display font-medium text-[#1B2420]">
                Jurisdiction & Eligibility
              </h2>
              <p className="text-xs text-[#4A5650] mt-1">
                Pooled prize contributions are subject to regional contest and gaming regulations.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5650] block">
                Primary Residential Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-11 px-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-sm text-[#1B2420] focus:outline-none focus:border-[#2C4A3E]"
              >
                <option value="United Kingdom">United Kingdom (Eligible Sandbox)</option>
                <option value="European Union">European Union (Eligible)</option>
                <option value="United States (Eligible States)">United States (Permitted States)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="p-3.5 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md text-xs text-[#4A5650] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#2C4A3E] inline mr-1 -mt-0.5" />
              Meridian operates non-custodial smart pool algorithms. Participants retain provable verification rights over every round.
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#1B2420] cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={isAgeConfirmed}
                onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-[#DDD8CD] text-[#2C4A3E] focus:ring-[#2C4A3E]"
              />
              <span>
                I confirm that I am at least 18 years of age and legally eligible to participate in skill and prize pools within my jurisdiction.
              </span>
            </label>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={!isAgeConfirmed}
              onClick={handleStep1}
            >
              <span>Continue to Payout Routing</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Withdrawal Destination Setup */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B08A4E] block mb-1">
                Step 2 of 3 · Automated Payouts
              </span>
              <h2 className="text-2xl font-display font-medium text-[#1B2420]">
                Add Payout Destination
              </h2>
              <p className="text-xs text-[#4A5650] mt-1">
                When you win a draw, your prize is automatically routed here. You can change this later.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Destination Label"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                placeholder="e.g. Kraken · USDC or Cold Storage"
              />

              <Input
                label="Base L2 EVM Address"
                value={destAddress}
                onChange={(e) => {
                  setDestAddress(e.target.value);
                  setAddressError(null);
                }}
                error={addressError || undefined}
                placeholder="0x..."
                helperText="Pre-filled with demo recipient address."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => handleStep2(false)}
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleStep2(true)}
              >
                Skip for now
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#7C867F] hover:text-[#1B2420] flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to eligibility</span>
            </button>
          </div>
        )}

        {/* Step 3: Ready */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#E3EBE6] border border-[#2C4A3E] text-[#2C4A3E] mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B08A4E] block mb-1">
                Step 3 of 3 · Setup Complete
              </span>
              <h2 className="text-2xl font-display font-medium text-[#1B2420]">
                You’re Ready to Participate
              </h2>
              <p className="text-xs text-[#4A5650] max-w-sm mx-auto mt-1 leading-relaxed">
                Your sub-wallet deposit address has been generated on Base. You can now fund your balance and enter live pools.
              </p>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md text-left text-xs space-y-1.5 font-mono text-[#4A5650]">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-[#1B2420] font-semibold">Amara Okafor</span>
              </div>
              <div className="flex justify-between">
                <span>Jurisdiction:</span>
                <span className="text-[#1B2420]">{region}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-[#2C4A3E]">Base L2 Mainnet</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleFinish}
            >
              <span>Enter Meridian Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
