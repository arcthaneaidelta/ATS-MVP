import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  ShieldCheck,
  Moon,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const [testTime, setTestTime] = useState('22:30'); // 10:30 PM
  const [showQuietHoursModal, setShowQuietHoursModal] = useState(false);

  // Fair Housing scanner
  const [scanText, setScanText] = useState('Perfect neighborhood for young families looking for quiet community');
  const [scanResult, setScanResult] = useState<{
    flagged: string[];
    safeAlternative: string;
  } | null>({
    flagged: ['young families'],
    safeAlternative: 'Spacious 4-bedroom multi-gen floor plan with community walking trails and playgrounds',
  });

  const handleScanText = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = scanText.toLowerCase();
    const flaggedWords: string[] = [];

    if (lower.includes('young families') || lower.includes('family')) {
      flaggedWords.push('familial status reference ("families")');
    }
    if (lower.includes('exclusive') || lower.includes('private club')) {
      flaggedWords.push('exclusionary terminology ("exclusive")');
    }
    if (lower.includes('church') || lower.includes('synagogue')) {
      flaggedWords.push('religious proximity reference');
    }

    if (flaggedWords.length > 0) {
      setScanResult({
        flagged: flaggedWords,
        safeAlternative: 'Focus on physical home attributes: "Spacious 4-bedroom layout with flexible bonus room and wooded homesite."',
      });
    } else {
      setScanResult(null);
    }
  };

  const handleTestSend = () => {
    setShowQuietHoursModal(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#F6F3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
            US Telephony & Housing Laws
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A27] font-normal mt-2">
            Built-In US Regulatory Guardrails
          </h1>
          <p className="text-base text-[#4A5550] mt-3 leading-relaxed">
            Sending automated marketing text messages in the United States requires strict adherence to
            TCPA, carrier A2P 10DLC registrations, and Fair Housing regulations. Groundwork bakes
            these protections directly into every workflow.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Pillar 1: Quiet Hours Guard (WOW #5) */}
          <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#C5BCA9] space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-[#EDE8DD] flex items-center justify-center text-[#B4684A]">
                <Moon className="w-5 h-5" />
              </div>
              <Badge variant="clay">WOW Feature #5</Badge>
            </div>

            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              TCPA Quiet-Hours Send Guard
            </h3>

            <p className="text-xs text-[#4A5550] leading-relaxed">
              Federal TCPA and Florida/South Carolina mini-TCPA laws prohibit automated marketing texts
              before 8:00 AM and after 9:00 PM local time (8:00 PM in SC/FL). Groundwork automatically
              holds late night texts in a holding queue until 8:00 AM the following morning.
            </p>

            {/* Interactive Test Box */}
            <div className="bg-[#F6F3EC] p-4 rounded-[12px] border border-[#DDD6C8] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1F2A27]">
                <span>Simulate Automated Message Send:</span>
                <span className="font-mono text-[#B4684A]">10:30 PM (22:30 Local)</span>
              </div>
              <Button
                variant="clay"
                size="sm"
                className="w-full"
                onClick={handleTestSend}
                leftIcon={<Clock className="w-4 h-4" />}
              >
                Trigger Send Test at 10:30 PM
              </Button>
            </div>
          </div>

          {/* Pillar 2: Interactive Fair Housing Copy Scanner */}
          <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#C5BCA9] space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-[#EDE8DD] flex items-center justify-center text-[#2F4A3F]">
                <FileCheck className="w-5 h-5" />
              </div>
              <Badge variant="pine">Advertising Safeguard</Badge>
            </div>

            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              Fair Housing Copy Scanner
            </h3>

            <p className="text-xs text-[#4A5550] leading-relaxed">
              Under the Federal Fair Housing Act, ad copy describing buyer demographics (such as "great for young couples" or "exclusive neighborhood") violates HUD guidelines. Scan copy below:
            </p>

            <form onSubmit={handleScanText} className="space-y-2">
              <input
                type="text"
                value={scanText}
                onChange={(e) => setScanText(e.target.value)}
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] bg-white focus:outline-none focus:border-[#2F4A3F]"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-[#79827D]">Type any phrase to test audit</span>
                <Button type="submit" variant="secondary" size="sm">
                  Run Copy Scan
                </Button>
              </div>
            </form>

            {scanResult && (
              <div className="bg-[#F3DEDA] border border-[#E4B8B0] p-3.5 rounded-[10px] space-y-1.5 text-xs">
                <div className="font-semibold text-[#A5473B] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Potential Fair Housing Risk Flagged
                </div>
                <p className="text-[11px] text-[#1F2A27]">
                  <strong>Trigger:</strong> {scanResult.flagged.join(', ')}
                </p>
                <p className="text-[11px] text-[#4C7A57] bg-white p-2 rounded border border-[#C2DEC5]">
                  <strong>Recommended Replacement:</strong> {scanResult.safeAlternative}
                </p>
              </div>
            )}
          </div>

          {/* Pillar 3: A2P 10DLC Brand Registration */}
          <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8] space-y-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#EDE8DD] flex items-center justify-center text-[#4C7A57]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              A2P 10DLC Trust Hub Status
            </h3>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              Unregistered 10-digit phone numbers suffer up to 60% carrier message blocking by AT&T,
              Verizon, and T-Mobile. We submit and register Alder & Stone Homes’ EIN and legal DBA with The Campaign Registry (TCR).
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">Brand Entity Verification (EIN)</span>
                <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">Standard Campaign Use Case</span>
                <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">Carrier Throughput (TPS)</span>
                <span className="font-mono text-[#2F4A3F] font-bold">45 msg/sec</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Email Authentication SPF, DKIM, DMARC */}
          <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8] space-y-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#EDE8DD] flex items-center justify-center text-[#4B6A82]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              Email Deliverability & CAN-SPAM
            </h3>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              Since 2024, Google and Yahoo enforce strict DMARC alignment and one-click unsubscribe headers.
              We configure your DNS records so emails reach the primary inbox.
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">SPF Record Alignment</span>
                <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">DKIM 2048-bit Encryption Key</span>
                <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white border border-[#DDD6C8]">
                <span className="font-medium text-[#1F2A27]">DMARC Policy (p=quarantine)</span>
                <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Honest Legal Disclaimer */}
        <div className="p-4 rounded-[12px] bg-[#EDE8DD] border border-[#DDD6C8] text-center text-xs text-[#79827D]">
          Notice: While Groundwork provides automated telephony safeguards and compliance templates,
          this prototype does not constitute formal legal counsel. Alder & Stone Homes’ corporate attorney
          should conduct final review of customer-facing agreements.
        </div>
      </div>

      {/* Quiet Hours Modal Popup */}
      <Modal
        isOpen={showQuietHoursModal}
        onClose={() => setShowQuietHoursModal(false)}
        title="TCPA Quiet-Hours Send Guard Intercepted"
        subtitle="Automatic carrier hold applied"
      >
        <div className="space-y-4 text-xs text-[#1F2A27]">
          <div className="p-3.5 rounded-[10px] bg-[#F3DEDA] border border-[#E4B8B0] flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-[#B4684A] shrink-0" />
            <div>
              <h4 className="font-bold text-[#A5473B]">Message Held Until 08:00 AM Tomorrow</h4>
              <p className="text-[11px] text-[#4A5550]">
                Current simulated time: 10:30 PM (Outside 8:00 AM – 9:00 PM local window)
              </p>
            </div>
          </div>

          <p className="leading-relaxed text-[#4A5550]">
            Sending automated commercial SMS messages after 9:00 PM Eastern violates TCPA regulations
            and exposes home builders to penalties of up to $1,500 per message.
          </p>

          <p className="leading-relaxed text-[#4A5550]">
            Groundwork has placed this SMS into the scheduled dispatch buffer. It will deliver
            promptly at <strong>8:00 AM Eastern</strong> with zero risk to your business.
          </p>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowQuietHoursModal(false)}>
              Got It (Safeguard Verified)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
