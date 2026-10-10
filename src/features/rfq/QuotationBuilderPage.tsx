import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Save,
  ArrowRight,
  ShoppingCart,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge, PartNumber } from '../../components/ui/Badge';
import { formatMoney, formatDate, formatPercent } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function QuotationBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotations, convertQuotationToOrder, addToast } = useStore();

  const quote = quotations.find((q) => q.id === id) || quotations[0];

  const [customer, setCustomer] = useState(quote?.customer || 'Minera Andaluz S.A.C.');
  const [incoterm, setIncoterm] = useState(quote?.incoterm || 'DDP');
  const [paymentTerms, setPaymentTerms] = useState(
    quote?.paymentTerms || '30 days from commercial invoice'
  );
  const [lines, setLines] = useState(quote?.lines || []);

  const total = useMemo(() => {
    return lines.reduce((acc, l) => acc + (l.unitPrice || 0) * (l.qty || 1), 0);
  }, [lines]);

  const cost = useMemo(() => {
    return lines.reduce((acc, l) => acc + (l.supplierCost || 0) * (l.qty || 1), 0);
  }, [lines]);

  const margin = total > 0 ? ((total - cost) / total) * 100 : 25;

  const handleConvertToPo = () => {
    if (!quote) return;
    const poId = convertQuotationToOrder(quote.id);
    navigate(`/app/orders`);
  };

  const handleSave = () => {
    addToast(`Saved revisions to quotation ${quote?.id}`, 'success');
  };

  if (!quote) return <div>Quotation not found</div>;

  const entity = ENTITIES[quote.entityId] || ENTITIES['peru'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900 font-mono">
              {quote.id}
            </h1>
            <StatusBadge status={quote.status} />
            <span className="text-xs text-ink-500 font-mono">v{quote.version}.0</span>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Linked to inquiry {quote.rfqRef} · Operating through {entity.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConvertToPo}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            Convert to Customer PO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Lines Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 bg-surface border border-border rounded-md grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-ink-700 block mb-1">Customer</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full p-2 border border-border-strong rounded-xs bg-surface-elevated text-ink-900"
              />
            </div>
            <div>
              <label className="font-semibold text-ink-700 block mb-1">Incoterm</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value as any)}
                className="w-full p-2 border border-border-strong rounded-xs bg-surface-elevated text-ink-900"
              >
                <option value="DDP">DDP (Delivered Duty Paid)</option>
                <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                <option value="FOB">FOB (Free On Board)</option>
                <option value="EXW">EXW (Ex Works)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-ink-700 block mb-1">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2 border border-border-strong rounded-xs bg-surface-elevated text-ink-900"
              />
            </div>
          </div>

          <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
            <div className="p-3 border-b border-border bg-surface-sunken flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-ink-700 text-[11px]">
                Quotation Line Items ({lines.length})
              </span>
              <span className="text-ink-500 font-mono">Currency: {quote.currency}</span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-500">
                  <th className="py-2.5 px-3">Part Number</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right">Cost</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Margin</th>
                  <th className="py-2.5 px-3 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines.map((l, index) => (
                  <tr key={index} className="hover:bg-surface-sunken/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">
                      <PartNumber value={l.partId} showCopy={false} />
                    </td>
                    <td className="py-2.5 px-3 text-ink-900">{l.description}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{l.qty}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-ink-500">
                      {formatMoney(l.supplierCost, quote.currency, true)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                      {formatMoney(l.unitPrice, quote.currency, true)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-accent font-semibold">
                      {formatPercent(l.marginPercent)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                      {formatMoney((l.unitPrice || 0) * l.qty, quote.currency, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Margin Summary & Version Diff History */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-surface border border-border rounded-md space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-700 block">
              Commercial Totals
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-500">Gross Value:</span>
                <span className="font-mono font-bold text-ink-900">
                  {formatMoney(total, quote.currency, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Estimated Margin:</span>
                <span className="font-mono font-bold text-accent">
                  {formatPercent(margin)}
                </span>
              </div>
            </div>
          </div>

          {/* Version Diff History */}
          <div className="p-4 bg-surface-sunken/40 border border-border rounded-md space-y-3 text-xs">
            <div className="flex items-center gap-2 text-ink-900 font-semibold">
              <Clock className="w-4 h-4 text-primary" />
              <span>Version History & Audit Log</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-surface rounded-xs border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-ink-900">v1.0 (Current)</span>
                  <span className="text-[10px] text-ink-500 font-mono">{formatDate(quote.date)}</span>
                </div>
                <p className="text-[11px] text-ink-500">
                  Revised quantities for Minera Andaluz drift rigs.
                </p>
              </div>

              {quote.historyVersions?.map((hv) => (
                <div key={hv.version} className="p-2.5 bg-surface-sunken rounded-xs border border-border/60 text-ink-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono">v{hv.version}.0</span>
                    <span className="text-[10px] font-mono">{formatDate(hv.date)}</span>
                  </div>
                  <p className="text-[11px]">{hv.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
