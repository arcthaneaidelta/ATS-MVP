import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatTxHash } from '../lib/format';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { AddressField } from '../components/ui/AddressField';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';
import { Drawer } from '../components/ui/Drawer';
import { Transaction } from '../types';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  Clock
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { availableBalance, activeEntriesBalance, user, transactions } = useAppStore();

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTx = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
            Wallet & Sub-Wallet Custody
          </h1>
          <p className="text-xs text-[#7C867F] mt-1">
            Deterministic deposit sweep addresses and ledger history on Base L2
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddFundsOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add funds</span>
        </Button>
      </div>

      {/* Balance Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 shadow-[0_1px_2px_rgba(27,36,32,0.05)]">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
            Available Balance
          </span>
          <span className="text-3xl font-display font-medium text-[#1B2420] tabular-nums block my-1">
            {formatCurrency(availableBalance)}
          </span>
          <span className="text-[11px] text-[#3E7D5A] font-medium">
            USDC · Ready for pool entry or withdrawal
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 shadow-[0_1px_2px_rgba(27,36,32,0.05)]">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
            Active In Entries
          </span>
          <span className="text-3xl font-display font-medium text-[#1B2420] tabular-nums block my-1">
            {formatCurrency(activeEntriesBalance)}
          </span>
          <span className="text-[11px] text-[#7C867F]">
            Locked into pending draws
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 shadow-[0_1px_2px_rgba(27,36,32,0.05)]">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
            Base L2 Network Fee
          </span>
          <span className="text-3xl font-display font-medium text-[#2C4A3E] tabular-nums block my-1">
            ≈ $0.002
          </span>
          <span className="text-[11px] text-[#7C867F]">
            Near-zero transaction overhead
          </span>
        </div>
      </div>

      {/* Deposit Address Card */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD8CD] gap-2">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Your Dedicated Deposit Address
            </h3>
            <p className="text-xs text-[#7C867F]">
              Send USDC on Base directly to this address. Funds are automatically detected and credited.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowExplainer(!showExplainer)}
            className="text-xs text-[#2C4A3E] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why is my address unique?</span>
          </button>
        </div>

        {/* Popover Explainer */}
        {showExplainer && (
          <div className="p-4 bg-[#EDE9E1] rounded-md text-xs text-[#4A5650] leading-relaxed animate-in fade-in space-y-2">
            <h4 className="font-semibold text-[#1B2420]">
              Deterministic Sub-Wallet Routing
            </h4>
            <p>
              Meridian provisions a unique smart wallet address for each user derived using CREATE2. When USDC is deposited to your specific address, an automated background listener detects the incoming transaction, validates confirmations on Base, sweeps the tokens, and immediately credits your dollar account.
            </p>
            <p>
              This architecture gives users zero-friction Web2 simplicity without managing private keys or paying gas.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
          <div className="flex-1">
            <AddressField
              label="Deposit Address (Base L2 USDC Only)"
              address={user.depositAddress}
              isTruncated={false}
            />
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsAddFundsOpen(true)}
            className="shrink-0"
          >
            Simulate a Deposit
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD8CD] gap-4 mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Transaction History
            </h3>
            <p className="text-xs text-[#7C867F]">
              Click any transaction row to inspect on-chain settlement details
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EDE9E1] rounded-md text-xs">
            {['all', 'deposit', 'entry', 'win', 'payout'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#FFFFFF] text-[#1B2420] font-semibold shadow-sm'
                    : 'text-[#4A5650] hover:text-[#1B2420]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDD8CD] text-[#7C867F] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Network Fee</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CD]/40">
              {filteredTx.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 uppercase text-[11px] font-mono font-medium text-[#7C867F]">
                    {tx.type}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1B2420]">{tx.reference}</td>
                  <td className="py-3 px-3">
                    <StatusChip
                      status={tx.status === 'credited' || tx.status === 'arrived' ? 'success' : 'warning'}
                      label={tx.status}
                    />
                  </td>
                  <td className="py-3 px-3 font-mono text-[#7C867F]">
                    ${tx.networkFee?.toFixed(4) || '0.0020'}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-semibold ${
                      tx.amount > 0 ? 'text-[#3E7D5A]' : 'text-[#1B2420]'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      <Drawer
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Details"
        subtitle={selectedTx?.id}
      >
        {selectedTx && (
          <div className="flex flex-col gap-5 text-left text-xs">
            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md">
              <span className="text-[#7C867F] block uppercase tracking-wider font-semibold">
                Amount
              </span>
              <span
                className={`text-3xl font-display font-medium ${
                  selectedTx.amount > 0 ? 'text-[#3E7D5A]' : 'text-[#1B2420]'
                }`}
              >
                {selectedTx.amount > 0 ? '+' : ''}{formatCurrency(selectedTx.amount)}
              </span>
              <span className="text-[#7C867F] block mt-1">
                Settled in USDC on Base L2
              </span>
            </div>

            <div className="space-y-3 p-4 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md">
              <div className="flex justify-between">
                <span className="text-[#7C867F]">Transaction Type:</span>
                <span className="font-semibold uppercase text-[#1B2420]">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C867F]">Status:</span>
                <span className="text-[#3E7D5A] font-semibold">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C867F]">Confirmations:</span>
                <span className="font-mono text-[#1B2420]">12 / 12 (Finalized)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C867F]">Network Fee:</span>
                <span className="font-mono text-[#1B2420]">
                  ${selectedTx.networkFee?.toFixed(4) || '0.0021'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C867F]">Timestamp:</span>
                <span className="text-[#1B2420]">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
            </div>

            {selectedTx.txHash && (
              <AddressField
                label="Base Transaction Hash"
                address={selectedTx.txHash}
                isTruncated={false}
              />
            )}

            <div className="p-3 bg-[#E3EBE6] rounded text-[#2C4A3E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Cryptographic state transition finalized on Base rollup.</span>
            </div>
          </div>
        )}
      </Drawer>

      <AddFundsDrawer
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
    </div>
  );
};
