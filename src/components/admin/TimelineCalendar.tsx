import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { 
  addDays, 
  format, 
  parseISO, 
  isSameDay, 
  eachDayOfInterval, 
  differenceInCalendarDays,
  startOfDay 
} from 'date-fns';
import { formatDate, formatShortDate, formatCurrency } from '../../lib/format';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, Textarea } from '../ui/FormControls';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  AlertTriangle, 
  ShieldCheck, 
  Wrench, 
  User, 
  CheckCircle2, 
  Trash2,
  Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Vehicle, Booking, VehicleBlock } from '../../types';

export const TimelineCalendar: React.FC = () => {
  const { vehicles, bookings, blocks, addBlock, removeBlock, cancelBooking } = useDemoStore();
  const { toast } = useToast();

  const today = startOfDay(new Date());
  // Show 30 days starting 3 days before today
  const startDate = addDays(today, -3);
  const totalDays = 32;
  const days = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  // Detail & Action Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<VehicleBlock | null>(null);

  // New Block / Offline Reservation Modal
  const [newBlockOpen, setNewBlockOpen] = useState(false);
  const [blockVehicleId, setBlockVehicleId] = useState(vehicles[0]?.id || '');
  const [blockStart, setBlockStart] = useState(format(addDays(today, 2), 'yyyy-MM-dd'));
  const [blockEnd, setBlockEnd] = useState(format(addDays(today, 6), 'yyyy-MM-dd'));
  const [blockType, setBlockType] = useState<'maintenance' | 'offline_booking'>('maintenance');
  const [blockTitle, setBlockTitle] = useState('');
  const [blockCustomer, setBlockCustomer] = useState('');
  const [blockNotes, setBlockNotes] = useState('');
  const [blockError, setBlockError] = useState<string | null>(null);

  const handleCellClick = (vehicleId: string, day: Date) => {
    setBlockVehicleId(vehicleId);
    const dayStr = format(day, 'yyyy-MM-dd');
    setBlockStart(dayStr);
    setBlockEnd(format(addDays(day, 4), 'yyyy-MM-dd'));
    setBlockTitle('Maintenance Service');
    setBlockError(null);
    setNewBlockOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);

    const title = blockType === 'maintenance'
      ? (blockTitle || 'Scheduled Maintenance Service')
      : `VIP Offline Booking — ${blockCustomer || 'Phone Client'}`;

    const res = addBlock({
      vehicleId: blockVehicleId,
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockType,
      title,
      customerName: blockCustomer,
      notes: blockNotes,
    });

    if (!res.success) {
      setBlockError(res.error || 'Conflict detected');
      return;
    }

    toast({
      type: 'success',
      title: 'Timeline Updated',
      message: `${title} logged for ${blockStart} to ${blockEnd}.`,
    });
    setNewBlockOpen(false);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Legend & Controls */}
      <div className="bg-surface p-4 rounded-lg border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-primary" />
            <span className="text-ink font-medium">Online Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-accent" />
            <span className="text-ink font-medium">Offline Booking (Phone/VIP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-sand border border-dashed border-ink-3" />
            <span className="text-ink font-medium">Maintenance / Depot Block</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-3 italic">
            <span>* Quotations do not hold vehicles until accepted</span>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setBlockTitle('Maintenance Inspection');
            setBlockError(null);
            setNewBlockOpen(true);
          }}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Block / Offline Booking
        </Button>
      </div>

      {/* Timeline Grid Container */}
      <div className="bg-surface rounded-lg border border-border shadow-sh-1 overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Header Row: Dates */}
          <div className="grid grid-cols-[220px_repeat(32,_minmax(34px,_1fr))] border-b border-border bg-surface-elevated sticky top-0 z-20">
            {/* Corner header */}
            <div className="p-3 text-xs font-semibold text-ink-2 uppercase tracking-wider border-r border-border bg-surface-elevated sticky left-0 z-30">
              Vehicle Fleet ({vehicles.length})
            </div>

            {/* Days columns */}
            {days.map((day, idx) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={idx}
                  className={cn(
                    'p-1.5 text-center text-[10px] border-r border-border/60 flex flex-col items-center justify-center select-none',
                    isToday ? 'bg-accent-soft/80 font-bold text-accent' : 'text-ink-3'
                  )}
                >
                  <span className="uppercase">{format(day, 'EEE')[0]}</span>
                  <span className={cn('text-xs font-semibold mt-0.5', isToday && 'text-accent underline')}>
                    {format(day, 'd')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Vehicle Rows */}
          <div className="divide-y divide-border">
            {vehicles.map((vehicle) => {
              // Find all bookings and blocks for this vehicle
              const vBookings = bookings.filter((b) => b.vehicleId === vehicle.id && b.status === 'confirmed');
              const vBlocks = blocks.filter((bl) => bl.vehicleId === vehicle.id);

              return (
                <div
                  key={vehicle.id}
                  className="grid grid-cols-[220px_repeat(32,_minmax(34px,_1fr))] relative hover:bg-sand-soft/20 transition-colors h-14"
                >
                  {/* Sticky left vehicle cell */}
                  <div className="p-2.5 border-r border-border bg-surface flex items-center gap-2.5 sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="w-10 h-8 rounded object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ink truncate leading-tight">
                        {vehicle.name}
                      </div>
                      <div className="text-[10px] text-ink-3">{vehicle.type}</div>
                    </div>
                  </div>

                  {/* Empty day grid cells (for clicking) */}
                  {days.map((day, dIdx) => {
                    const isToday = isSameDay(day, today);
                    return (
                      <div
                        key={dIdx}
                        onClick={() => handleCellClick(vehicle.id, day)}
                        className={cn(
                          'border-r border-border/40 hover:bg-accent-soft/30 transition-colors cursor-pointer',
                          isToday && 'bg-accent-soft/20'
                        )}
                        title={`Click to block ${vehicle.name} on ${formatDate(day)}`}
                      />
                    );
                  })}

                  {/* Render Bookings Bars Over Grid */}
                  {vBookings.map((b) => {
                    const bStart = parseISO(b.startDate);
                    const bEnd = parseISO(b.endDate);

                    // Calculate column offsets
                    const offsetStart = differenceInCalendarDays(bStart, startDate);
                    const duration = differenceInCalendarDays(bEnd, bStart);

                    if (offsetStart + duration < 0 || offsetStart >= totalDays) return null;

                    const visStart = Math.max(0, offsetStart);
                    const visEnd = Math.min(totalDays, offsetStart + Math.max(1, duration));
                    const colStart = visStart + 2; // +1 for 1-indexing, +1 for the vehicle column
                    const span = Math.max(1, visEnd - visStart);

                    const isOnline = b.source === 'online';

                    return (
                      <div
                        key={b.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        style={{
                          gridColumn: `${colStart} / span ${span}`,
                          gridRow: 1,
                        }}
                        className={cn(
                          'absolute top-2 bottom-2 z-10 rounded px-2 flex items-center justify-between text-white text-[11px] font-medium shadow-sm cursor-pointer select-none truncate transition-transform hover:scale-[1.01] hover:brightness-110',
                          isOnline ? 'bg-primary border border-white/20' : 'bg-accent border border-white/20'
                        )}
                        title={`${b.reference}: ${b.customerName} (${b.startDate} to ${b.endDate})`}
                      >
                        <span className="truncate">
                          {b.reference} · {b.customerName}
                        </span>
                        <span className="text-[9px] opacity-80 shrink-0 ml-1">
                          {span}d
                        </span>
                      </div>
                    );
                  })}

                  {/* Render Blocks Bars Over Grid */}
                  {vBlocks.map((bl) => {
                    const blStart = parseISO(bl.startDate);
                    const blEnd = parseISO(bl.endDate);

                    const offsetStart = differenceInCalendarDays(blStart, startDate);
                    const duration = differenceInCalendarDays(blEnd, blStart);

                    if (offsetStart + duration < 0 || offsetStart >= totalDays) return null;

                    const visStart = Math.max(0, offsetStart);
                    const visEnd = Math.min(totalDays, offsetStart + Math.max(1, duration));
                    const colStart = visStart + 2;
                    const span = Math.max(1, visEnd - visStart);

                    return (
                      <div
                        key={bl.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlock(bl);
                        }}
                        style={{
                          gridColumn: `${colStart} / span ${span}`,
                          gridRow: 1,
                        }}
                        className={cn(
                          'absolute top-2.5 bottom-2.5 z-10 rounded px-2 flex items-center justify-between text-ink text-[11px] font-medium shadow-sm cursor-pointer select-none truncate border',
                          bl.reason === 'offline_booking'
                            ? 'bg-accent/80 text-white border-accent'
                            : 'bg-[#D9CDB8] text-[#1D211E] border-[#A89F8D] bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.06)_6px,rgba(0,0,0,0.06)_12px)]'
                        )}
                        title={`${bl.title} (${bl.startDate} to ${bl.endDate})`}
                      >
                        <div className="flex items-center gap-1 truncate">
                          {bl.reason === 'maintenance' ? (
                            <Wrench className="w-3 h-3 shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 shrink-0" />
                          )}
                          <span className="truncate">{bl.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.reference}`}
          description={`Reserved for ${selectedBooking.customerName}`}
        >
          <div className="space-y-4 text-xs text-left">
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-elevated rounded border border-border">
              <div>
                <span className="text-ink-3">Rental Dates:</span>
                <div className="font-semibold text-ink text-sm">
                  {formatDate(selectedBooking.startDate)} – {formatDate(selectedBooking.endDate)}
                </div>
              </div>
              <div>
                <span className="text-ink-3">Customer Contact:</span>
                <div className="font-semibold text-ink">{selectedBooking.customerEmail}</div>
                <div className="text-ink-2">{selectedBooking.customerPhone}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-elevated rounded border border-border">
              <div>
                <span className="text-ink-3">Payment Total:</span>
                <div className="font-serif text-lg font-semibold text-primary">
                  {formatCurrency(selectedBooking.totalAmount)}
                </div>
                <div className="text-[10px] text-success font-medium">Paid in full (DPO Verified)</div>
              </div>
              <div>
                <span className="text-ink-3">Security Deposit:</span>
                <div className="font-semibold text-ink">
                  {formatCurrency(selectedBooking.securityDeposit)}
                </div>
                <div className="text-[10px] text-ink-3">Card Hold (Released post-return)</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Cancel this confirmed booking? This will free the vehicle on the public site.')) {
                    cancelBooking(selectedBooking.id);
                    toast({ type: 'info', title: 'Booking Cancelled', message: selectedBooking.reference });
                    setSelectedBooking(null);
                  }
                }}
              >
                Cancel Reservation
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Block Detail Modal */}
      {selectedBlock && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBlock(null)}
          title={selectedBlock.title}
          description={`Scheduled Block (${selectedBlock.reason.toUpperCase()})`}
        >
          <div className="space-y-4 text-xs text-left">
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <div className="font-semibold text-ink text-sm">
                {formatDate(selectedBlock.startDate)} – {formatDate(selectedBlock.endDate)}
              </div>
              {selectedBlock.notes && (
                <p className="text-ink-2 mt-2 leading-relaxed">{selectedBlock.notes}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  removeBlock(selectedBlock.id);
                  toast({ type: 'success', title: 'Block Removed', message: 'Vehicle availability restored.' });
                  setSelectedBlock(null);
                }}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove Block
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setSelectedBlock(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Block / Offline Booking Modal */}
      {newBlockOpen && (
        <Modal
          isOpen={true}
          onClose={() => setNewBlockOpen(false)}
          title="Add Vehicle Block / Offline Booking"
          description="Directly block dates on the fleet timeline"
        >
          <form onSubmit={handleSaveBlock} className="space-y-4 text-left">
            {blockError && (
              <div className="p-3 bg-error-soft text-error text-xs rounded border border-error/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{blockError}</span>
              </div>
            )}

            <Select
              label="Select Vehicle"
              value={blockVehicleId}
              onChange={(e) => setBlockVehicleId(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type})
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                required
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                required
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
              />
            </div>

            <Select
              label="Block Type"
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as any)}
            >
              <option value="maintenance">Maintenance Service / Inspection Block</option>
              <option value="offline_booking">Offline Customer Booking (Phone/Walk-in/EFT)</option>
            </Select>

            {blockType === 'offline_booking' ? (
              <Input
                label="Customer Name & Contact"
                placeholder="e.g. Mr. T. Shikongo (+264 81 294 8812)"
                required
                value={blockCustomer}
                onChange={(e) => setBlockCustomer(e.target.value)}
              />
            ) : (
              <Input
                label="Service Title"
                placeholder="e.g. 40,000km Major Service at Windhoek Toyota"
                value={blockTitle}
                onChange={(e) => setBlockTitle(e.target.value)}
              />
            )}

            <Textarea
              label="Internal Notes"
              placeholder="e.g. Fitment of new BF Goodrich tyres, brake fluid flush..."
              rows={2}
              value={blockNotes}
              onChange={(e) => setBlockNotes(e.target.value)}
            />

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" type="button" onClick={() => setNewBlockOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save to Timeline
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
