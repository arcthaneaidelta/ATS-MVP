import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatAddress } from '../lib/format';
import { isValidEthereumAddress } from '../lib/validate';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { StatusChip } from '../components/ui/StatusChip';
import { AddressField } from '../components/ui/AddressField';
import { useToast } from '../components/ui/Toast';
import { Destination, Transaction } from '../types';
import {
  ArrowUpRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  Lock
} from 'lucide-react';

export const WithdrawalsPage: React.FC = () => {
  const {
    availableBalance,
    destinations,
    transactions,
    addDestination,
    setDefaultDestination,
    removeDestination,
    withdrawToDestination
  } = useAppStore();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Add destination state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(3);
  const [isSavingDest, setIsSavingDest] = useState(false);

  // Manual withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('50');
  const [withdrawDestId, setWithdrawDestId] = useState<string>(
    destinations.find((d) => d.status === 'active')?.id || destinations[0]?.id || ''
  );
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const payoutHistory = transactions.filter((t) => t.type === 'payout' || t.type === 'win');

  const handleOpenAdd = () => {
    setName('');
    setAddress('');
    setAddressError(null);
    setOtpStep(false);
    setOtpCode('');
    setOtpError(null);
    setOtpAttempts(3);
    setIsAddModalOpen(true);
  };

  const handleNextOtp = () => {
    if (!isValidEthereumAddress(address)) {
      setAddressError('Invalid Base L2 address format. Must be 42 characters starting with 0x.');
      return;
    }
    setAddressError(null);
    setOtpStep(true);
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== '123456') {
      const remaining = otpAttempts - 1;
      setOtpAttempts(remaining);
      if (remaining <= 0) {
        setOtpError('Maximum 3 attempts reached. Session locked for 15 minutes.');
      } else {
        setOtpError(`Invalid code. Try test code "123456" (${remaining} attempts left).`);
      }
      return;
    }

    setIsSavingDest(true);
    await addDestination({
      name: name || 'External Wallet',
      address,
      network: 'Base'
    });
    setIsSavingDest(false);
    setIsAddModalOpen(false);

    toast({
      type: 'success',
      title: 'Destination Added',
      message: 'New address added with 24h security cooling-off lock.'
    });
  };

  const handleExecuteWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > availableBalance) {
      toast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Withdrawal amount exceeds available balance.'
      });
      return;
    }

    setIsWithdrawing(true);
    const res = await withdrawToDestination(amt, withdrawDestId);
    setIsWithdrawing(false);

    if (res.success) {
      setIsWithdrawModalOpen(false);
      toast({
        type: 'success',
        title: 'Withdrawal Dispatched',
        message: `${formatCurrency(amt)} dispatched to destination with $0.002 network fee.`
      });
    } else {
      toast({
        type: 'error',
        title: 'Withdrawal Failed',
        message: res.error || 'Failed to dispatch withdrawal.'
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
            Withdrawals & Automated Payouts
          </h1>
          <p className="text-xs text-[#7C867F] mt-1">
            Pre-saved withdrawal destinations with 24-hour security cooling-off protection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Manual Withdrawal</span>
          </Button>
        </div>
      </div>

      {/* Destinations Panel */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD] mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Saved Payout Destinations
            </h3>
            <p className="text-xs text-[#7C867F]">
              Winnings are automatically routed to your default active destination
            </p>
          </div>
          <span className="text-xs font-mono text-[#7C867F]">
            {destinations.length} configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className={`p-5 rounded-lg border flex flex-col justify-between text-left transition-all ${
                dest.isDefault
                  ? 'bg-[#FBF9F5] border-[#2C4A3E] shadow-sm'
                  : 'bg-[#FFFFFF] border-[#DDD8CD]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CD]/60 mb-3">
                  <span className="text-xs font-semibold text-[#1B2420]">
                    {dest.name}
                  </span>
                  {dest.isDefault && (
                    <span className="text-[10px] font-semibold bg-[#2C4A3E] text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs text-[#4A5650] break-all mb-4 bg-[#EDE9E1] p-2 rounded">
                  {dest.address}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <StatusChip
                    status={dest.status === 'active' ? 'success' : 'warning'}
                    label={dest.status === 'active' ? 'Active' : 'Cooling-off (24h Lock)'}
                    isPulsing={dest.status === 'cooling_off'}
                  />
                  {dest.status === 'cooling_off' && (
                    <span className="text-[11px] text-[#B7791F] flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Active in 23h 59m</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD8CD]/60 flex items-center justify-between text-xs">
                {!dest.isDefault && dest.status === 'active' ? (
                  <button
                    type="button"
                    onClick={() => setDefaultDestination(dest.id)}
                    className="text-[#2C4A3E] hover:underline font-medium cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[#7C867F]">
                    {dest.isDefault ? 'Primary destination' : 'Locked until active'}
                  </span>
                )}

                {!dest.isDefault && (
                  <button
                    type="button"
                    onClick={() => removeDestination(dest.id)}
                    className="text-[#7C867F] hover:text-[#A8453A] p-1 cursor-pointer"
                    title="Remove destination"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout History Panel */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD] mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Dispatched Payouts & Prize Distribution
            </h3>
            <p className="text-xs text-[#7C867F]">
              Click any payout row to view the Base L2 broadcast confirmation timeline
            </p>
          </div>
          <span className="text-xs font-mono text-[#7C867F]">
            Avg fee: ≈ $0.002
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDD8CD] text-[#7C867F] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Destination Reference</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Network Fee</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CD]/40">
              {payoutHistory.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 uppercase text-[11px] font-mono text-[#7C867F]">
                    {tx.type}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1B2420]">
                    {tx.reference} {tx.destinationName ? `→ ${tx.destinationName}` : ''}
                  </td>
                  <td className="py-3 px-3">
                    <StatusChip
                      status="success"
                      label="Arrived"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono text-[#7C867F]">
                    ${tx.networkFee?.toFixed(4) || '0.0020'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#3E7D5A]">
                    {formatCurrency(Math.abs(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Destination Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={otpStep ? '2-Factor Verification' : 'Add Withdrawal Destination'}
        description={
          otpStep
            ? 'Enter the 6-digit verification code sent to your registered email.'
            : 'Register an external Base L2 EVM address for automated prize distribution.'
        }
      >
        <div className="space-y-4 text-left">
          {!otpStep ? (
            <>
              <Input
                label="Destination Label"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coinbase Deposit, Ledger Cold Storage"
              />

              <Input
                label="Base L2 EVM Address"
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressError(null);
                }}
                error={addressError || undefined}
                placeholder="0x..."
                helperText="Must be a valid 42-character Ethereum / Base hex address."
              />

              <div className="p-3 bg-[#EDE9E1] rounded text-xs text-[#4A5650] flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#B08A4E] shrink-0 mt-0.5" />
                <p>
                  <strong>Security Cooling-Off:</strong> Newly added withdrawal destinations are locked for 24 hours before they can receive funds, protecting your balance against unauthorized account takeovers.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleNextOtp}>
                  Next: Verify Code
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                label="6-Digit Verification Code"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError(null);
                }}
                error={otpError || undefined}
                placeholder="123456"
                helperText='Interactive demo test code is "123456". Enter any other code to test failure lockout.'
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setOtpStep(false)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  isLoading={isSavingDest}
                  disabled={otpAttempts <= 0}
                  onClick={handleVerifyOtp}
                >
                  Verify & Save Destination
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Manual Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Manual Balance Withdrawal"
        description="Withdraw available USDC to a registered destination."
      >
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between text-xs text-[#4A5650]">
            <span>Available Balance:</span>
            <span className="font-mono font-semibold text-[#1B2420]">
              {formatCurrency(availableBalance)}
            </span>
          </div>

          <div className="relative">
            <Input
              label="Withdrawal Amount ($)"
              type="number"
              prefixText="$"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setWithdrawAmount(availableBalance.toString())}
              className="absolute right-3 top-8 text-xs font-semibold text-[#2C4A3E] hover:underline cursor-pointer"
            >
              MAX
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5650] block">
              Destination
            </label>
            <select
              value={withdrawDestId}
              onChange={(e) => setWithdrawDestId(e.target.value)}
              className="w-full h-11 px-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs font-mono text-[#1B2420] focus:outline-none focus:border-[#2C4A3E]"
            >
              {destinations.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                  disabled={d.status === 'cooling_off'}
                >
                  {d.name} ({formatAddress(d.address, 6, 4)}) {d.status === 'cooling_off' ? '— [Locked in 24h cooling-off]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded text-xs space-y-1">
            <div className="flex justify-between text-[#7C867F]">
              <span>Base Network Fee:</span>
              <span className="font-mono text-[#1B2420]">≈ $0.002</span>
            </div>
            <div className="flex justify-between text-[#7C867F]">
              <span>Net Received:</span>
              <span className="font-mono text-[#2C4A3E] font-semibold">
                {formatCurrency(Math.max(0, (parseFloat(withdrawAmount) || 0) - 0.002))}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsWithdrawModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isWithdrawing}
              onClick={handleExecuteWithdrawal}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payout Detail Drawer */}
      <Drawer
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Payout Routing Timeline"
        subtitle={selectedTx?.id}
      >
        {selectedTx && (
          <div className="flex flex-col gap-6 text-left text-xs">
            <div className="p-4 bg-[#F1E7D3] border border-[#B08A4E]/30 rounded-md">
              <span className="text-xs text-[#B08A4E] font-semibold uppercase tracking-wider block">
                Dispatched Prize Amount
              </span>
              <span className="text-3xl font-display font-medium text-[#1B2420]">
                {formatCurrency(Math.abs(selectedTx.amount))}
              </span>
            </div>

            {/* 4-Step Timeline */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F] block">
                Automated Settlement Lifecycle
              </span>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-[#1B2420]">Queued by Smart Contract</h4>
                  <p className="text-[#7C867F]">Draw confirmed on block height 38,219,842.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-[#1B2420]">Broadcast to Base L2</h4>
                  <p className="text-[#7C867F]">Batch relayer executed ERC-20 transfer.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-[#1B2420]">Confirmed on L2</h4>
                  <p className="text-[#7C867F]">12 / 12 block validations finalized.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3E7D5A] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-[#3E7D5A]">Arrived to Destination</h4>
                  <p className="text-[#7C867F]">Delivered to {selectedTx.destinationName || 'Kraken · USDC'}.</p>
                </div>
              </div>
            </div>

            {selectedTx.txHash && (
              <AddressField
                label="On-Chain Settlement Hash"
                address={selectedTx.txHash}
                isTruncated={false}
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
