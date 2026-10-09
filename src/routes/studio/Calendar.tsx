import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Appointment, AppointmentStatus } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  Calendar as CalendarIcon, Clock, Settings, User, 
  MapPin, Video, CheckCircle2, AlertTriangle, 
  RotateCcw, X, Plus, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';

export const Calendar: React.FC = () => {
  const { appointments, availability, updateAvailability, cancelAppointment, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'calendar' | 'availability' | 'templates'>('calendar');
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);

  // Availability local state
  const [localDays, setLocalDays] = useState(availability.days);
  const [bufferMin, setBufferMin] = useState(availability.bufferMin);
  const [minNoticeHours, setMinNoticeHours] = useState(availability.minNoticeHours);
  const [dailyCap, setDailyCap] = useState(availability.dailyCap);

  const selectedApt = appointments.find(a => a.id === selectedAptId);

  // Generate week days starting from current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    updateAvailability({
      days: localDays,
      bufferMin,
      minNoticeHours,
      dailyCap,
    });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-primary text-surface border-primary';
      case 'pending': return 'bg-info text-white border-info';
      case 'no_show': return 'bg-error text-white border-error';
      case 'completed': return 'bg-text-muted/20 text-text-2 border-border';
      case 'cancelled': return 'bg-sunken text-text-muted border-border line-through';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Calendar & Availability</h1>
          <p className="text-xs text-text-muted mt-1">
            Weekly design consultation grid, buffer rules, and real-time synchronization with the public booking page.
          </p>
        </div>

        <div className="inline-flex rounded-input border border-border bg-surface p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'availability' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Availability Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'templates' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Reminder Templates</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="bg-surface-elevated rounded-modal border border-border shadow-sh-2 overflow-hidden">
          {/* Calendar Subheader */}
          <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-text">
                Week of {format(weekStart, 'MMMM d, yyyy')}
              </span>
              <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-chip">
                {appointments.filter(a => a.status === 'confirmed').length} Confirmed
              </span>
            </div>

            {/* Status Legend */}
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Confirmed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-info" /> Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error" /> No-Show
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted" /> Completed
              </span>
            </div>
          </div>

          {/* Time Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Day header row */}
              <div className="grid grid-cols-8 border-b border-border bg-sunken text-xs font-semibold text-text text-center">
                <div className="py-2.5 px-2 border-r border-border text-text-muted">Time</div>
                {weekDays.map(day => (
                  <div key={day.toISOString()} className="py-2.5 px-2 border-r border-border last:border-r-0">
                    <div className="text-[10px] uppercase text-text-muted">{format(day, 'EEE')}</div>
                    <div className="font-bold text-text">{format(day, 'MMM d')}</div>
                  </div>
                ))}
              </div>

              {/* Hourly rows */}
              <div className="divide-y divide-border">
                {hours.map(hour => {
                  const hourLabel = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                  return (
                    <div key={hour} className="grid grid-cols-8 min-h-[58px]">
                      {/* Hour label */}
                      <div className="p-2 border-r border-border text-[11px] text-text-muted text-center font-mono">
                        {hourLabel}
                      </div>

                      {/* Day cells */}
                      {weekDays.map(day => {
                        const cellApts = appointments.filter(a => {
                          const aDate = new Date(a.start);
                          return isSameDay(aDate, day) && aDate.getHours() === hour;
                        });

                        return (
                          <div
                            key={day.toISOString()}
                            className="p-1 border-r border-border last:border-r-0 hover:bg-sunken/30 transition-colors relative"
                          >
                            {cellApts.map(apt => (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAptId(apt.id)}
                                className={`p-1.5 rounded text-[11px] font-semibold border cursor-pointer shadow-xs truncate hover:opacity-90 ${getStatusColor(apt.status)}`}
                                title={`${apt.title} (${apt.format})`}
                              >
                                <div className="truncate">{apt.title.replace('Design Consultation · ', '')}</div>
                                <div className="text-[9px] opacity-80">{format(new Date(apt.start), 'h:mm a')}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABILITY SETTINGS */}
      {activeTab === 'availability' && (
        <form onSubmit={handleSaveAvailability} className="max-w-2xl bg-surface-elevated p-6 rounded-modal border border-border shadow-sh-2 space-y-6">
          <div>
            <h3 className="text-base font-bold text-text">Weekly Working Hours</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Available times automatically reflect on the public booking funnel (/book).
            </p>
          </div>

          <div className="space-y-3">
            {localDays.map((d, idx) => (
              <div key={d.day} className="flex items-center justify-between p-3 rounded-card bg-sunken border border-border text-xs">
                <label className="flex items-center gap-3 font-semibold text-text w-32 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={d.enabled}
                    onChange={(e) => {
                      const updated = [...localDays];
                      updated[idx].enabled = e.target.checked;
                      setLocalDays(updated);
                    }}
                    className="rounded"
                  />
                  <span>{d.day}</span>
                </label>

                {d.enabled ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d.start}
                      onChange={(e) => {
                        const updated = [...localDays];
                        updated[idx].start = e.target.value;
                        setLocalDays(updated);
                      }}
                      className="px-2 py-1 rounded bg-surface border border-border text-xs w-20 text-center"
                    />
                    <span className="text-text-muted">to</span>
                    <input
                      type="text"
                      value={d.end}
                      onChange={(e) => {
                        const updated = [...localDays];
                        updated[idx].end = e.target.value;
                        setLocalDays(updated);
                      }}
                      className="px-2 py-1 rounded bg-surface border border-border text-xs w-20 text-center"
                    />
                  </div>
                ) : (
                  <span className="text-text-muted text-xs italic">Unavailable</span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text block">Buffer Between Slots</label>
              <select
                value={bufferMin}
                onChange={(e) => setBufferMin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text block">Minimum Notice</label>
              <select
                value={minNoticeHours}
                onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
              >
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={24}>24 hours</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text block">Daily Consultation Cap</label>
              <select
                value={dailyCap}
                onChange={(e) => setDailyCap(Number(e.target.value))}
                className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
              >
                <option value={4}>4 per day</option>
                <option value={6}>6 per day</option>
                <option value={8}>8 per day</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" variant="primary" size="md">
              Save & Sync with Funnel
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: REMINDER TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-3 shadow-sh-1">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-xs uppercase text-primary">Instant SMS</span>
              <span className="text-[10px] text-text-muted">Trigger: Booking</span>
            </div>
            <p className="text-xs text-text-2 bg-sunken p-3 rounded-input border border-border leading-relaxed font-mono text-[11px]">
              "Confirmed! Your design consultation with Dana Whitfield is set for {`{{appointment.time}}`}. Reschedule: {`{{appointment.link}}`}"
            </p>
          </div>

          <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-3 shadow-sh-1">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-xs uppercase text-primary">24h Reminder SMS</span>
              <span className="text-[10px] text-text-muted">Trigger: T-24 Hours</span>
            </div>
            <p className="text-xs text-text-2 bg-sunken p-3 rounded-input border border-border leading-relaxed font-mono text-[11px]">
              "Hi {`{{contact.first_name}}`}, confirming your Alder & Finch consultation tomorrow at {`{{appointment.time}}`}. Reply YES to confirm or use {`{{appointment.reschedule_link}}`} if needed."
            </p>
          </div>

          <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-3 shadow-sh-1">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-xs uppercase text-primary">2h Reminder SMS</span>
              <span className="text-[10px] text-text-muted">Trigger: T-2 Hours</span>
            </div>
            <p className="text-xs text-text-2 bg-sunken p-3 rounded-input border border-border leading-relaxed font-mono text-[11px]">
              "See you in 2 hours, {`{{contact.first_name}}`}! Video link: {`{{appointment.join_url}}`} (or Dana will arrive at your address for in-home consultations)."
            </p>
          </div>
        </div>
      )}

      {/* Appointment Popover / Modal */}
      <Modal
        isOpen={Boolean(selectedApt)}
        onClose={() => setSelectedAptId(null)}
        title="Consultation Details"
        maxWidth="sm"
      >
        {selectedApt && (
          <div className="space-y-4 text-xs text-text-2">
            <div className="bg-sunken p-3.5 rounded-card border border-border space-y-2">
              <div className="font-bold text-sm text-text">{selectedApt.title}</div>
              <div className="flex items-center gap-2 text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{format(new Date(selectedApt.start), 'EEEE, MMMM d, yyyy h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                {selectedApt.format === 'in_home' ? <MapPin className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                <span className="capitalize">{selectedApt.format.replace('_', ' ')} Consultation</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancelAppointment(selectedApt.id, 'Operator marked no-show');
                  setSelectedAptId(null);
                }}
                className="text-error border-error/20 hover:bg-error/10"
              >
                Mark as No-Show & Trigger Recovery
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
