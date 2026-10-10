import { useState } from 'react';
import {
  BarChart3,
  Download,
  Building,
  TrendingUp,
  Table as TableIcon,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatMoney, formatPercent } from '../../lib/format';
import clsx from 'clsx';

export function ReportsPage() {
  const { addToast } = useStore();
  const [viewAsTable, setViewAsTable] = useState(false);
  const [consolidateInUsd, setConsolidateInUsd] = useState(true);

  const entityMetrics = [
    {
      entity: 'Stratum Perú S.A.C.',
      country: 'Peru',
      quotedYtd: 1240000,
      wonRevenue: 480200,
      avgMargin: 25.4,
      openReceivables: 36400,
      activeQuotes: 14,
    },
    {
      entity: 'Stratum Zambia Ltd',
      country: 'Zambia',
      quotedYtd: 980000,
      wonRevenue: 342000,
      avgMargin: 26.8,
      openReceivables: 31980,
      activeQuotes: 9,
    },
    {
      entity: 'Stratum International FZE',
      country: 'UAE / Intl',
      quotedYtd: 640000,
      wonRevenue: 210000,
      avgMargin: 22.1,
      openReceivables: 19500,
      activeQuotes: 4,
    },
  ];

  const topCustomers = [
    { name: 'Minera Andaluz S.A.C.', revenue: 384000, orders: 12, margin: 26.1 },
    { name: 'Kafue Ridge Copper Ltd', revenue: 290000, orders: 9, margin: 27.4 },
    { name: 'Cobre del Sur Mining', revenue: 194000, orders: 7, margin: 24.8 },
    { name: 'Mufulira Deep Mines Ltd', revenue: 142000, orders: 5, margin: 25.2 },
    { name: 'Northgate Quarries', revenue: 98000, orders: 3, margin: 22.9 },
  ];

  const topSuppliers = [
    { name: 'Hartmann Drilling Supply (DE)', spend: 284000, onTime: '97.4%' },
    { name: 'Pretoria Rock Tools (ZA)', spend: 192000, onTime: '91.8%' },
    { name: 'Andes Wear Components (CL)', spend: 165000, onTime: '94.2%' },
    { name: 'Ostrava Hydraulik s.r.o. (CZ)', spend: 124000, onTime: '96.1%' },
    { name: 'Shenglong Mining Parts (CN)', spend: 110000, onTime: '89.5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Consolidated Management Audit & Reports
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Group executive performance comparison across Peru, Zambia and International FZE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewAsTable(!viewAsTable)}
            leftIcon={<TableIcon className="w-3.5 h-3.5" />}
          >
            {viewAsTable ? 'View graphical' : 'View as table'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => addToast('Consolidated audit report exported as CSV', 'success')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Entity Comparison 3 Columns (PRD Spec 12.10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityMetrics.map((em) => (
          <div key={em.entity} className="p-5 bg-surface border border-border rounded-md shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-sm text-ink-900">{em.entity}</span>
              <Badge variant="primary" size="sm">
                {em.country}
              </Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-500">Quoted YTD:</span>
                <span className="font-mono font-bold text-ink-900">
                  {formatMoney(em.quotedYtd, 'USD')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Won Realized Revenue:</span>
                <span className="font-mono font-bold text-primary">
                  {formatMoney(em.wonRevenue, 'USD')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Average Realized Margin:</span>
                <span className="font-mono font-bold text-accent">
                  {formatPercent(em.avgMargin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Open Receivables:</span>
                <span className="font-mono font-bold text-ink-900">
                  {formatMoney(em.openReceivables, 'USD')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Customers & Top Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers Table */}
        <div className="p-5 bg-surface border border-border rounded-md space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900 pb-2 border-b border-border">
            Top Mining Customers by Realized Revenue
          </h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] text-ink-500 uppercase font-semibold">
                <th className="py-2">Customer</th>
                <th className="py-2 text-center">Orders</th>
                <th className="py-2 text-right">Revenue</th>
                <th className="py-2 text-right">Avg Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topCustomers.map((c) => (
                <tr key={c.name} className="hover:bg-surface-sunken/40">
                  <td className="py-2.5 font-medium text-ink-900">{c.name}</td>
                  <td className="py-2.5 text-center font-mono text-ink-700">{c.orders}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-ink-900">
                    {formatMoney(c.revenue, 'USD')}
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-accent">
                    {formatPercent(c.margin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Suppliers Table */}
        <div className="p-5 bg-surface border border-border rounded-md space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900 pb-2 border-b border-border">
            Top OEM Suppliers by Procurement Spend
          </h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] text-ink-500 uppercase font-semibold">
                <th className="py-2">Supplier</th>
                <th className="py-2 text-right">YTD Spend</th>
                <th className="py-2 text-right">On-Time Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topSuppliers.map((s) => (
                <tr key={s.name} className="hover:bg-surface-sunken/40">
                  <td className="py-2.5 font-medium text-ink-900">{s.name}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-ink-900">
                    {formatMoney(s.spend, 'USD')}
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-success">
                    {s.onTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
