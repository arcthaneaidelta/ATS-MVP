import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Landmark,
  CreditCard,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Invoice, PaymentMilestone } from '../../mock/types';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { AgingBar, AgingBucket } from '../../components/domain/AgingBar';
import { Modal, Drawer } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatMoney, formatDate, formatNumber } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function FinancePage() {
  const { invoices, currentEntity, registerPayment, addToast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'receivables' | 'payables' | 'statements'>('receivables');
  const [activeAgingBucket, setActiveAgingBucket] = useState<string | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>('INV-PE-0418');

  // Register Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [targetInvoiceId, setTargetInvoiceId] = useState<string>('INV-PE-0418');
  const [paymentAmount, setPaymentAmount] = useState<number>(12000);
  const [paymentDate, setPaymentDate] = useState('2026-10-10');
  const [paymentMethod, setPaymentMethod] = useState('Wire Transfer (BCP)');
  const [paymentBankRef, setPaymentBankRef] = useState('BCP-TRF-2026-8841');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Statement Drawer
  const [isStatementDrawerOpen, setIsStatementDrawerOpen] = useState(false);
  const [selectedStatementCustomer, setSelectedStatementCustomer] = useState('Minera Andaluz S.A.C.');

  const targetInvoice = invoices.find((i) => i.id === targetInvoiceId);

  // Filter invoices for entity
  const entityInvoices = useMemo(() => {
    return invoices.filter((i) => {
      if (currentEntity !== 'consolidated' && i.entityId !== currentEntity) return false;
      return i.type === (activeTab === 'payables' ? 'payable' : 'receivable');
    });
  }, [invoices, currentEntity, activeTab]);

  // Compute 5 aging buckets (Current, 1-30, 31-60, 61-90, 90+)
  const agingBuckets: AgingBucket[] = useMemo(() => {
    const buckets: Record<string, { amount: number; count: number }> = {
      current: { amount: 0, count: 0 },
      '1-30': { amount: 0, count: 0 },
      '31-60': { amount: 0, count: 0 },
      '61-90': { amount: 0, count: 0 },
      '90+': { amount: 0, count: 0 },
    };

    entityInvoices.forEach((inv) => {
      if (inv.balance <= 0) return;
      if (inv.daysOverdue <= 0) {
        buckets.current.amount += inv.balance;
        buckets.current.count += 1;
      } else if (inv.daysOverdue <= 30) {
        buckets['1-30'].amount += inv.balance;
        buckets['1-30'].count += 1;
      } else if (inv.daysOverdue <= 60) {
        buckets['31-60'].amount += inv.balance;
        buckets['31-60'].count += 1;
      } else if (inv.daysOverdue <= 90) {
        buckets['61-90'].amount += inv.balance;
        buckets['61-90'].count += 1;
      } else {
        buckets['90+'].amount += inv.balance;
        buckets['90+'].count += 1;
      }
    });

    return [
      {
        id: 'current',
        label: 'Current / Not Due',
        amount: buckets.current.amount,
        count: buckets.current.count,
        color: 'bg-surface-sunken',
        barColor: 'bg-primary',
        textColor: 'text-ink-900',
      },
      {
        id: '1-30',
        label: '1–30 Days Overdue',
        amount: buckets['1-30'].amount,
        count: buckets['1-30'].count,
        color: 'bg-warning-tint/40',
        barColor: 'bg-warning',
        textColor: 'text-warning',
      },
      {
        id: '31-60',
        label: '31–60 Days Overdue',
        amount: buckets['31-60'].amount,
        count: buckets['31-60'].count,
        color: 'bg-warning-tint/70',
        barColor: 'bg-[#C47D2B]',
        textColor: 'text-[#9A5C1B]',
      },
      {
        id: '61-90',
        label: '61–90 Days Overdue',
        amount: buckets['61-90'].amount,
        count: buckets['61-90'].count,
        color: 'bg-error-tint/50',
        barColor: 'bg-error',
        textColor: 'text-error',
      },
      {
        id: '90+',
        label: '90+ Days Overdue',
        amount: buckets['90+'].amount,
        count: buckets['90+'].count,
        color: 'bg-error-tint',
        barColor: 'bg-[#7A2E26]',
        textColor: 'text-[#7A2E26]',
      },
    ];
  }, [entityInvoices]);

  // Filtered by selected aging bucket if any
  const displayedInvoices = useMemo(() => {
    if (!activeAgingBucket) return entityInvoices;
    return entityInvoices.filter((inv) => {
      if (inv.balance <= 0) return false;
      if (activeAgingBucket === 'current') return inv.daysOverdue <= 0;
      if (activeAgingBucket === '1-30') return inv.daysOverdue > 0 && inv.daysOverdue <= 30;
      if (activeAgingBucket === '31-60') return inv.daysOverdue > 30 && inv.daysOverdue <= 60;
      if (activeAgingBucket === '61-90') return inv.daysOverdue > 60 && inv.daysOverdue <= 90;
      if (activeAgingBucket === '90+') return inv.daysOverdue > 90;
      return true;
    });
  }, [entityInvoices, activeAgingBucket]);

  const handleOpenPaymentModal = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    setTargetInvoiceId(inv.id);
    setPaymentAmount(inv.balance);
    setPaymentError(null);
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInvoice) return;

    if (paymentAmount <= 0) {
      setPaymentError('Payment amount must be greater than zero.');
      return;
    }
    if (paymentAmount > targetInvoice.balance) {
      setPaymentError(`Cannot exceed remaining invoice balance of ${formatMoney(targetInvoice.balance, targetInvoice.currency)}.`);
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      registerPayment({
        invoiceId: targetInvoice.id,
        amount: paymentAmount,
        date: paymentDate,
        method: paymentMethod,
        bankRef: paymentBankRef,
      });
      setIsRegistering(false);
      setIsPaymentModalOpen(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Finance & Payment Operations
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Receivables aging control, milestone-based partial settlement and statement generation across operating companies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsStatementDrawerOpen(true)}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
          >
            Customer Statements
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenPaymentModal(targetInvoiceId)}
            leftIcon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Register payment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-sm border border-border w-fit text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('receivables')}
          className={clsx(
            'px-4 py-1.5 rounded-xs font-medium transition-colors',
            activeTab === 'receivables'
              ? 'bg-surface text-ink-900 font-bold shadow-xs'
              : 'text-ink-500 hover:text-ink-900'
          )}
        >
          Customer Receivables
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payables')}
          className={clsx(
            'px-4 py-1.5 rounded-xs font-medium transition-colors',
            activeTab === 'payables'
              ? 'bg-surface text-ink-900 font-bold shadow-xs'
              : 'text-ink-500 hover:text-ink-900'
          )}
        >
          Supplier Payables
        </button>
      </div>

      {/* Aging Summary Segmented Bar (PRD Spec 12.7) */}
      <AgingBar
        buckets={agingBuckets}
        activeBucket={activeAgingBucket}
        onSelectBucket={setActiveAgingBucket}
        currency="USD"
      />

      {/* Invoices Table */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
        <div className="p-3 border-b border-border bg-surface-sunken flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-ink-700 text-[11px]">
              {activeTab === 'receivables' ? 'Customer Invoices' : 'Supplier Invoices'}
            </span>
            {activeAgingBucket && (
              <Badge variant="primary" size="sm">
                Filtered: {activeAgingBucket} days
              </Badge>
            )}
          </div>
          <span className="text-ink-500 font-mono">{displayedInvoices.length} invoices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-500">
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Counterparty</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Invoice Amount</th>
                <th className="py-2.5 px-3 text-right">Settled</th>
                <th className="py-2.5 px-3 text-right">Outstanding Balance</th>
                <th className="py-2.5 px-3 text-center">Milestones</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayedInvoices.map((inv) => {
                const isExpanded = expandedInvoiceId === inv.id;
                const paidMilestones = inv.milestones.filter((m) => m.paid).length;

                return (
                  <React.Fragment key={inv.id}>
                    <tr
                      onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                      className="hover:bg-primary-tint/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-ink-900">{inv.id}</td>
                      <td className="py-3 px-3 font-medium text-ink-900">{inv.customer}</td>
                      <td className="py-3 px-3 font-mono text-ink-500">
                        {formatDate(inv.dueDate)}
                        {inv.daysOverdue > 0 && (
                          <span className="text-[10px] text-error font-mono block">
                            +{inv.daysOverdue}d overdue
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-ink-700">
                        {formatMoney(inv.amount, inv.currency, true)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-success">
                        {formatMoney(inv.paid, inv.currency, true)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-ink-900">
                        <span className="animate-data-tint">
                          {formatMoney(inv.balance, inv.currency, true)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {inv.milestones.length > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {inv.milestones.map((m, idx) => (
                              <span
                                key={idx}
                                title={`${m.step}: ${m.paid ? 'Paid' : 'Unpaid'}`}
                                className={clsx(
                                  'w-2 h-2 rounded-full inline-block',
                                  m.paid ? 'bg-success' : 'bg-border-strong'
                                )}
                              />
                            ))}
                            <span className="text-[10px] text-ink-500 font-mono ml-1">
                              {paidMilestones}/{inv.milestones.length}
                            </span>
                          </div>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {inv.balance > 0 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPaymentModal(inv.id);
                              }}
                            >
                              Pay
                            </Button>
                          )}
                          <button
                            type="button"
                            className="p-1 text-ink-500 hover:text-ink-900 rounded-xs"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row Expansion: Payment Milestones Details */}
                    {isExpanded && inv.milestones.length > 0 && (
                      <tr className="bg-surface-sunken/50">
                        <td colSpan={9} className="p-3">
                          <div className="p-3 bg-surface border border-border rounded-sm space-y-2">
                            <span className="text-[10.5px] uppercase font-bold text-ink-700 tracking-wider block">
                              Payment Milestones Schedule for {inv.id}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {inv.milestones.map((ms, idx) => (
                                <div
                                  key={idx}
                                  className={clsx(
                                    'p-2.5 rounded-xs border text-xs flex flex-col justify-between',
                                    ms.paid
                                      ? 'bg-success-tint/40 border-success/30'
                                      : 'bg-surface-sunken border-border'
                                  )}
                                >
                                  <div>
                                    <div className="flex items-center justify-between font-semibold text-ink-900">
                                      <span>{ms.step}</span>
                                      <Badge variant={ms.paid ? 'success' : 'neutral'} size="sm">
                                        {ms.paid ? 'Settled' : 'Pending'}
                                      </Badge>
                                    </div>
                                    <span className="text-sm font-bold font-mono text-ink-900 block my-1">
                                      {formatMoney(ms.amount, inv.currency, true)}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-ink-500 font-mono">
                                    Due: {formatDate(ms.dueDate)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Payment Modal (PRD Spec 12.7) */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Register Commercial Settlement"
        description="Records inward receipt against customer invoice balance with instantaneous ledger ripple."
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
          <Input
            label="Invoice Reference"
            value={targetInvoiceId}
            disabled
            helperText={
              targetInvoice
                ? `Customer: ${targetInvoice.customer} · Total: ${formatMoney(targetInvoice.amount, targetInvoice.currency)}`
                : ''
            }
          />
          <Input
            label="Payment Amount"
            type="number"
            min="1"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
            error={paymentError || undefined}
            helperText={`Outstanding Balance: ${formatMoney(targetInvoice?.balance, targetInvoice?.currency)}`}
            required
          />
          <Input
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
          <Input
            label="Payment Method / Account"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <Input
            label="Bank Reference / Swift Voucher"
            value={paymentBankRef}
            onChange={(e) => setPaymentBankRef(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isRegistering}>
              Confirm and post payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Statement Drawer (PRD Spec 12.7) */}
      <Drawer
        isOpen={isStatementDrawerOpen}
        onClose={() => setIsStatementDrawerOpen(false)}
        title="Customer Commercial Statement"
        subtitle={selectedStatementCustomer}
        width="max-w-2xl"
      >
        <div className="space-y-6 text-xs">
          <div className="p-4 bg-surface border border-border rounded-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-500 tracking-wider block">
                Closing Account Balance
              </span>
              <span className="text-xl font-bold font-mono text-primary">
                USD 12,000.00
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => addToast(`Statement dispatched to ${selectedStatementCustomer}`, 'success')}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
            >
              Send statement
            </Button>
          </div>

          <div className="space-y-3">
            <span className="font-semibold text-ink-900 uppercase text-[11px] tracking-wider block">
              Running Ledger Timeline
            </span>
            <div className="divide-y divide-border border border-border rounded-sm bg-surface overflow-hidden">
              <div className="p-3 flex justify-between">
                <div>
                  <span className="font-mono font-bold text-ink-900 block">INV-PE-0418</span>
                  <span className="text-ink-500">Commercial Invoice (24x Shanks) · 22 Aug 2026</span>
                </div>
                <span className="font-mono font-bold text-ink-900">+ USD 15,400.00</span>
              </div>
              <div className="p-3 flex justify-between bg-success-tint/20">
                <div>
                  <span className="font-mono font-bold text-success block">PAY-88419</span>
                  <span className="text-ink-500">Wire Settlement BCP · 26 Aug 2026</span>
                </div>
                <span className="font-mono font-bold text-success">- USD 3,400.00</span>
              </div>
              <div className="p-3 flex justify-between font-bold bg-surface-sunken">
                <span>Closing Due:</span>
                <span className="font-mono text-primary">USD 12,000.00</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
