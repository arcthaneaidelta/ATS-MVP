import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { teamMembers } from '../../data/team';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  Settings,
  Users,
  ShieldCheck,
  Moon,
  Clock,
  CheckCircle2,
  Building,
  Save,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { complianceGuardActive, setComplianceGuardActive, addToast } = useDemoStore();

  const [roundRobinWeights, setRoundRobinWeights] = useState({
    dana: 50,
    marcus: 50,
  });

  const [quietHoursStart, setQuietHoursStart] = useState('21:00'); // 9:00 PM
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00'); // 8:00 AM
  const [showTestModal, setShowTestModal] = useState(false);

  const handleSaveSettings = () => {
    addToast('Settings Saved', 'Updated round-robin weights and compliance rules.', 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Settings & Team Routing Rules
            </h1>
            <Badge variant="clay">System Controls</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Configure round-robin lead allocation, telephony quiet hours, and A2P 10DLC compliance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveSettings}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save Configuration
        </Button>
      </div>

      {/* 1. Round-Robin Lead Distribution (§10.12) */}
      <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
          <div>
            <h3 className="font-serif text-lg text-[#1F2A27] font-medium">
              Online Sales Counselor Round-Robin Routing
            </h3>
            <p className="text-xs text-[#79827D]">
              Evenly distributes new incoming inquiries between your online sales team.
            </p>
          </div>
          <Badge variant="pine">Automated Split</Badge>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white rounded-[12px] border border-[#DDD6C8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E0E8E3] text-[#2F4A3F] flex items-center justify-center font-bold text-xs">
                DW
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#1F2A27]">Dana Whitfield (Lead OSC)</h4>
                <p className="text-[10px] text-[#79827D]">Active in queue • (704) 555-0142</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2F4A3F]">50% Allocation</span>
              <input
                type="range"
                min="0"
                max="100"
                value={roundRobinWeights.dana}
                onChange={(e) =>
                  setRoundRobinWeights({
                    dana: parseInt(e.target.value, 10),
                    marcus: 100 - parseInt(e.target.value, 10),
                  })
                }
                className="w-28 accent-[#2F4A3F]"
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-[12px] border border-[#DDD6C8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E1EAF0] text-[#36566E] flex items-center justify-center font-bold text-xs">
                MO
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#1F2A27]">Marcus Oyelaran (OSC)</h4>
                <p className="text-[10px] text-[#79827D]">Active in queue • (704) 555-0188</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#36566E]">50% Allocation</span>
              <input
                type="range"
                min="0"
                max="100"
                value={roundRobinWeights.marcus}
                onChange={(e) =>
                  setRoundRobinWeights({
                    marcus: parseInt(e.target.value, 10),
                    dana: 100 - parseInt(e.target.value, 10),
                  })
                }
                className="w-28 accent-[#4B6A82]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Community Assignment Rules */}
      <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4 shadow-2xs">
        <h3 className="font-serif text-lg text-[#1F2A27] font-medium">
          Community Sales Manager Assignment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-[12px] border border-[#DDD6C8] space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-[#1F2A27]">Harlow Creek (Fort Mill, SC)</h4>
              <Badge variant="neutral">Assigned</Badge>
            </div>
            <p className="text-[11px] text-[#79827D]">
              All booked tours automatically assign calendar invites and push tasks to:
            </p>
            <div className="font-semibold text-[#2F4A3F]">Priya Raman (priya@alderstonehomes.com)</div>
          </div>

          <div className="p-4 bg-white rounded-[12px] border border-[#DDD6C8] space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-[#1F2A27]">Marrow Ridge & Custom Division</h4>
              <Badge variant="neutral">Assigned</Badge>
            </div>
            <p className="text-[11px] text-[#79827D]">
              Lake Norman estate homes and on-your-lot discovery calls assign to:
            </p>
            <div className="font-semibold text-[#2F4A3F]">Tom Becker & Robert Alder</div>
          </div>
        </div>
      </div>

      {/* 3. Compliance Guard Controls (WOW #5) */}
      <div className="bg-[#1F2A27] text-white p-6 sm:p-8 rounded-[16px] border border-[#3E4E49] space-y-5">
        <div className="flex items-center justify-between border-b border-[#34423E] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#B4684A] tracking-wider">
                WOW Feature #5
              </span>
              <span className="text-[#A7B3AE]">•</span>
              <span className="text-xs text-[#C5D5CC]">TCPA Telephony Safeguard</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-medium mt-1">
              Automated Quiet-Hours Send Interceptor
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setComplianceGuardActive(!complianceGuardActive);
                addToast(
                  'Compliance Guard Toggled',
                  complianceGuardActive ? 'Guard disabled.' : 'Guard active.',
                  'info'
                );
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                complianceGuardActive ? 'bg-[#4C7A57] text-white' : 'bg-[#A5473B] text-white'
              }`}
            >
              {complianceGuardActive ? 'Guard Active' : 'Guard Disabled'}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#A7B3AE] leading-relaxed max-w-2xl">
          Automated marketing texts sent outside 8:00 AM – 9:00 PM local time are held safely in a
          pre-send buffer until 8:00 AM next morning, protecting Alder & Stone from statutory penalties.
        </p>

        <div className="bg-[#263330] p-4 rounded-[12px] border border-[#3E4E49] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#C5D5CC] block mb-1">
              Protected Evening Window:
            </span>
            <span className="font-mono text-sm font-semibold text-white">
              {quietHoursStart} (09:00 PM) to {quietHoursEnd} (08:00 AM) Eastern
            </span>
          </div>

          <Button
            variant="clay"
            size="sm"
            onClick={() => setShowTestModal(true)}
            leftIcon={<Clock className="w-3.5 h-3.5" />}
          >
            Test Sending Message at 10:30 PM
          </Button>
        </div>
      </div>

      {/* Test Modal for WOW #5 */}
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        title="TCPA Quiet-Hours Send Intercepted"
        subtitle="Automatic 10:30 PM hold simulation"
      >
        <div className="space-y-4 text-xs text-[#1F2A27]">
          <div className="p-3.5 rounded-[10px] bg-[#F3DEDA] border border-[#E4B8B0] flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#B4684A] shrink-0" />
            <span className="font-semibold text-[#A5473B]">
              Message held until 08:00 AM Eastern tomorrow morning.
            </span>
          </div>

          <p className="text-[#4A5550] leading-relaxed">
            The system intercepted your 10:30 PM text message attempt. Because automated texts sent
            after 9:00 PM violate TCPA regulations, the message has been queued in the carrier-safe
            buffer and will deliver at exactly 8:00 AM tomorrow.
          </p>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowTestModal(false)}>
              Verified (Close Simulation)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
