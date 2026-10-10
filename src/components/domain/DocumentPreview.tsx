import { BRAND, ENTITIES } from '../../config/brand';
import { formatMoney, formatDate } from '../../lib/format';
import { Button } from '../ui/Button';
import { Download, Printer, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export interface DocumentItemLine {
  itemNumber: number;
  partId: string;
  description: string;
  oemRef?: string;
  qty: number;
  unitPrice?: number;
  totalPrice?: number;
  weightKg?: number;
}

export interface DocumentPreviewProps {
  type:
    | 'Quotation'
    | 'Supplier RFQ'
    | 'Purchase Order'
    | 'Pro Forma Invoice'
    | 'Commercial Invoice'
    | 'Packing List'
    | 'Credit Note';
  reference: string;
  entityId: string;
  counterparty: string;
  date: string;
  validityOrDueDate?: string;
  incoterm?: string;
  currency?: 'USD' | 'PEN' | 'ZMW';
  paymentTerms?: string;
  lines: DocumentItemLine[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
  onDownload?: () => void;
}

export function DocumentPreview({
  type,
  reference,
  entityId,
  counterparty,
  date,
  validityOrDueDate,
  incoterm = 'DDP (Delivered Duty Paid)',
  currency = 'USD',
  paymentTerms = '30 days from commercial invoice',
  lines,
  subtotal = 0,
  tax = 0,
  total = 0,
  notes,
  onDownload,
}: DocumentPreviewProps) {
  const { addToast } = useStore();
  const entity = ENTITIES[entityId] || ENTITIES['peru'];

  const isPackingList = type === 'Packing List';
  const isCreditNote = type === 'Credit Note';

  const handleSimulatedDownload = () => {
    addToast(`PDF generated: ${reference}.pdf (Simulated)`, 'success');
    onDownload?.();
  };

  const handleSimulatedPrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Top Action Bar */}
      <div className="w-full max-w-[794px] flex items-center justify-between py-2 px-1 mb-3">
        <span className="text-xs text-ink-500 font-mono">
          Document Output Engine · A4 Sheet Standard (210 × 297 mm)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSimulatedPrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulatedDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="w-full max-w-[794px] min-h-[1050px] bg-white border border-border-strong shadow-md p-10 md:p-14 text-ink-900 font-sans text-xs leading-normal flex flex-col justify-between">
        {/* Header Block */}
        <div>
          <div className="flex items-start justify-between border-b-2 border-primary pb-6 mb-8">
            <div>
              {/* Stratum Logo Mark */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-primary rounded-xs flex flex-col justify-center gap-1 px-1.5">
                  <div className="w-full h-0.5 bg-accent rounded-full" />
                  <div className="w-3/4 h-0.5 bg-accent rounded-full" />
                  <div className="w-1/2 h-0.5 bg-accent rounded-full" />
                </div>
                <span className="font-display text-2xl text-ink-900 tracking-tight font-normal">
                  {BRAND.name}
                </span>
              </div>
              <p className="font-semibold text-ink-900">{entity.name}</p>
              <p className="text-ink-500 text-[11px] max-w-xs">{entity.address}</p>
              <p className="text-ink-500 text-[11px] font-mono mt-0.5">{entity.taxId}</p>
            </div>

            <div className="text-right">
              <span className="inline-block text-xs uppercase tracking-widest font-bold text-primary bg-primary-tint px-2.5 py-1 rounded-xs mb-2">
                {type}
              </span>
              <div className="text-base font-bold font-mono text-ink-900">{reference}</div>
              <div className="text-[11px] text-ink-500 mt-1">
                Date: <span className="font-mono">{formatDate(date)}</span>
              </div>
              {validityOrDueDate && (
                <div className="text-[11px] text-ink-500">
                  {type === 'Quotation' ? 'Valid Until' : 'Due Date'}:{' '}
                  <span className="font-mono">{formatDate(validityOrDueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Parties Meta */}
          <div className="grid grid-cols-2 gap-8 mb-8 p-4 bg-surface-sunken/40 rounded-sm border border-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-500 tracking-wider block mb-1">
                Recipient / Client
              </span>
              <p className="font-semibold text-sm text-ink-900">{counterparty}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">Mining Operations Division</p>
              <p className="text-[11px] text-ink-500">Commercial Inquiries & Procurement</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-ink-500 tracking-wider block mb-1">
                Commercial Terms
              </span>
              <p className="text-[11px]">
                <strong className="text-ink-700">Incoterm:</strong> {incoterm}
              </p>
              <p className="text-[11px] mt-0.5">
                <strong className="text-ink-700">Payment Terms:</strong> {paymentTerms}
              </p>
              <p className="text-[11px] mt-0.5">
                <strong className="text-ink-700">Trade Currency:</strong>{' '}
                <span className="font-mono font-medium">{currency}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b border-border-strong text-[11px] uppercase tracking-wider text-ink-700 font-semibold bg-surface-sunken/60">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3">Part Number / Description</th>
                <th className="py-2.5 px-3 w-28">OEM Ref</th>
                <th className="py-2.5 px-3 text-right w-16">Qty</th>
                {!isPackingList && (
                  <>
                    <th className="py-2.5 px-3 text-right w-24">Unit Price</th>
                    <th className="py-2.5 px-3 text-right w-28">Total</th>
                  </>
                )}
                {isPackingList && (
                  <th className="py-2.5 px-3 text-right w-24">Net Weight</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lines.map((l, index) => (
                <tr key={index} className="text-xs">
                  <td className="py-2.5 px-3 text-ink-500 font-mono text-[11px]">{index + 1}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-ink-900 block">{l.partId}</span>
                    <span className="text-ink-700 text-[11px]">{l.description}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-ink-500">{l.oemRef || '—'}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-ink-900">{l.qty}</td>
                  {!isPackingList && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono text-ink-700">
                        {formatMoney(l.unitPrice, currency, true)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                        {formatMoney(l.totalPrice || (l.unitPrice || 0) * l.qty, currency, true)}
                      </td>
                    </>
                  )}
                  {isPackingList && (
                    <td className="py-2.5 px-3 text-right font-mono text-ink-700">
                      {((l.weightKg || 4.5) * l.qty).toFixed(1)} kg
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          {!isPackingList && (
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-ink-700">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatMoney(subtotal || total, currency, true)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-ink-700">
                    <span>Applicable Tax / VAT:</span>
                    <span className="font-mono">{formatMoney(tax, currency, true)}</span>
                  </div>
                )}
                <div className="pt-2 border-t-2 border-primary flex justify-between font-bold text-sm text-ink-900">
                  <span>Total Amount:</span>
                  <span className="font-mono text-primary">{formatMoney(total, currency, true)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Special Instructions */}
          {notes && (
            <div className="p-3 bg-surface-sunken rounded-xs border border-border text-[11px] text-ink-700 mb-6">
              <strong>Special Instructions:</strong> {notes}
            </div>
          )}
        </div>

        {/* Footer & Banking Block */}
        <div className="pt-6 border-t border-border text-[11px] text-ink-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-ink-700 block mb-0.5">Banking Information</span>
              <p className="font-mono text-[10.5px] leading-relaxed">{entity.bankBlock}</p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-ink-700 block mb-0.5">Authorised Signatory</span>
              <p className="italic text-ink-700 mt-4">Valeria Quispe / Commercial Operations</p>
              <p className="text-[10px] text-ink-300">Generated via Stratum Parts ERP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
