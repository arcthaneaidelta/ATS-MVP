import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store';
import { FunnelNav } from '../../components/funnel/FunnelNav';
import { FunnelFooter } from '../../components/funnel/FunnelFooter';
import { Button } from '../../components/ui/Button';
import { AppointmentFormat } from '../../data/types';
import { 
  Calendar as CalendarIcon, Clock, Video, Home, 
  Check, AlertTriangle, ArrowRight, Sparkles 
} from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay, isWeekend } from 'date-fns';

export const Book: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get('contactId') || 'contact-maya';
  const leadName = searchParams.get('name') || 'Maya Okafor';

  const { bookSlot, availability } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    let d = addDays(new Date(), 1);
    while (isWeekend(d)) d = addDays(d, 1);
    return d;
  });

  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [formatType, setFormatType] = useState<AppointmentFormat>('in_home');
  const [loading, setLoading] = useState(false);
  const [takenSlotAlert, setTakenSlotAlert] = useState(false);

  // Generate 14 selectable calendar days
  const calendarDays = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i + 1));

  const standardSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM', // Slot that triggers the collision demo per PRD
    '03:45 PM',
  ];

  const handleSlotClick = (slot: string) => {
    if (slot === '02:30 PM') {
      // Taken slot simulation per PRD
      setTakenSlotAlert(true);
      return;
    }
    setTakenSlotAlert(false);
    setSelectedSlot(slot);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    // Calculate ISO start and end
    const [time, period] = selectedSlot.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const start = new Date(selectedDate);
    start.setHours(hours, mins, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 45);

    const apt = bookSlot({
      contactId,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      format: formatType,
    });

    setLoading(false);
    navigate(`/thanks?id=${apt.id}&name=${encodeURIComponent(leadName)}`);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text flex flex-col justify-between">
      <FunnelNav />

      <main className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
          <span className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Step 2 of 2</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text">
            Choose your 45-minute consultation.
          </h1>
          <p className="text-xs sm:text-sm text-text-2">
            Meet with Principal Designer Dana Whitfield. Free, confidential, and focused on your goals.
          </p>
        </div>

        {/* Two-Column Booking Container */}
        <div className="bg-surface-elevated rounded-modal border border-border shadow-sh-2 overflow-hidden grid grid-cols-1 md:grid-cols-12 max-w-4xl mx-auto">
          {/* Left Column: Date Selector */}
          <div className="md:col-span-6 p-6 sm:p-7 border-b md:border-b-0 md:border-r border-border bg-surface/50 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Select a Date
              </h3>
              <span className="text-[11px] text-text-muted">Portland Time (PST)</span>
            </div>

            {/* Day buttons grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="text-[10px] font-bold text-text-muted py-1">
                  {day}
                </div>
              ))}

              {calendarDays.slice(0, 14).map((d) => {
                const weekend = isWeekend(d);
                const isSelected = isSameDay(d, selectedDate);
                const dayNumber = format(d, 'd');
                const dayName = format(d, 'EEE');

                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={weekend}
                    onClick={() => {
                      setSelectedDate(d);
                      setTakenSlotAlert(false);
                    }}
                    className={`py-2 px-1 rounded-input text-xs font-medium transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-primary text-[#FBFAF7] font-semibold shadow-sm'
                        : weekend
                        ? 'opacity-30 cursor-not-allowed border-dashed'
                        : 'bg-sunken hover:bg-border/60 text-text'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-75">{dayName.slice(0, 1)}</span>
                    <span className="text-xs font-semibold">{dayNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Format toggle */}
            <div className="pt-4 border-t border-border space-y-2">
              <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block">
                Consultation Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormatType('in_home')}
                  className={`p-3 rounded-input text-xs font-medium border text-left flex items-start gap-2.5 transition-all ${
                    formatType === 'in_home'
                      ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                      : 'bg-sunken border-border text-text-2'
                  }`}
                >
                  <Home className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div>In-Home Visit</div>
                    <div className="text-[10px] opacity-75 font-normal">We come to your space</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatType('video')}
                  className={`p-3 rounded-input text-xs font-medium border text-left flex items-start gap-2.5 transition-all ${
                    formatType === 'video'
                      ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                      : 'bg-sunken border-border text-text-2'
                  }`}
                >
                  <Video className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div>Video Call</div>
                    <div className="text-[10px] opacity-75 font-normal">Screen share & photos</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Time Slots & Summary */}
          <div className="md:col-span-6 p-6 sm:p-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Times
                </h3>
                <span className="text-xs font-semibold text-primary">
                  {format(selectedDate, 'EEEE, MMM d')}
                </span>
              </div>

              {/* Slot collision simulation alert */}
              {takenSlotAlert && (
                <div className="p-3 bg-warning/15 border border-warning/30 rounded-input text-xs text-[#8F661B] space-y-2 animate-in fade-in-50 duration-fast">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>2:30 PM was just taken by another visitor</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Here are the closest two slots for {format(selectedDate, 'MMM d')}:
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSlotClick('01:00 PM')}
                      className="px-2.5 py-1 rounded bg-surface border border-warning/40 text-xs font-semibold hover:bg-warning/20"
                    >
                      01:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('03:45 PM')}
                      className="px-2.5 py-1 rounded bg-surface border border-warning/40 text-xs font-semibold hover:bg-warning/20"
                    >
                      03:45 PM
                    </button>
                  </div>
                </div>
              )}

              {/* Slots Grid (44px height buttons) */}
              <div className="grid grid-cols-2 gap-2">
                {standardSlots.map((slot) => {
                  const isSelected = selectedSlot === slot && !takenSlotAlert;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      className={`h-[44px] rounded-input text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-[#FBFAF7] font-semibold border-primary shadow-sm'
                          : slot === '02:30 PM'
                          ? 'bg-sunken border-dashed border-border-strong text-text-2 hover:border-warning'
                          : 'bg-sunken border-border hover:border-primary text-text'
                      }`}
                    >
                      <span>{slot}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Box & CTA */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="p-3 bg-sunken rounded-input border border-border text-xs text-text-2 space-y-1">
                <div className="font-semibold text-text">Consultation with Dana Whitfield</div>
                <div className="text-[11px] text-text-muted">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedSlot} ({formatType === 'in_home' ? 'In-Home Walk-through' : 'Video Conference'})
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-semibold shadow-sh-2"
                onClick={handleConfirm}
                loading={loading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Confirm Design Consultation
              </Button>
            </div>
          </div>
        </div>
      </main>

      <FunnelFooter />
    </div>
  );
};
