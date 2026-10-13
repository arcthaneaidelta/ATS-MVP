import React, { useState, useEffect } from 'react';
import { useCirqlaStore } from '../../../store/cirqla';
import { useDemoStore } from '../../../store/demo';
import { Order, OrderStatus } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Toggle } from '../../../components/ui/Toggle';
import { useToast } from '../../../components/ui/Toast';
import {
  ChefHat,
  Clock,
  Printer,
  RotateCcw,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Volume2,
  VolumeX,
  Search,
  X,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

export const OrderBoardPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    refundOrder,
    kitchenOpen,
    setKitchenOpen,
    simulateIncomingOrder,
  } = useCirqlaStore();

  const { audioChimeEnabled, toggleAudioChime, activeBranchId } = useDemoStore();
  const { toast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [searchTable, setSearchTable] = useState('');
  const [printTicketOrder, setPrintTicketOrder] = useState<Order | null>(null);

  // Audio chime synthesizer for realistic web audio chime
  const playArrivalChime = () => {
    if (!audioChimeEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Two-tone chime: Tone 1 (587.33 Hz - D5) then Tone 2 (880 Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, now + 0.15);
      gain2.gain.setValueAtTime(0.2, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);
    } catch (e) {
      // Audio playback restricted
    }
  };

  // Filter orders for active branch
  const branchOrders = orders.filter((o) => {
    const matchesBranch = activeBranchId === 'All' || o.branchId === activeBranchId;
    const matchesTable =
      !searchTable.trim() ||
      o.table.toLowerCase().includes(searchTable.toLowerCase()) ||
      o.orderNumber.includes(searchTable.trim());
    return matchesBranch && matchesTable;
  });

  const newOrders = branchOrders.filter((o) => o.status === 'Received');
  const prepOrders = branchOrders.filter((o) => o.status === 'Preparing');
  const readyOrders = branchOrders.filter((o) => o.status === 'Ready');

  const getElapsedMinutes = (isoDate: string) => {
    const elapsedMs = Date.now() - new Date(isoDate).getTime();
    return Math.floor(elapsedMs / (60 * 1000));
  };

  const handleAdvanceStatus = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    let nextStatus: OrderStatus = 'Preparing';
    if (order.status === 'Received') nextStatus = 'Preparing';
    else if (order.status === 'Preparing') nextStatus = 'Ready';
    else if (order.status === 'Ready') nextStatus = 'Collected';

    updateOrderStatus(order.id, nextStatus);
    toast(`Order #${order.orderNumber} moved to ${nextStatus}`, 'success');
  };

  const handleSimulate = () => {
    simulateIncomingOrder();
    playArrivalChime();
    toast('Simulated customer order dispatched!', 'success');
  };

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Live Kitchen Display
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-ok-tint text-ok border border-ok/20">
              {branchOrders.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Real-time ticket arrival and fire dispatch with sub-300ms diner sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 text-ink-3 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table or #"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full h-8 pl-8 pr-2 rounded-md bg-elevated border border-line text-xs font-sans text-ink outline-none"
            />
          </div>

          {/* Kitchen Open Toggle */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-surface border border-line text-xs">
            <span className="text-ink-2 font-medium">Kitchen Service:</span>
            <Toggle
              checked={kitchenOpen}
              onChange={(val) => {
                if (!val) setShowClosedModal(true);
                else setKitchenOpen(true);
              }}
              label={kitchenOpen ? 'Open' : 'Paused'}
            />
          </div>

          {/* Chime toggle */}
          <button
            type="button"
            onClick={toggleAudioChime}
            aria-label="Toggle kitchen arrival chime"
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              audioChimeEnabled
                ? 'bg-ok-tint text-ok border-ok/30'
                : 'bg-surface text-ink-3 border-line'
            }`}
          >
            {audioChimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioChimeEnabled ? 'Chime On' : 'Chime Off'}</span>
          </button>

          {/* Simulate New Ticket */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulate}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Simulate Incoming Order
          </Button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: NEW */}
        <div className="rounded-2xl bg-surface border border-line p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-clay animate-pulse" />
              <h2 className="text-xs uppercase font-bold text-ink tracking-wider">
                New Tickets ({newOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-ink-3 font-mono">Requires Acceptance</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {newOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink-3">
                Quiet for now. New orders land here.
              </div>
            ) : (
              newOrders.map((ord) => {
                const age = getElapsedMinutes(ord.createdAt);
                const isAged = age >= 8;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="p-4 rounded-xl bg-elevated border border-line shadow-xs hover:border-clay hover:shadow-md transition-all cursor-pointer space-y-3 group text-left border-l-4 border-l-clay animate-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-clay">
                          #{ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-bg border border-line text-ink">
                          Table {ord.table}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold flex items-center gap-1 ${
                          isAged ? 'text-err animate-pulse' : 'text-ink-3'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {age}m ago
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ord.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between text-ink-2">
                          <span className="truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                      {ord.items.length > 2 && (
                        <span className="text-[10px] text-ink-3 italic">
                          +{ord.items.length - 2} more items...
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-line flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-ink">
                          ${ord.total.toFixed(2)}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-ok-tint text-ok'
                              : 'bg-warn-tint text-warn'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => handleAdvanceStatus(ord, e)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="rounded-2xl bg-surface border border-line p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-warn" />
              <h2 className="text-xs uppercase font-bold text-ink tracking-wider">
                Preparing ({prepOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-ink-3 font-mono">On Line</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {prepOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink-3">
                No orders currently in prep.
              </div>
            ) : (
              prepOrders.map((ord) => {
                const age = getElapsedMinutes(ord.createdAt);
                const isCritical = age >= 12;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="p-4 rounded-xl bg-elevated border border-line shadow-xs hover:border-warn hover:shadow-md transition-all cursor-pointer space-y-3 group text-left border-l-4 border-l-warn"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-ink">
                          #{ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-bg border border-line text-ink">
                          Table {ord.table}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold flex items-center gap-1 ${
                          isCritical ? 'text-err animate-bounce' : 'text-warn'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {age}m
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ord.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between text-ink-2">
                          <span className="truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                      {ord.items.length > 2 && (
                        <span className="text-[10px] text-ink-3 italic">
                          +{ord.items.length - 2} more...
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-line flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-ink">
                        ${ord.total.toFixed(2)}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleAdvanceStatus(ord, e)}
                      >
                        Mark Ready
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="rounded-2xl bg-surface border border-line p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ok" />
              <h2 className="text-xs uppercase font-bold text-ink tracking-wider">
                Ready at Pass ({readyOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-ink-3 font-mono">Awaiting Pickup</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink-3">
                No tickets waiting at the pass.
              </div>
            ) : (
              readyOrders.map((ord) => {
                const age = getElapsedMinutes(ord.createdAt);

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="p-4 rounded-xl bg-elevated border border-line shadow-xs hover:border-ok hover:shadow-md transition-all cursor-pointer space-y-3 group text-left border-l-4 border-l-ok"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-ok">
                          #{ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-bg border border-line text-ink">
                          Table {ord.table}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-ok font-semibold">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ord.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between text-ink-2">
                          <span className="truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-line flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-ink">
                        ${ord.total.toFixed(2)}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleAdvanceStatus(ord, e)}
                        className="border-ok/30 text-ok hover:bg-ok-tint"
                      >
                        Collected
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Drawer (Click Card) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-lg h-full bg-elevated border-l border-line p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-left font-sans">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-clay tracking-wider">
                    Ticket Inspection
                  </span>
                  <h3 className="font-serif text-2xl text-ink font-semibold">
                    Order #{selectedOrder.orderNumber} · Table {selectedOrder.table}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-ink-3 hover:text-ink rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Metadata */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface border border-line text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-ink-3 uppercase block">Status</span>
                    <strong className="text-ink">{selectedOrder.status}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-3 uppercase block">Payment</span>
                    <strong className="text-ok">{selectedOrder.paymentStatus}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-3 uppercase block">Method</span>
                    <strong className="text-ink">{selectedOrder.paymentMethod.toUpperCase()}</strong>
                  </div>
                </div>

                {selectedOrder.customerName && (
                  <div className="text-xs text-ink-2">
                    <span className="text-ink-3">Diner Name:</span>{' '}
                    <strong>{selectedOrder.customerName}</strong>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="p-3 rounded-lg bg-clay-tint/40 border border-clay/20 text-xs text-ink">
                    <strong className="text-clay block mb-0.5">Kitchen Special Request:</strong>
                    {selectedOrder.notes}
                  </div>
                )}

                {/* Items with Modifiers Breakdown */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase font-bold text-ink-3 tracking-wider block">
                    Itemized Breakdown
                  </span>
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-xl bg-surface border border-line space-y-1 text-xs"
                    >
                      <div className="flex justify-between font-semibold text-ink">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-mono">${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                      {it.modifiers && it.modifiers.length > 0 && (
                        <div className="text-[11px] text-ink-3 space-y-0.5">
                          {it.modifiers.map((m, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>• {m.groupName}: {m.optionName}</span>
                              {m.priceDelta > 0 && <span>+${m.priceDelta.toFixed(2)}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-3 rounded-xl bg-bg border border-line space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-ink-3">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-ink-3">
                    <span>Service (5%) + Tax (8%):</span>
                    <span>${(selectedOrder.serviceCharge + selectedOrder.tax).toFixed(2)}</span>
                  </div>
                  {selectedOrder.tip > 0 && (
                    <div className="flex justify-between text-clay">
                      <span>Tip:</span>
                      <span>${selectedOrder.tip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-line flex justify-between font-bold text-sm text-ink">
                    <span>Grand Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions at Drawer Bottom */}
            <div className="pt-6 border-t border-line space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  block
                  onClick={() => {
                    handleAdvanceStatus(selectedOrder);
                    setSelectedOrder(null);
                  }}
                >
                  Advance to Next Stage
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setPrintTicketOrder(selectedOrder)}
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Refund order #${selectedOrder.orderNumber}?`)) {
                      refundOrder(selectedOrder.id);
                      setSelectedOrder(null);
                      toast(`Order #${selectedOrder.orderNumber} marked Refunded`, 'info');
                    }
                  }}
                  className="text-err hover:underline font-medium"
                >
                  Issue Full Refund
                </button>
                <span className="font-mono text-[10px] text-ink-3">
                  Placed {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 80mm Print Ticket Modal Simulation */}
      {printTicketOrder && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-80 bg-white rounded-lg p-6 font-mono text-xs text-left shadow-2xl border border-line space-y-3">
            <div className="text-center pb-2 border-b-2 border-dashed border-ink">
              <h4 className="font-bold text-base">KILN STREET KITCHEN</h4>
              <p className="text-[10px]">KITCHEN EXPO TICKET</p>
              <p className="text-[11px] font-bold mt-1">ORDER #{printTicketOrder.orderNumber}</p>
              <p className="text-sm font-bold bg-ink text-white py-0.5 rounded mt-1">
                TABLE {printTicketOrder.table}
              </p>
            </div>

            <div className="space-y-1.5 py-2 border-b-2 border-dashed border-ink">
              {printTicketOrder.items.map((it) => (
                <div key={it.id} className="text-ink">
                  <div className="flex justify-between font-bold">
                    <span>{it.quantity}x {it.name}</span>
                  </div>
                  {it.modifiers?.map((m, idx) => (
                    <div key={idx} className="text-[10px] pl-3 text-ink-3">
                      * {m.optionName}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-ink-3 space-y-0.5">
              <div>Time: {new Date(printTicketOrder.createdAt).toLocaleTimeString()}</div>
              <div>Server: Station Expo 1</div>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                block
                onClick={() => setPrintTicketOrder(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                block
                onClick={() => {
                  setPrintTicketOrder(null);
                  toast('80mm thermal ticket printed', 'success');
                }}
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Service Pause Modal */}
      {showClosedModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-96 bg-white rounded-xl p-6 border border-line shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-2 text-warn">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-serif text-lg font-bold text-ink">Pause Kitchen Orders?</h4>
            </div>
            <p className="text-xs text-ink-2 leading-relaxed">
              Pausing service will immediately disable ordering on diner phones and display a banner stating "Kitchen opens at 12:00".
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClosedModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setKitchenOpen(false);
                  setShowClosedModal(false);
                  toast('Kitchen ordering paused across all diner apps', 'info');
                }}
              >
                Confirm Pause
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
