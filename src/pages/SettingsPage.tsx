import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import {
  User,
  Shield,
  Bell,
  Sliders,
  RotateCcw,
  Check,
  AlertTriangle,
  Lock,
  Smartphone
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    demoSettings,
    setDemoSetting,
    resetDemoData,
    logout
  } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'demo'>('profile');

  // Notifications toggles
  const [notifDeposit, setNotifDeposit] = useState(true);
  const [notifDrawClose, setNotifDrawClose] = useState(true);
  const [notifWin, setNotifWin] = useState(true);

  // Security toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleToggleNotif = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    setter(!current);
    toast({
      type: 'info',
      title: 'Preferences Updated',
      message: `${label} alert setting saved.`
    });
  };

  const handleResetData = () => {
    resetDemoData();
    toast({
      type: 'success',
      title: 'Demo State Reset',
      message: 'All balances, pools, entries, and destinations restored to pristine seed state.'
    });
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
          Account & Prototype Settings
        </h1>
        <p className="text-xs text-[#7C867F] mt-1">
          Manage identity, security controls, notification preferences, and demo parameters
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDD8CD] text-xs font-medium">
        {[
          { key: 'profile', label: 'Profile & Identity', icon: User },
          { key: 'security', label: 'Security & Custody', icon: Shield },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'demo', label: 'Demo Sandbox Controls', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 pb-3 px-3 uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#2C4A3E] text-[#1B2420] font-semibold'
                  : 'text-[#7C867F] hover:text-[#1B2420]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-6 max-w-2xl">
          <h2 className="text-lg font-display font-medium text-[#1B2420]">
            Participant Profile
          </h2>

          <div className="space-y-4">
            <Input
              label="Legal Full Name"
              value={user.name}
              disabled
              helperText="Verified via UK / EU sandbox identity framework."
            />

            <Input
              label="Registered Email"
              value={user.email}
              disabled
              helperText="Authenticated with passwordless magic link / SSO."
            />

            <Input
              label="Jurisdiction / Region (A5)"
              value={user.region}
              disabled
              helperText="Eligibility status: Verified participant (Age 18+ confirmed)."
            />

            <Input
              label="Dedicated Sub-Wallet Address"
              value={user.depositAddress}
              disabled
              helperText="Deterministic CREATE2 address on Base L2."
            />
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-6 max-w-2xl">
          <h2 className="text-lg font-display font-medium text-[#1B2420]">
            Security & Access Isolation
          </h2>

          <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#2C4A3E]" />
                <span className="text-xs font-semibold text-[#1B2420]">
                  Two-Factor Authentication (2FA)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  toast({
                    type: 'success',
                    title: '2FA Updated',
                    message: twoFactorEnabled ? '2FA disabled (mock)' : '2FA enabled via authenticator.'
                  });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  twoFactorEnabled ? 'bg-[#2C4A3E]' : 'bg-[#DDD8CD]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-[#4A5650]">
              Mandatory OTP code required when adding or modifying withdrawal destinations.
            </p>
          </div>

          <div className="p-4 bg-[#EDE9E1] rounded-md space-y-2 text-xs text-[#4A5650]">
            <div className="flex items-center gap-2 text-[#1B2420] font-semibold">
              <Lock className="w-4 h-4 text-[#B08A4E]" />
              <span>Withdrawal Cooling-Off Period: 24 Hours</span>
            </div>
            <p className="leading-relaxed">
              In accordance with institutional custody best practices, newly configured payout addresses cannot receive funds until 24 hours have elapsed.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F] block">
              Active Authorized Sessions
            </span>
            <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1B2420] block">
                  Chrome on macOS (Current Session)
                </span>
                <span className="text-[#7C867F]">London, UK · IP 82.165.xx.xx</span>
              </div>
              <span className="text-xs font-mono text-[#3E7D5A] font-medium">Active</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-6 max-w-2xl">
          <h2 className="text-lg font-display font-medium text-[#1B2420]">
            Notification Preferences
          </h2>

          <div className="space-y-4 divide-y divide-[#DDD8CD]/50">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Deposit Swept & Credited
                </span>
                <span className="text-xs text-[#7C867F]">
                  Receive alerts when incoming Base L2 tokens are swept into your dollar balance.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifDeposit}
                onChange={() => handleToggleNotif(setNotifDeposit, notifDeposit, 'Deposit')}
                className="w-4 h-4 text-[#2C4A3E] focus:ring-[#2C4A3E] rounded"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Pool Countdown Closing
                </span>
                <span className="text-xs text-[#7C867F]">
                  Reminder 1 hour before a registered pool countdown closes for draw.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifDrawClose}
                onChange={() => handleToggleNotif(setNotifDrawClose, notifDrawClose, 'Closing')}
                className="w-4 h-4 text-[#2C4A3E] focus:ring-[#2C4A3E] rounded"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Draw Outcome & Prize Dispatched
                </span>
                <span className="text-xs text-[#7C867F]">
                  Instant notification when a VRF draw finishes and prizes are routed.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifWin}
                onChange={() => handleToggleNotif(setNotifWin, notifWin, 'Prize')}
                className="w-4 h-4 text-[#2C4A3E] focus:ring-[#2C4A3E] rounded"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demo' && (
        <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
            <h2 className="text-lg font-display font-medium text-[#1B2420]">
              Demo Simulator & Harness Controls
            </h2>
            <span className="text-xs font-mono bg-[#EDE9E1] px-2 py-0.5 rounded text-[#7C867F]">
              Review Settings
            </span>
          </div>

          <p className="text-xs text-[#4A5650] leading-relaxed">
            Use these controls to demonstrate edge cases, toggle mock latency, or reset all persistent local state back to the seed PRD baseline.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Draw Outcome Scripting
                </span>
                <span className="text-xs text-[#7C867F]">
                  When ON, user entry is guaranteed to win the next manual draw.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDemoSetting('userWinsNextDraw', !demoSettings.userWinsNextDraw)}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                  demoSettings.userWinsNextDraw
                    ? 'bg-[#2C4A3E] text-white'
                    : 'bg-[#EDE9E1] text-[#7C867F]'
                }`}
              >
                {demoSettings.userWinsNextDraw ? 'You Win (Default)' : 'Random Participant'}
              </button>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Simulate VRF Delay
                </span>
                <span className="text-xs text-[#7C867F]">
                  Simulates a 4-second oracle latency warning during draw execution.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDemoSetting('simulateVrfDelay', !demoSettings.simulateVrfDelay)}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                  demoSettings.simulateVrfDelay
                    ? 'bg-[#B08A4E] text-white'
                    : 'bg-[#EDE9E1] text-[#7C867F]'
                }`}
              >
                {demoSettings.simulateVrfDelay ? 'Delay Active (ON)' : 'Normal Fast (OFF)'}
              </button>
            </div>

            <div className="pt-4 border-t border-[#DDD8CD] flex flex-wrap items-center gap-4">
              <Button
                variant="danger"
                onClick={handleResetData}
                className="flex items-center gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State to Seed</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  logout();
                  toast({
                    type: 'info',
                    title: 'Session Expired',
                    message: 'Simulated session timeout. Redirecting to sign in.'
                  });
                }}
                className="text-xs"
              >
                Simulate Session Expired
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
