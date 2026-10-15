import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { UserRole } from '../../data/types';

export const ForbiddenPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);

  const state = (location.state as any) || {};
  const failedPath = state.failedPath || '/admin';
  const ruleExplanation =
    state.ruleExplanation ||
    `Access policy violation: Accessing ${failedPath} requires elevated Operator privileges. You are currently authenticated with the '${currentRole}' role.`;
  const requiredRoles: UserRole[] = state.requiredRoles || ['admin'];

  const handleSwitchAndProceed = (targetRole: UserRole) => {
    setRole(targetRole);
    navigate(failedPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-meridian-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-2 p-8 text-center space-y-6 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 bg-meridian-accent-tint text-meridian-accent rounded-full flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
            HTTP 403 • Access Policy Enforcement
          </span>
          <h1 className="text-2xl font-serif font-medium text-meridian-text-primary">
            Server-Side Authorization Boundary
          </h1>
          <p className="text-xs text-meridian-text-secondary leading-relaxed bg-meridian-surface-sunken p-3 rounded-card border border-meridian-border font-mono text-left">
            {ruleExplanation}
          </p>
        </div>

        <div className="pt-2 border-t border-meridian-border space-y-3">
          <p className="text-xs text-meridian-text-muted">
            The ATS platform guarantees strict tenant & role segmentation enforced at the server boundary. Switch your demo role below to satisfy the access policy:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {requiredRoles.map((role) => (
              <Button
                key={role}
                variant="primary"
                size="sm"
                onClick={() => handleSwitchAndProceed(role)}
                icon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Switch to {role.charAt(0).toUpperCase() + role.slice(1)} & Retry
              </Button>
            ))}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(currentRole === 'buyer' ? '/app' : currentRole === 'admin' ? '/admin' : '/coord/payments')}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Return to Safe Workspace
            </Button>
          </div>
        </div>

        <div className="text-[11px] text-meridian-text-muted font-mono">
          Security policy: RBAC_STRICT_ROUTE_ENFORCEMENT_V2
        </div>
      </div>
    </div>
  );
};
