import React, { useState } from 'react';
import { useDemoStore } from '../../store/demo';
import { useCirqlaStore } from '../../store/cirqla';
import { useToast } from '../ui/Toast';
import {
  SlidersHorizontal,
  RotateCcw,
  Wifi,
  Volume2,
  VolumeX,
  PlusCircle,
  Inbox,
  UserCheck,
  Eye,
  X,
  Building,
} from 'lucide-react';
import { UserRole } from '../../types';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const { toast } = useToast();

  const {
    role,
    setRole,
    statePreviewMode,
    setStatePreviewMode,
    simulateSlowNetwork,
    toggleSlowNetwork,
    audioChimeEnabled,
    toggleAudioChime,
    leads,
    resetAllDemoData,
    activeTenantId,
    setActiveTenantId,
  } = useDemoStore();

  const { simulateIncomingOrder, tenants } = useCirqlaStore();

  const handleSimulateOrder = () => {
    simulateIncomingOrder();
    toast('Simulated customer order #1048+ dispatched!', 'success');
  };

  const handleCycleStates = () => {
    const modes: ('normal' | 'loading' | 'empty' | 'error')[] = ['normal', 'loading', 'empty', 'error'];
    const nextIdx = (modes.indexOf(statePreviewMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setStatePreviewMode(nextMode);
    toast(`State preview set to: ${nextMode.toUpperCase()}`, 'info');
  };

  return (
    <>
      {/* Floating Demo Dock (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle Demo Controls"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-ink text-surface text-xs font-sans font-medium shadow-md border border-line-2 hover:bg-primary-a active:scale-95 transition-all duration-150"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-clay" />
          <span>Demo Controls</span>
          {leads.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-clay text-white text-[10px] flex items-center justify-center font-mono">
              {leads.length}
            </span>
          )}
        </button>

        {/* Quick state chip */}
        {statePreviewMode !== 'normal' && (
          <span className="px-2 py-1 rounded bg-warn text-white text-[10px] uppercase font-mono font-bold tracking-wider animate-pulse">
            State: {statePreviewMode}
          </span>
        )}
      </div>

      {/* Popover Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-6 z-40 w-80 sm:w-96 bg-elevated rounded-xl border border-line-2 shadow-xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-clay" />
              <h3 className="text-xs uppercase tracking-wider font-bold text-ink">
                Demo Testing Suite
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-3 hover:text-ink p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {/* Simulation Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSimulateOrder}
                className="flex items-center gap-2 p-2 rounded-md bg-surface hover:bg-bg border border-line text-ink transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-clay shrink-0" />
                <span className="truncate">Dispatch Order</span>
              </button>

              <button
                type="button"
                onClick={handleCycleStates}
                className="flex items-center gap-2 p-2 rounded-md bg-surface hover:bg-bg border border-line text-ink transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">Cycle States ({statePreviewMode})</span>
              </button>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between p-2 rounded-md bg-bg border border-line/60">
              <span className="flex items-center gap-2 text-ink">
                <Wifi className="w-3.5 h-3.5 text-ink-3" />
                Simulate 4x Slow Network
              </span>
              <button
                type="button"
                onClick={toggleSlowNetwork}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                  simulateSlowNetwork ? 'bg-warn text-white' : 'bg-surface text-ink-3 border border-line'
                }`}
              >
                {simulateSlowNetwork ? '4x Throttled' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-bg border border-line/60">
              <span className="flex items-center gap-2 text-ink">
                {audioChimeEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-ok" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-ink-3" />
                )}
                Kitchen Arrival Chime
              </span>
              <button
                type="button"
                onClick={toggleAudioChime}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                  audioChimeEnabled ? 'bg-ok text-white' : 'bg-surface text-ink-3 border border-line'
                }`}
              >
                {audioChimeEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3 h-3" /> Active Session Persona
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  toast(`Switched persona to: ${e.target.value}`, 'info');
                }}
                className="w-full h-8 px-2.5 rounded bg-surface border border-line text-ink text-xs outline-none focus:border-primary"
              >
                <option value="diner">Diner (Cirqla Customer PWA)</option>
                <option value="student">Student (Academy - Hira Siddiqui)</option>
                <option value="venue_manager">Venue GM (Cirqla - Daniyal Farooq)</option>
                <option value="admin">Academy Admin (Platform Owner)</option>
                <option value="super_admin">Cirqla Super-Admin</option>
              </select>
            </div>

            {/* Tenant Switcher */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3 h-3" /> Active Cirqla Tenant
              </label>
              <select
                value={activeTenantId}
                onChange={(e) => {
                  setActiveTenantId(e.target.value);
                  const t = tenants.find((item) => item.id === e.target.value);
                  toast(`Switched tenant to: ${t?.name}`, 'info');
                }}
                className="w-full h-8 px-2.5 rounded bg-surface border border-line text-ink text-xs outline-none focus:border-primary"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Leads Inbox Drawer Trigger & Reset */}
            <div className="pt-2 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowLeadsModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Leads Inbox ({leads.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all demo orders, progress, and edits to default seeds?')) {
                    resetAllDemoData();
                  }
                }}
                className="flex items-center gap-1 text-[11px] text-err hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Seeds</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Inbox Modal */}
      {showLeadsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-elevated rounded-xl border border-line shadow-xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <div>
                <h3 className="font-serif text-lg text-ink">Inbound CRM Leads</h3>
                <p className="text-xs text-ink-3">
                  Captured from the Corporate contact qualification funnel
                </p>
              </div>
              <button
                onClick={() => setShowLeadsModal(false)}
                className="text-ink-3 hover:text-ink p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {leads.length === 0 ? (
                <p className="text-xs text-ink-3 text-center py-6">No leads submitted yet.</p>
              ) : (
                leads.map((ld) => (
                  <div
                    key={ld.id}
                    className="p-3 rounded-lg border border-line bg-surface/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">{ld.name}</span>
                      <span className="text-[10px] text-ink-3 font-mono">
                        {new Date(ld.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-ink-2">{ld.email} · {ld.company}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ld.projectTypes.map((pt) => (
                        <span key={pt} className="px-1.5 py-0.5 rounded bg-clay/10 text-clay text-[10px] font-medium">
                          {pt}
                        </span>
                      ))}
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">
                        Budget: {ld.budget}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-bg text-ink-3 text-[10px]">
                        {ld.timeline}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => setShowLeadsModal(false)}
                className="px-3 py-1.5 rounded-md bg-surface border border-line text-xs font-medium text-ink hover:bg-elevated"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
