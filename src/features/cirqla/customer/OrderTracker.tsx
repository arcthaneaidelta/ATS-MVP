import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  ShoppingBag,
  HelpCircle,
  Star,
  Download,
  Receipt,
  X,
} from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
  onDone: () => void;
  accent: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  order,
  onDone,
  accent,
}) => {
  const { toast } = useToast();
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Received', label: 'Order Received', desc: 'Ticket printed at kitchen display' },
    { key: 'Preparing', label: 'Preparing', desc: 'Chef is grilling and assembling your order' },
    { key: 'Ready', label: 'Ready for Collection', desc: 'Plated and waiting at pass' },
    { key: 'Collected', label: 'Collected', desc: 'Delivered to Table ' + order.table },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isReady = order.status === 'Ready';
  const isCollected = order.status === 'Collected';

  const handleDownloadReceipt = () => {
    toast('Receipt downloaded (PDF formatted)', 'success');
  };

  const handleRatingSubmit = () => {
    setRatingSubmitted(true);
    toast('Thank you for your rating!', 'success');
  };

  return (
    <div
      className={`h-full flex flex-col justify-between p-4 overflow-y-auto text-left font-sans transition-colors duration-500 ${
        isReady ? 'bg-[#EBF3EE]' : 'bg-bg'
      }`}
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-[10px] uppercase font-bold text-ink tracking-wider">
              Live Order Tracker
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowHelpSheet(true)}
            className="text-xs text-ink-3 hover:text-ink flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>

        {/* Hero Status Callout */}
        <div className="p-4 rounded-2xl bg-elevated border border-line shadow-sm mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold" style={{ color: accent }}>
              Order #{order.orderNumber}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg text-ink-3">
              Table {order.table}
            </span>
          </div>

          <h2 className="font-serif text-2xl text-ink font-semibold">
            {order.status === 'Received' && 'Order Received'}
            {order.status === 'Preparing' && 'Kitchen is Preparing'}
            {order.status === 'Ready' && 'Ready for Collection!'}
            {order.status === 'Collected' && 'Enjoy Your Meal!'}
          </h2>

          <div className="flex items-center gap-2 text-xs text-ink-3 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {order.status === 'Received' && 'Estimated wait: ~12 min'}
              {order.status === 'Preparing' && 'Estimated wait: ~6 min'}
              {order.status === 'Ready' && 'Ready now at kitchen pass'}
              {order.status === 'Collected' && 'Fulfilled'}
            </span>
          </div>
        </div>

        {/* Special 'Ready' Card when status is Ready */}
        {isReady && (
          <div className="p-3.5 rounded-xl bg-ok text-white shadow-md mb-4 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5">
              <BellRing className="w-5 h-5 animate-bounce shrink-0" />
              <div>
                <p className="text-xs font-bold">Please Collect at Pass</p>
                <p className="text-[11px] text-white/80">Show ticket #{order.orderNumber} to staff</p>
              </div>
            </div>
          </div>
        )}

        {/* 4-Step Stepper */}
        <div className="p-4 rounded-2xl bg-surface border border-line space-y-4 mb-4">
          <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
            Progress Timeline
          </span>

          <div className="space-y-4 relative pl-3">
            {/* Connecting Vertical Line */}
            <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-line" />

            {steps.map((st, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={st.key} className="flex items-start gap-3 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-all ${
                      isPast
                        ? 'bg-ok text-white'
                        : isCurrent
                        ? 'bg-elevated border-2 text-ink shadow-sm'
                        : 'bg-bg text-ink-3 border border-line'
                    }`}
                    style={{
                      borderColor: isCurrent ? accent : undefined,
                    }}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div>
                    <span
                      className={`text-xs block font-sans ${
                        isCurrent ? 'font-bold text-ink' : isPast ? 'font-semibold text-ink-2' : 'text-ink-3'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[11px] text-ink-3">{st.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Order Summary */}
        <div className="p-4 rounded-2xl bg-surface border border-line space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-line text-ink-3">
            <span>Items Ordered</span>
            <span className="font-mono">${order.total.toFixed(2)}</span>
          </div>
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between py-1">
              <div>
                <span className="font-semibold text-ink">{it.quantity}x {it.name}</span>
                {it.modifiers && it.modifiers.length > 0 && (
                  <span className="block text-[10px] text-ink-3">
                    {it.modifiers.map((m) => m.optionName).join(', ')}
                  </span>
                )}
              </div>
              <span className="font-mono text-ink-3">${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-line space-y-2 shrink-0">
        {isCollected ? (
          <div className="space-y-3">
            {!ratingSubmitted ? (
              <div className="p-3 rounded-xl bg-surface border border-line text-center space-y-2">
                <span className="text-xs font-semibold text-ink">Rate your dining experience</span>
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 ${rating >= star ? 'text-warn' : 'text-line-2'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <Button variant="primary" size="sm" onClick={handleRatingSubmit} block style={{ backgroundColor: accent }}>
                  Submit Rating
                </Button>
              </div>
            ) : null}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                block
                onClick={() => setShowReceipt(true)}
              >
                <Receipt className="w-3.5 h-3.5 mr-1" />
                <span>View Receipt</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                block
                onClick={onDone}
                style={{ backgroundColor: accent }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={() => setShowReceipt(true)}
            >
              <Receipt className="w-3.5 h-3.5 mr-1" />
              <span>Digital Receipt</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={() => {
                // Open venue board in new tab to demonstrate cross-tab sync
                window.open('/cirqla/venue/orders', '_blank');
              }}
            >
              <span>Venue Tab</span>
            </Button>
          </div>
        )}
      </div>

      {/* Help Sheet */}
      {showHelpSheet && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-elevated p-6 rounded-t-2xl border-t border-line space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-lg text-ink font-semibold">Table Assistance</h4>
              <button onClick={() => setShowHelpSheet(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>
            <p className="text-xs text-ink-2">
              Need water, cutlery, or to speak with a server? We have notified your section manager.
            </p>
            <Button
              variant="primary"
              size="md"
              block
              onClick={() => {
                setShowHelpSheet(false);
                toast('Server notified for Table ' + order.table, 'info');
              }}
              style={{ backgroundColor: accent }}
            >
              Call Server to Table
            </Button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-line p-6 shadow-2xl space-y-4 font-mono text-xs text-left">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <p className="font-bold text-ink text-sm">Kiln Street Kitchen</p>
                <p className="text-[10px] text-ink-3">Central Branch · Table {order.table}</p>
              </div>
              <button onClick={() => setShowReceipt(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>

            <div className="space-y-1 text-ink-2">
              <div className="flex justify-between">
                <span>Order No:</span>
                <span className="font-bold text-ink">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{order.paymentMethod.toUpperCase()} (Approved)</span>
              </div>
            </div>

            <div className="border-t border-dashed border-line py-2 space-y-1">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-2 space-y-1">
              <div className="flex justify-between font-bold text-sm text-ink">
                <span>Total Paid:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="ghost" size="sm" block onClick={handleDownloadReceipt}>
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download PDF Receipt</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
