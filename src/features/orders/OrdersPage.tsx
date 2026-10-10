import React, { useState } from 'react';
import {
  ShoppingCart,
  Truck,
  Plus,
  ArrowRight,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Order, OrderLine } from '../../mock/types';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge, PartNumber } from '../../components/ui/Badge';
import { FulfillmentBar } from '../../components/domain/FulfillmentBar';
import { Drawer, Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatMoney, formatDate, formatNumber } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function OrdersPage() {
  const { orders, currentEntity, recordDelivery, addToast } = useStore();

  const [orderTypeTab, setOrderTypeTab] = useState<'customer' | 'supplier'>('customer');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Record Delivery Modal state
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryWaybill, setDeliveryWaybill] = useState('WB-PE-99502');
  const [deliveryCarrier, setDeliveryCarrier] = useState('Trans-Andina Cargo');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-10');
  const [deliveredQtyInput, setDeliveredQtyInput] = useState<number>(4);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  // Supplier Comparison Modal state
  const [isSupplierCompareOpen, setIsSupplierCompareOpen] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  const filteredOrders = orders.filter((o) => {
    if (currentEntity !== 'consolidated' && o.entityId !== currentEntity) return false;
    return o.type === orderTypeTab;
  });

  const handleOpenDeliveryModal = () => {
    if (!selectedOrder) return;
    const firstLine = selectedOrder.lines[0];
    const outstanding = firstLine.orderedQty - firstLine.deliveredQty;
    setDeliveredQtyInput(Math.min(4, outstanding));
    setDeliveryError(null);
    setIsDeliveryModalOpen(true);
  };

  const handleSubmitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const line = selectedOrder.lines[0];
    const outstanding = line.orderedQty - line.deliveredQty;

    if (deliveredQtyInput <= 0) {
      setDeliveryError('Delivered quantity must be greater than zero.');
      return;
    }
    if (deliveredQtyInput > outstanding) {
      setDeliveryError(`Cannot exceed outstanding quantity (Only ${outstanding} units outstanding).`);
      return;
    }

    setIsSubmittingDelivery(true);
    setTimeout(() => {
      recordDelivery({
        orderId: selectedOrder.id,
        items: [{ partId: line.partId, qty: deliveredQtyInput }],
        waybill: deliveryWaybill,
        carrier: deliveryCarrier,
        date: deliveryDate,
      });
      setIsSubmittingDelivery(false);
      setIsDeliveryModalOpen(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Procurement & Orders Board
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            End-to-end customer purchases linked directly to backing supplier purchase orders with partial delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSupplierCompareOpen(true)}
            leftIcon={<Layers className="w-3.5 h-3.5" />}
          >
            Compare Suppliers
          </Button>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-sm border border-border w-fit text-xs">
        <button
          type="button"
          onClick={() => setOrderTypeTab('customer')}
          className={clsx(
            'px-4 py-1.5 rounded-xs font-medium transition-colors',
            orderTypeTab === 'customer'
              ? 'bg-surface text-ink-900 font-bold shadow-xs'
              : 'text-ink-500 hover:text-ink-900'
          )}
        >
          Customer Orders (Sales POs)
        </button>
        <button
          type="button"
          onClick={() => setOrderTypeTab('supplier')}
          className={clsx(
            'px-4 py-1.5 rounded-xs font-medium transition-colors',
            orderTypeTab === 'supplier'
              ? 'bg-surface text-ink-900 font-bold shadow-xs'
              : 'text-ink-500 hover:text-ink-900'
          )}
        >
          Supplier Orders (Purchase POs)
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider text-ink-700 font-semibold">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">{orderTypeTab === 'customer' ? 'Customer' : 'Supplier'}</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4 text-right">Order Value</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 w-56">Fulfillment Progress</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const entity = ENTITIES[order.entityId] || ENTITIES['peru'];
                const totalOrdered = order.lines.reduce((acc, l) => acc + l.orderedQty, 0);
                const totalDelivered = order.lines.reduce((acc, l) => acc + l.deliveredQty, 0);
                const totalInTransit = order.lines.reduce((acc, l) => acc + l.inTransitQty, 0);

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="hover:bg-primary-tint/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-ink-900">
                      {order.id}
                      {order.linkedOrders.length > 0 && (
                        <span className="text-[10px] text-primary block font-normal">
                          Linked to {order.linkedOrders.join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-ink-900">{order.counterparty}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-500">
                      {entity.shortName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-ink-900">
                      {formatMoney(order.total, order.currency, true)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <FulfillmentBar
                        ordered={totalOrdered}
                        delivered={totalDelivered}
                        inTransit={totalInTransit}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(order.id);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderId(null)}
        title={
          selectedOrder ? (
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-ink-900 text-base">{selectedOrder.id}</span>
              <StatusBadge status={selectedOrder.fulfillmentStatus} />
            </div>
          ) : null
        }
        subtitle={selectedOrder?.counterparty}
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Action Bar for Delivery Recording */}
            <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-sm">
              <div>
                <span className="font-semibold text-ink-900 block">Warehouse Receipt & Waybills</span>
                <span className="text-[11px] text-ink-500">
                  Record inward or outward partial dispatches.
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenDeliveryModal}
                leftIcon={<Truck className="w-3.5 h-3.5" />}
              >
                Record partial delivery
              </Button>
            </div>

            {/* Lines Ordered vs Delivered */}
            <div>
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider text-[11px] mb-2">
                Order Line Items & Delivery Status
              </h4>
              <div className="border border-border rounded-sm overflow-hidden bg-surface">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-surface-sunken border-b border-border text-[11px] uppercase font-semibold text-ink-700">
                    <tr className="border-b border-border">
                      <th className="p-2.5">Part</th>
                      <th className="p-2.5 text-center">Ordered</th>
                      <th className="p-2.5 text-center">Delivered</th>
                      <th className="p-2.5 text-center">Backorder</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedOrder.lines.map((l, index) => {
                      const backorder = Math.max(0, l.orderedQty - l.deliveredQty);
                      return (
                        <tr key={index}>
                          <td className="p-2.5">
                            <span className="font-mono font-bold text-primary block">{l.partId}</span>
                            <span className="text-ink-700 text-[11px]">{l.description}</span>
                          </td>
                          <td className="p-2.5 text-center font-mono font-medium">{l.orderedQty}</td>
                          <td className="p-2.5 text-center font-mono text-success font-semibold">
                            {l.deliveredQty}
                          </td>
                          <td className="p-2.5 text-center font-mono text-warning font-semibold">
                            {backorder}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-ink-900">
                            {formatMoney(l.unitPrice, selectedOrder.currency, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Linked Orders Panel (Relationship made visible - PRD Spec 12.5) */}
            {selectedOrder.linkedOrders.length > 0 && (
              <div className="p-3.5 bg-primary-tint/40 border border-primary/30 rounded-sm space-y-1.5">
                <span className="font-semibold text-primary uppercase text-[10.5px] tracking-wider block">
                  Cross-Linked Purchase Relationship
                </span>
                <p className="text-ink-700 text-[11px] leading-relaxed">
                  This sales order is fulfilled via supplier purchase orders:{' '}
                  <strong className="font-mono">{selectedOrder.linkedOrders.join(', ')}</strong>. Any delivery recorded updates both fulfillment ledgers simultaneously.
                </p>
              </div>
            )}

            {/* Historical Deliveries Log */}
            <div>
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider text-[11px] mb-2">
                Waybill Dispatches & Deliveries Log
              </h4>
              {selectedOrder.deliveries.length > 0 ? (
                <div className="space-y-2">
                  {selectedOrder.deliveries.map((del) => (
                    <div
                      key={del.id}
                      className="p-3 bg-surface border border-border rounded-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <div>
                          <span className="font-mono font-bold text-ink-900 block">{del.waybill}</span>
                          <span className="text-[11px] text-ink-500 font-mono">
                            {del.carrier} · {formatDate(del.date)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        {del.items.reduce((acc, i) => acc + i.qty, 0)} units verified
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-500 py-3 text-center">
                  No dispatches recorded yet for this order.
                </p>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Record Partial Delivery Modal */}
      <Modal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        title="Record Partial Delivery & Waybill"
        description="Updates delivered quantities and backorder status across customer & supplier PO."
      >
        <form onSubmit={handleSubmitDelivery} className="space-y-4 text-xs">
          <Input
            label="Delivered Units"
            type="number"
            min="1"
            value={deliveredQtyInput}
            onChange={(e) => setDeliveredQtyInput(parseInt(e.target.value) || 0)}
            error={deliveryError || undefined}
            helperText="Cannot exceed outstanding quantity"
            required
          />
          <Input
            label="Waybill / Dispatch Number"
            value={deliveryWaybill}
            onChange={(e) => setDeliveryWaybill(e.target.value)}
            required
          />
          <Input
            label="Logistics Carrier"
            value={deliveryCarrier}
            onChange={(e) => setDeliveryCarrier(e.target.value)}
            required
          />
          <Input
            label="Date of Delivery"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDeliveryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingDelivery}>
              Confirm Delivery
            </Button>
          </div>
        </form>
      </Modal>

      {/* Supplier Comparison Modal (PRD Spec 12.5) */}
      <Modal
        isOpen={isSupplierCompareOpen}
        onClose={() => setIsSupplierCompareOpen(false)}
        title="Supplier Quote Comparison (3 Columns)"
        description="Compare lead times, validity and historical on-time fulfillment rates across European & African partners."
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            {
              name: 'Hartmann Drilling Supply (DE)',
              price: 88.5,
              leadTime: '14 days air / 35 days sea',
              validity: '15 Nov 2026',
              onTimeRate: '97.4%',
              rating: 'Preferred OEM',
            },
            {
              name: 'Pretoria Rock Tools (ZA)',
              price: 92.0,
              leadTime: '10 days road to Kitwe',
              validity: '30 Oct 2026',
              onTimeRate: '91.8%',
              rating: 'Regional',
            },
            {
              name: 'Andes Wear Components (CL)',
              price: 95.0,
              leadTime: '7 days road to Lima',
              validity: '01 Dec 2026',
              onTimeRate: '94.2%',
              rating: 'Regional',
            },
          ].map((sup, idx) => (
            <div
              key={sup.name}
              className="p-3.5 bg-surface border border-border rounded-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-ink-900 block leading-tight">{sup.name}</span>
                <span className="text-[10px] text-ink-500 font-mono block mt-0.5">{sup.rating}</span>
                <div className="text-base font-bold font-mono text-primary my-2">
                  USD {sup.price} <span className="text-xs font-normal text-ink-500">/ unit</span>
                </div>
                <div className="space-y-1 text-[11px] text-ink-700">
                  <p>
                    <strong>Lead time:</strong> {sup.leadTime}
                  </p>
                  <p>
                    <strong>Valid until:</strong> {sup.validity}
                  </p>
                  <p>
                    <strong>On-time record:</strong> {sup.onTimeRate}
                  </p>
                </div>
              </div>

              <Button
                variant={idx === 0 ? 'primary' : 'secondary'}
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  addToast(`Selected ${sup.name} for procurement draft`, 'success');
                  setIsSupplierCompareOpen(false);
                }}
              >
                Select supplier
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
