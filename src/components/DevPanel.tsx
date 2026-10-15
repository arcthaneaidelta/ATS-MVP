import React from 'react';
import {
  Terminal,
  Activity,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Drawer } from './Drawer';
import { Button } from './Button';

export const DevPanel: React.FC = () => {
  const devPanelOpen = useStore((s) => s.devPanelOpen);
  const setDevPanelOpen = useStore((s) => s.setDevPanelOpen);
  const apiLogs = useStore((s) => s.apiLogs);
  const clearApiLogs = useStore((s) => s.clearApiLogs);
  const failures = useStore((s) => s.failures);
  const setFailures = useStore((s) => s.setFailures);
  const resetDemo = useStore((s) => s.resetDemo);
  const currentRole = useStore((s) => s.currentRole);

  return (
    <>
      {/* Floating Toggle Button (bottom-left) */}
      <button
        onClick={() => setDevPanelOpen(true)}
        className="fixed bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-meridian-text-primary text-white text-xs font-mono rounded-full shadow-sh-2 hover:bg-meridian-primary transition-all duration-150 border border-white/10"
        title="Open Developer Inspector & Mock Server Console"
      >
        <Terminal className="w-3.5 h-3.5 text-meridian-accent" />
        <span>Dev View</span>
        {apiLogs.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-meridian-success animate-pulse" />
        )}
      </button>

      {/* Developer Drawer */}
      <Drawer
        isOpen={devPanelOpen}
        onClose={() => setDevPanelOpen(false)}
        title="Mock Server & Developer View"
        description="Inspect server-side eligibility checks, state transitions, API calls and failure injection"
        width="max-w-xl"
      >
        <div className="space-y-6 font-mono text-xs">
          {/* Failure Injection Controls */}
          <div className="border border-meridian-border bg-meridian-surface-sunken/40 rounded-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-meridian-text-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-meridian-warning" />
                Failure Simulation Modes
              </span>
              <span className="text-[11px] text-meridian-text-muted">PRD Section 5.5</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 bg-meridian-surface rounded border border-meridian-border cursor-pointer hover:border-meridian-border-strong">
                <div>
                  <p className="font-medium text-meridian-text-primary">Network Error on Next Write</p>
                  <p className="text-[11px] text-meridian-text-secondary">
                    Forces 503 Network Failure on next booking or proof upload
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={failures.networkErrorNextWrite}
                  onChange={(e) => setFailures({ networkErrorNextWrite: e.target.checked })}
                  className="rounded text-meridian-accent focus:ring-meridian-accent h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-meridian-surface rounded border border-meridian-border cursor-pointer hover:border-meridian-border-strong">
                <div>
                  <p className="font-medium text-meridian-text-primary">Simulate Slow Network (4s)</p>
                  <p className="text-[11px] text-meridian-text-secondary">
                    Artificially introduces 4,000ms latency on all mock endpoints
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={failures.slowResponse}
                  onChange={(e) => setFailures({ slowResponse: e.target.checked })}
                  className="rounded text-meridian-accent focus:ring-meridian-accent h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-meridian-surface rounded border border-meridian-border cursor-pointer hover:border-meridian-border-strong">
                <div>
                  <p className="font-medium text-meridian-text-primary">Simulate Expired Session</p>
                  <p className="text-[11px] text-meridian-text-secondary">
                    Causes requests to fail with 401 Session Expired token
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={failures.expiredSession}
                  onChange={(e) => setFailures({ expiredSession: e.target.checked })}
                  className="rounded text-meridian-accent focus:ring-meridian-accent h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Quick Demo Navigation & Edge Cases Hints */}
          <div className="border border-meridian-border bg-meridian-primary-tint/20 rounded-card p-4 space-y-2">
            <span className="font-semibold text-meridian-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-meridian-primary" />
              Demo Edge Case Quick Links
            </span>
            <p className="text-[11px] text-meridian-text-secondary font-sans leading-relaxed">
              <strong>Tip:</strong> Open Quote <span className="font-mono text-meridian-primary">Q-2041</span> (expired) in the buyer wizard to test Rule 03 expiration failure. Visit <span className="font-mono text-meridian-primary">BK-2604</span> to demonstrate the one-time reconsideration flow.
            </p>
          </div>

          {/* Live Mock Server API Log Stream */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-meridian-text-primary flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-meridian-primary" />
                Live Mock API Call Stream ({apiLogs.length})
              </span>
              {apiLogs.length > 0 && (
                <button
                  onClick={clearApiLogs}
                  className="text-meridian-text-muted hover:text-meridian-error flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {apiLogs.length === 0 ? (
              <div className="p-6 text-center text-meridian-text-muted bg-meridian-surface rounded border border-meridian-border">
                No mock API requests recorded yet. Perform an action in the UI to see network calls.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {apiLogs.map((log) => {
                  const isOk = log.status >= 200 && log.status < 300;
                  const isClientErr = log.status >= 400 && log.status < 500;
                  const isServerErr = log.status >= 500;

                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded bg-meridian-surface border border-meridian-border space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              isOk
                                ? 'bg-meridian-success-tint text-meridian-success'
                                : isClientErr
                                ? 'bg-meridian-warning-tint text-meridian-warning'
                                : 'bg-meridian-error-tint text-meridian-error'
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="font-semibold text-meridian-text-primary">
                            {log.method}
                          </span>
                          <span className="text-meridian-text-secondary truncate">
                            {log.path}
                          </span>
                        </div>
                        <span className="text-[10px] text-meridian-text-muted shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.durationMs}ms
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-meridian-text-muted pt-1 border-t border-meridian-border/50">
                        <span className="text-meridian-primary font-medium truncate">
                          Rule: {log.ruleApplied}
                        </span>
                        <span className="capitalize shrink-0">Role: {log.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset Demo State Action */}
          <div className="pt-2 border-t border-meridian-border flex items-center justify-between">
            <div>
              <p className="font-medium text-meridian-text-primary">Reset Demo State</p>
              <p className="text-[11px] text-meridian-text-secondary font-sans">
                Restores initial seed data in under 1 second.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                resetDemo();
                setDevPanelOpen(false);
              }}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Seed
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};
