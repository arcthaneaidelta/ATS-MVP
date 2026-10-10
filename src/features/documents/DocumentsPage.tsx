import React, { useState } from 'react';
import {
  Files,
  FileText,
  Plus,
  Eye,
  Download,
  Building,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DocumentRecord } from '../../mock/types';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DocumentPreview } from '../../components/domain/DocumentPreview';
import { formatMoney, formatDate } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function DocumentsPage() {
  const { documents, orders, currentEntity, addToast } = useStore();

  const docTypes: DocumentRecord['type'][] = [
    'Quotation',
    'Supplier RFQ',
    'Purchase Order',
    'Pro Forma Invoice',
    'Commercial Invoice',
    'Packing List',
    'Credit Note',
  ];

  const [selectedType, setSelectedType] = useState<DocumentRecord['type']>('Commercial Invoice');
  const [previewingDoc, setPreviewingDoc] = useState<DocumentRecord | null>(null);

  // Generate From Order modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [generateDocType, setGenerateDocType] = useState<DocumentRecord['type']>('Commercial Invoice');

  const filteredDocs = documents.filter((d) => {
    if (currentEntity !== 'consolidated' && d.entityId !== currentEntity) return false;
    return d.type === selectedType;
  });

  const handleCreateDocumentFromOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const ord = orders.find((o) => o.id === selectedOrderId);
    if (!ord) return;

    const newRef = `${generateDocType.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    addToast(`Generated ${generateDocType} ${newRef} linked to ${ord.id}`, 'success');
    setIsGenerateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Commercial Documents Hub
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Complete standardized trade suite for mining export/import operations across Peru, Zambia, and global territories.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsGenerateModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Generate from order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Document Types List */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-md p-3 space-y-1">
          <span className="text-[10.5px] uppercase font-bold tracking-wider text-ink-500 block px-3 py-1 font-mono">
            Document Categories
          </span>
          {docTypes.map((t) => {
            const count = documents.filter((d) => d.type === t).length;
            const isSelected = selectedType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-sm text-xs font-medium transition-colors flex items-center justify-between',
                  isSelected
                    ? 'bg-primary text-white font-semibold shadow-xs'
                    : 'text-ink-700 hover:bg-surface-sunken'
                )}
              >
                <span>{t}s</span>
                <span
                  className={clsx(
                    'text-[11px] font-mono px-1.5 py-0.5 rounded-full',
                    isSelected ? 'bg-white/20 text-white' : 'bg-surface-sunken text-ink-500'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Documents Table */}
        <div className="lg:col-span-8 bg-surface rounded-md border border-border overflow-hidden shadow-xs">
          <div className="p-3 border-b border-border bg-surface-sunken flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink-700 text-[11px]">
              {selectedType}s Records
            </span>
            <span className="text-ink-500 font-mono">{filteredDocs.length} documents</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-500">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Counterparty</th>
                  <th className="py-2.5 px-3">Linked Record</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setPreviewingDoc(doc)}
                    className="hover:bg-primary-tint/30 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-ink-900">{doc.ref}</td>
                    <td className="py-2.5 px-3 text-ink-900 font-medium">{doc.counterparty}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-primary">
                      {doc.linkedRecord}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-ink-500">{formatDate(doc.date)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                      {doc.type === 'Packing List'
                        ? 'Weight Only'
                        : formatMoney(doc.amount, doc.currency, true)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingDoc(doc);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        A4
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* A4 Modal Preview */}
      <Modal
        isOpen={Boolean(previewingDoc)}
        onClose={() => setPreviewingDoc(null)}
        maxWidth="4xl"
        title={previewingDoc ? `${previewingDoc.type} · ${previewingDoc.ref}` : ''}
      >
        {previewingDoc && (
          <div className="py-2">
            <DocumentPreview
              type={previewingDoc.type}
              reference={previewingDoc.ref}
              entityId={previewingDoc.entityId}
              counterparty={previewingDoc.counterparty}
              date={previewingDoc.date}
              currency={previewingDoc.currency}
              lines={[
                {
                  itemNumber: 1,
                  partId: 'STR-000412',
                  description: 'Rock drill shank adapter T38, 635mm',
                  oemRef: 'EP-3380-6350',
                  qty: 24,
                  unitPrice: 136.0,
                  totalPrice: 3264.0,
                  weightKg: 7.85,
                },
                {
                  itemNumber: 2,
                  partId: 'STR-000413',
                  description: 'Button bit 45mm, 7-button ballistic',
                  oemRef: 'SDV-4520-045B',
                  qty: 120,
                  unitPrice: 62.5,
                  totalPrice: 7500.0,
                  weightKg: 1.15,
                },
              ]}
              subtotal={previewingDoc.amount}
              total={previewingDoc.amount}
              notes="All export compliance certifications and heat numbers attached to consignment."
            />
          </div>
        )}
      </Modal>

      {/* Generate From Order Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Commercial Document from Order"
        description="Creates official export paperwork prefilled directly from existing purchase contracts."
      >
        <form onSubmit={handleCreateDocumentFromOrder} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-ink-700 block mb-1">Source Order</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full p-2 border border-border-strong rounded-xs bg-surface text-ink-900 font-mono"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} · {o.counterparty} ({formatMoney(o.total, o.currency)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-ink-700 block mb-1">Target Document Type</label>
            <select
              value={generateDocType}
              onChange={(e) => setGenerateDocType(e.target.value as any)}
              className="w-full p-2 border border-border-strong rounded-xs bg-surface text-ink-900"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Generate Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
