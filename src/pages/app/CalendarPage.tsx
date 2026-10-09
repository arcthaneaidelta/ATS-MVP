import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Plus,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [selectedSlot, setSelectedSlot] = useState<string | null>('Sat Oct 10 • 11:00 AM');
  const [showNoShowModal, setShowNoShowModal] = useState(false);

  const appointments = [
    {
      id: 'apt-1',
      buyer: 'Marcus & Elena Reyes',
      community: 'Harlow Creek (Fort Mill, SC)',
      type: 'Model Home Tour (The Calder Lot 14)',
      time: 'Saturday 11:00 AM',
      agent: 'Priya Raman',
      status: 'Confirmed (24h SMS Sent)',
    },
    {
      id: 'apt-2',
      buyer: 'Kevin Patel',
      community: 'Custom Division',
      type: 'Design Studio Consultation',
      time: 'Thursday 02:00 PM',
      agent: 'Tom Becker / Robert Alder',
      status: 'Confirmed',
    },
    {
      id: 'apt-3',
      buyer: 'Jasmine Thornton',
      community: 'Marrow Ridge',
      type: 'Virtual Video Walkthrough',
      time: 'Friday 10:30 AM',
      agent: 'Marcus Oyelaran',
      status: 'Scheduled',
    },
    {
      id: 'apt-4',
      buyer: 'Walter & Ruth Kessler',
      community: 'Harlow Creek',
      type: 'Linden Ranch Follow-Up & Lot 22 Walk',
      time: 'Saturday 02:30 PM',
      agent: 'Priya Raman',
      status: 'Confirmed',
    },
  ];

  const handleSimulateNoShow = () => {
    setShowNoShowModal(true);
    addToast(
      'No-Show Rescue Sequence Triggered',
      'Automated text sent to buyer: "Everything okay? Let us reschedule for you."',
      'warning'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Tours & Appointments Calendar
            </h1>
            <Badge variant="clay">4 Upcoming Tours</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Model home visits, virtual tours, and design studio appointments synchronized with agents' calendars.
          </p>
        </div>

        {/* Simulate No-Show Rescue Action (§10.9) */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSimulateNoShow}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#B4684A]" />}
        >
          Simulate Tour No-Show (Rescue Sequence)
        </Button>
      </div>

      {/* 2-Column: Week Agenda on Left, Buyer Booking Widget on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Scheduled Appointments */}
        <div className="lg:col-span-7 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DD]">
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#2F4A3F]" /> Upcoming Tours This Week
            </h3>
            <span className="text-xs text-[#79827D]">Synced with Google & Outlook</span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2.5 shadow-2xs hover:border-[#C5BCA9] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-[#1F2A27] leading-tight">
                      {apt.buyer}
                    </h4>
                    <p className="text-[11px] text-[#2F4A3F] font-medium mt-0.5">{apt.type}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#E0E8E3] text-[#2F4A3F] px-2 py-0.5 rounded">
                    {apt.time}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-[#79827D] pt-2 border-t border-[#F6F3EC]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B4684A]" /> {apt.community}
                  </span>
                  <span>Agent: {apt.agent}</span>
                  <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): What Buyer Sees (Booking Widget + Reminders Preview) */}
        <div className="lg:col-span-5 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#C5BCA9] space-y-4">
          <div className="border-b border-[#EDE8DD] pb-3">
            <span className="text-[10px] uppercase font-bold text-[#B4684A] tracking-wider block mb-0.5">
              Buyer Experience Widget
            </span>
            <h3 className="font-serif text-lg text-[#1F2A27] font-medium">
              Self-Serve Tour Scheduler
            </h3>
            <p className="text-xs text-[#79827D]">
              Embedded on community landing pages to eliminate scheduling friction.
            </p>
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#1F2A27]">
              Available Slots this Weekend:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Sat 10:00 AM',
                'Sat 11:00 AM',
                'Sat 02:00 PM',
                'Sun 01:30 PM',
              ].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-[8px] border text-center font-semibold transition-all ${
                    selectedSlot?.includes(slot)
                      ? 'bg-[#2F4A3F] text-white border-[#243A31]'
                      : 'bg-white text-[#1F2A27] border-[#DDD6C8] hover:border-[#2F4A3F]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Stage Reminder Chain Preview (§10.9) */}
          <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B4684A]" /> Automated Reminders Dispatched:
            </h4>

            <div className="space-y-2 text-xs text-[#4A5550]">
              <div className="p-2 rounded bg-[#F6F3EC] border border-[#DDD6C8]">
                <strong className="text-[#1F2A27] block text-[11px]">24 Hours Prior (SMS):</strong>
                "Looking forward to your tour tomorrow! Priya has the model home open. Reply YES to confirm."
              </div>

              <div className="p-2 rounded bg-[#F6F3EC] border border-[#DDD6C8]">
                <strong className="text-[#1F2A27] block text-[11px]">2 Hours Prior (SMS + GPS):</strong>
                "See you in 2 hours! Free parking right in front of the model at 1042 Harlow Creek Way. Gate code #1042."
              </div>

              <div className="p-2 rounded bg-[#F6F3EC] border border-[#DDD6C8]">
                <strong className="text-[#1F2A27] block text-[11px]">15 Minutes Prior (Push):</strong>
                Agent notified: "Marcus Reyes arriving in 15 minutes."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No-Show Rescue Modal */}
      <Modal
        isOpen={showNoShowModal}
        onClose={() => setShowNoShowModal(false)}
        title="Tour Marked as No-Show"
        subtitle="Automatic 3-Minute Rescue Sequence Initiated"
      >
        <div className="space-y-4 text-xs text-[#1F2A27]">
          <div className="p-3.5 bg-[#F3DEDA] rounded-[10px] border border-[#E4B8B0] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#A5473B] shrink-0" />
            <span className="font-semibold text-[#A5473B]">
              Buyer missed appointment slot without prior cancellation.
            </span>
          </div>

          <p className="text-[#4A5550] leading-relaxed">
            Instead of giving up on the lead, Groundwork immediately dispatches an empathetic,
            low-pressure rescue SMS from the local sales counselor:
          </p>

          <div className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] font-mono text-[11px] text-[#1F2A27]">
            "Hi Marcus — everything okay? We had the model home open for you. Life happens! Tap here whenever you’d like to pick another weekend time: aldr.st/tour-reschedule"
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowNoShowModal(false)}>
              Close Simulation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
