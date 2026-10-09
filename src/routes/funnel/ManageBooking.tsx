import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { FunnelNav } from '../../components/funnel/FunnelNav';
import { FunnelFooter } from '../../components/funnel/FunnelFooter';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  Calendar as CalendarIcon, Clock, AlertTriangle, 
  RotateCcw, Check, X, ArrowLeft 
} from 'lucide-react';
import { addDays, format, isWeekend } from 'date-fns';

export const ManageBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appointments, cancelAppointment, rescheduleAppointment } = useAppStore();

  const apt = appointments.find(a => a.id === id) || appointments[0];

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');

  const [selectedDate, setSelectedDate] = useState<Date>(() => addDays(new Date(), 2));
  const [selectedSlot, setSelectedSlot] = useState<string>('01:00 PM');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i + 1));
  const standardSlots = ['10:00 AM', '11:30 AM', '01:00 PM', '03:45 PM'];

  const handleConfirmReschedule = () => {
    const [time, period] = selectedSlot.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const start = new Date(selectedDate);
    start.setHours(hours, mins, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 45);

    rescheduleAppointment(apt.id, start.toISOString(), end.toISOString());
    setIsRescheduling(false);
    setActionSuccess('Your consultation has been rescheduled. We sent you an updated calendar confirmation.');
  };

  const handleConfirmCancel = () => {
    cancelAppointment(apt.id, cancelReason);
    setIsCancelModalOpen(false);
    setActionSuccess('Your consultation has been cancelled. Automated reminders have been paused.');
  };

  const isCancelled = apt.status === 'cancelled';

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text flex flex-col justify-between">
      <FunnelNav />

      <main className="max-w-[700px] w-full mx-auto px-4 sm:px-6 py-14 flex-1 space-y-6">
        <div className="space-y-1 text-left">
          <button 
            onClick={() => navigate('/')}
            className="text-xs text-text-muted hover:text-text flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Alder & Finch</span>
          </button>
          <span className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Manage Appointment</span>
          <h1 className="font-serif text-3xl font-normal text-text">
            {isCancelled ? 'Consultation Cancelled' : 'Your Scheduled Consultation'}
          </h1>
        </div>

        {actionSuccess && (
          <div className="p-4 bg-primary-soft border border-primary/20 rounded-card text-xs text-primary flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{actionSuccess}</div>
          </div>
        )}

        {/* Appointment Card */}
        <div className="bg-surface-elevated rounded-modal p-6 sm:p-7 border border-border shadow-sh-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text uppercase tracking-wider">{apt.title}</span>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-chip ${
              isCancelled ? 'bg-error/15 text-error' : 'bg-primary-soft text-primary'
            }`}>
              {isCancelled ? 'Cancelled' : 'Confirmed'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-text-2">
            <div>
              <div className="text-text-muted">Date & Time</div>
              <div className="text-sm font-semibold text-text mt-0.5">
                {format(new Date(apt.start), 'EEEE, MMMM d, yyyy')} at {format(new Date(apt.start), 'h:mm a')} PST
              </div>
            </div>

            <div>
              <div className="text-text-muted">Format</div>
              <div className="mt-0.5 font-medium capitalize">
                {apt.format === 'in_home' ? 'In-Home Visit' : 'Video Conference'}
              </div>
            </div>

            <div>
              <div className="text-text-muted">Host</div>
              <div className="mt-0.5 font-medium">
                Dana Whitfield, Principal Designer
              </div>
            </div>
          </div>

          {!isCancelled && !isRescheduling && (
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsRescheduling(true)}
                icon={<RotateCcw className="w-4 h-4" />}
                className="flex-1"
              >
                Reschedule to Another Time
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsCancelModalOpen(true)}
                className="text-error hover:bg-error/10 border-error/20"
              >
                Cancel Appointment
              </Button>
            </div>
          )}

          {isCancelled && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/book')}
                className="w-full"
              >
                Book a New Consultation
              </Button>
            </div>
          )}
        </div>

        {/* Reschedule View */}
        {isRescheduling && (
          <div className="bg-surface rounded-modal p-6 border border-border space-y-5 animate-in fade-in-50 duration-fast">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
                Select a New Time Slot
              </h3>
              <button 
                onClick={() => setIsRescheduling(false)}
                className="text-xs text-text-muted hover:text-text"
              >
                Dismiss
              </button>
            </div>

            {/* Day row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {calendarDays.map((d) => {
                const weekend = isWeekend(d);
                const isSelected = d.toDateString() === selectedDate.toDateString();

                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={weekend}
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-1 rounded-input text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-[#FBFAF7] font-semibold'
                        : weekend
                        ? 'opacity-30 cursor-not-allowed'
                        : 'bg-sunken hover:bg-border/60 text-text'
                    }`}
                  >
                    <div className="text-[10px] uppercase opacity-75">{format(d, 'EEE').slice(0, 1)}</div>
                    <div className="text-xs font-semibold">{format(d, 'd')}</div>
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            <div className="grid grid-cols-2 gap-2">
              {standardSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-input text-xs font-medium border text-center transition-all ${
                    selectedSlot === slot
                      ? 'bg-primary text-[#FBFAF7] font-semibold border-primary'
                      : 'bg-surface border-border hover:border-primary text-text'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsRescheduling(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmReschedule}>
                Save New Time
              </Button>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Consultation"
          description="Are you sure you want to cancel your design consultation?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs text-text-2">
            <p>
              We understand schedules change. If you cancel, all reminder messages will be paused immediately.
            </p>

            <div className="space-y-1.5 text-left">
              <label className="font-semibold text-text uppercase tracking-wider block text-[11px]">
                Reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs text-text outline-none"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Project postponed">Project postponed</option>
                <option value="Found another builder">Found another builder</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsCancelModalOpen(false)}>
                Keep Consultation
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      </main>

      <FunnelFooter />
    </div>
  );
};
