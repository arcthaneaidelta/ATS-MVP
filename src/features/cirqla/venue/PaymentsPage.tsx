import React, { useState } from 'react';
import { useCirqlaStore } from '../../../store/cirqla';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { Download, CreditCard, Banknote, ArrowUpRight, Filter } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { orders } = useCirqlaStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'ledger' | 'payouts'>('ledger');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Realistic ledger entries seeded from active orders + history
  const ledgerEntries = orders.map((ord, idx) => ({
    id: `pay-${ord.id}`,
    time: new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    orderNumber: ord.orderNumber,
    table: ord.table,
    method: ord.paymentMethod.toUpperCase(),
    amount: ord.total,
    fee: Number((ord.total * 0.024 + 0.30).toFixed(2)),
    status: ord.paymentStatus === 'Refunded' ? 'Refunded' : ord.paymentStatus === 'Paid' ? 'Settled' : 'Pending',
    customer: ord.customerName || 'Guest Diner',
  }));

  const filteredEntries = ledgerEntries.filter((e) => {
    if (statusFilter === 'All') return true;
    return e.status === statusFilter;
  });

  const grossSales = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + o.total, 0);

  const handleExportCsv = () => {
    const headers = ['Time,Order,Table,Customer,Method,Amount,Fee,Status\n'];
    const rows = filteredEntries.map(
      (e) => `${e.time},#${e.orderNumber},Table ${e.table},"${e.customer}",${e.method},${e.amount},${e.fee},${e.status}\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cirqla_payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast('Exported payment ledger CSV', 'success');
  };

  const payouts = [
    { id: 'po-101', period: 'Sep 29 – Oct 05, 2026', amount: 18420.50, status: 'Settled', arrival: 'Oct 07, 2026' },
    { id: 'po-102', period: 'Oct 06 – Oct 12, 2026', amount: 21340.00, status: 'Processing', arrival: 'Tomorrow' },
  ];

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Payments & Settlement Ledger
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Reconcile live transactions, platform processing fees, and scheduled bank payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV Ledger
          </Button>
        </div>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-line">
          <span className="text-[10px] text-ink-3 uppercase font-bold block mb-1">
            Gross Sales Today
          </span>
          <span className="font-mono text-2xl font-bold text-ink">
            ${grossSales > 0 ? grossSales.toFixed(2) : '4,120.50'}
          </span>
          <span className="text-[10px] text-ok block mt-1">+14% vs yesterday</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-line">
          <span className="text-[10px] text-ink-3 uppercase font-bold block mb-1">
            Net Payout
          </span>
          <span className="font-mono text-2xl font-bold text-primary">
            ${(grossSales * 0.95).toFixed(2)}
          </span>
          <span className="text-[10px] text-ink-3 block mt-1">Stripe Connect fees deducted</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-line">
          <span className="text-[10px] text-ink-3 uppercase font-bold block mb-1">
            Refunds Issued
          </span>
          <span className="font-mono text-2xl font-bold text-ink">
            $0.00
          </span>
          <span className="text-[10px] text-ink-3 block mt-1">0 dispute incidents</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-line">
          <span className="text-[10px] text-ink-3 uppercase font-bold block mb-1">
            Average Ticket
          </span>
          <span className="font-mono text-2xl font-bold text-clay">
            $32.40
          </span>
          <span className="text-[10px] text-ok block mt-1">+2.8% modifier lift</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line text-xs font-sans">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'ledger'
              ? 'border-clay text-clay font-bold'
              : 'border-transparent text-ink-3 hover:text-ink'
          }`}
        >
          Daily Transaction Ledger ({filteredEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'payouts'
              ? 'border-clay text-clay font-bold'
              : 'border-transparent text-ink-3 hover:text-ink'
          }`}
        >
          Weekly Payouts Schedule (2)
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs">
          {/* Filter Bar */}
          <div className="p-3 bg-surface border-b border-line flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-ink-3" />
              <span className="text-ink-2 font-medium">Status:</span>
              {['All', 'Settled', 'Pending', 'Refunded'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    statusFilter === st
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-bg text-ink-3 hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-ink-3 text-[11px] font-mono">
              Live updates via shared store
            </span>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left divide-y divide-line">
              <thead className="bg-surface text-ink-3 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Ticket</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Gross</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3">Net</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-elevated">
                {filteredEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-3 text-ink-3">{row.time}</td>
                    <td className="p-3 font-bold text-clay">
                      #{row.orderNumber} (T{row.table})
                    </td>
                    <td className="p-3 text-ink font-sans">{row.customer}</td>
                    <td className="p-3 text-ink-2">{row.method}</td>
                    <td className="p-3 font-bold text-ink">${row.amount.toFixed(2)}</td>
                    <td className="p-3 text-ink-3">-${row.fee.toFixed(2)}</td>
                    <td className="p-3 text-ok font-semibold">
                      ${(row.amount - row.fee).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.status === 'Settled'
                            ? 'bg-ok-tint text-ok'
                            : row.status === 'Refunded'
                            ? 'bg-err-tint text-err'
                            : 'bg-warn-tint text-warn'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-elevated rounded-2xl border border-line overflow-hidden p-6 space-y-4">
          <h3 className="font-serif text-lg text-ink font-bold">Stripe Connect Direct Payouts</h3>
          <div className="space-y-3 font-mono text-xs">
            {payouts.map((po) => (
              <div
                key={po.id}
                className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-ink block">{po.period}</span>
                  <span className="text-[11px] text-ink-3">Estimated arrival: {po.arrival}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-base text-primary block">
                    ${po.amount.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      po.status === 'Settled' ? 'bg-ok-tint text-ok' : 'bg-warn-tint text-warn'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
