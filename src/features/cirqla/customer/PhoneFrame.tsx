import React from 'react';
import { ArrowUpRight, RotateCcw, Smartphone, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PhoneFrameProps {
  children: React.ReactNode;
  venueName: string;
  table: string;
  accent: string;
  onRestartDemo: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  venueName,
  table,
  accent,
  onRestartDemo,
}) => {
  const openVenueInNewTab = () => {
    window.open('/cirqla/venue/orders', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#EDE8DF] py-6 sm:py-12 px-4 flex items-center justify-center select-none font-sans">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left Side: Demo Guide Card (Desktop Only) */}
        <div className="hidden lg:block w-72 p-6 rounded-2xl bg-elevated border border-line shadow-md text-left space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
            <h3 className="text-xs uppercase tracking-wider font-bold text-ink">
              Diner Demo Guide
            </h3>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            You are browsing <strong>{venueName}</strong> as a guest at <strong>Table {table}</strong>.
          </p>

          <ol className="space-y-3 text-xs text-ink-2">
            <li className="flex gap-2">
              <span className="font-mono font-bold text-ink">1.</span>
              <span>Select an item (e.g. <em>Short Rib</em>) and pick required sides in the sheet.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-bold text-ink">2.</span>
              <span>Checkout using hinted test card <code>4242...</code> or Apple/Google Wallet.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-bold text-ink">3.</span>
              <span>Watch order arrive in real time on the kitchen board in the second tab!</span>
            </li>
          </ol>

          <div className="pt-2 border-t border-line flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={openVenueInNewTab}
              block
              style={{ backgroundColor: accent }}
            >
              <span>Open Venue Board in 2nd Tab</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>

            <button
              type="button"
              onClick={onRestartDemo}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-ink-3 hover:text-ink font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restart Diner Session</span>
            </button>
          </div>
        </div>

        {/* Center: 390 x 844 Phone Frame */}
        <div className="w-full max-w-[390px] h-[844px] bg-bg rounded-[40px] border-[10px] border-ink shadow-2xl relative overflow-hidden flex flex-col">
          {/* Phone Top Notch / Dynamic Island */}
          <div className="h-6 w-full bg-ink flex items-center justify-center z-50 shrink-0">
            <div className="w-24 h-4 bg-ink rounded-b-xl flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-ink-2/60 mr-2" />
              <div className="w-2 h-2 rounded-full bg-ink-2/40" />
            </div>
          </div>

          {/* Phone Screen Container */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Phone Bottom Home Bar */}
          <div className="h-4 w-full bg-bg flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-ink/20 rounded-full" />
          </div>
        </div>

        {/* Right Side: Second Tab Hint (Desktop Only) */}
        <div className="hidden lg:block w-72 p-6 rounded-2xl bg-surface border border-line text-left space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Smartphone className="w-4 h-4" />
            <span>Cross-Surface Sync</span>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            The customer PWA and kitchen display board synchronize via browser <strong>BroadcastChannel</strong>.
          </p>

          <div className="p-3 rounded-lg bg-bg border border-line text-[11px] text-ink-3 space-y-1">
            <div className="flex justify-between">
              <span>Sync latency:</span>
              <strong className="text-ok font-mono">&lt; 300 ms</strong>
            </div>
            <div className="flex justify-between">
              <span>Card decline:</span>
              <strong className="text-clay font-mono">4000...0002</strong>
            </div>
            <div className="flex justify-between">
              <span>Table session:</span>
              <strong className="text-ink font-mono">Table {table}</strong>
            </div>
          </div>

          <div className="text-[11px] text-ink-3">
            Tip: You can change the kitchen status on the venue board and immediately watch the diner phone tracker change!
          </div>
        </div>
      </div>
    </div>
  );
};
