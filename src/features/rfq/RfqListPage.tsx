import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Plus,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { formatMoney, formatDate, formatPercent } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function RfqListPage() {
  const { quotations, currentEntity } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filteredQuotes = quotations.filter((q) => {
    if (currentEntity !== 'consolidated' && q.entityId !== currentEntity) return false;
    if (activeTab === 'needs_review') return q.status === 'Needs review';
    if (activeTab === 'sent') return q.status === 'Sent' || q.status === 'Negotiating';
    if (activeTab === 'won_lost') return q.status === 'Won' || q.status === 'Lost';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            RFQs & Quotation Management
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Transform client Excel inquiries into commercial quotations with margin control and multi-supplier matching.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/rfq/new')}
          leftIcon={<FileSpreadsheet className="w-4 h-4" />}
        >
          Import RFQ from Excel
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Quotations', count: quotations.length },
          {
            id: 'needs_review',
            label: 'Needs Review',
            count: quotations.filter((q) => q.status === 'Needs review').length,
          },
          {
            id: 'sent',
            label: 'Sent / Negotiating',
            count: quotations.filter((q) => q.status === 'Sent' || q.status === 'Negotiating').length,
          },
          {
            id: 'won_lost',
            label: 'Won & Historical',
            count: quotations.filter((q) => q.status === 'Won' || q.status === 'Lost').length,
          },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Table */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider text-ink-700 font-semibold">
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4 text-center">Lines</th>
                <th className="py-3 px-4 text-right">Value</th>
                <th className="py-3 px-4 text-right">Est. Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuotes.map((q) => {
                const entity = ENTITIES[q.entityId] || ENTITIES['peru'];
                return (
                  <tr
                    key={q.id}
                    onClick={() => navigate(`/app/rfq/${q.id}`)}
                    className="hover:bg-primary-tint/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-ink-900">{q.id}</td>
                    <td className="py-3 px-4 font-medium text-ink-900">{q.customer}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-ink-500 font-mono">{entity.shortName}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-ink-700">{q.lines.length}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-ink-900">
                      {formatMoney(q.total, q.currency, true)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-accent">
                      {formatPercent(q.estimatedMargin)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-500">
                      {formatDate(q.validityDate)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/rfq/${q.id}`);
                        }}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
