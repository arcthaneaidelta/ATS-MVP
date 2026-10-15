import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Shield,
  CreditCard,
  ChevronDown,
  Building,
  Check,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserRole } from '../data/types';

export const RoleSwitcher: React.FC = () => {
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const setActiveBuyerId = useStore((s) => s.setActiveBuyerId);
  const buyers = useStore((s) => s.buyers);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsOpen(false);
    if (newRole === 'buyer') {
      navigate('/app');
    } else if (newRole === 'admin') {
      navigate('/admin');
    } else if (newRole === 'coordinator') {
      navigate('/coord/payments');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return <Compass className="w-3.5 h-3.5 text-meridian-primary" />;
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-meridian-accent" />;
      case 'coordinator':
        return <CreditCard className="w-3.5 h-3.5 text-meridian-info" />;
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'Buyer Agency';
      case 'admin':
        return 'Operator Admin';
      case 'coordinator':
        return 'Payment Coordinator';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-meridian-surface-sunken hover:bg-meridian-border text-xs border border-meridian-border transition-colors select-none"
        aria-label="Role Switcher"
      >
        <span className="text-meridian-text-muted font-sans hidden sm:inline">Viewing as:</span>
        <div className="flex items-center gap-1.5 font-medium text-meridian-text-primary">
          {getRoleIcon(currentRole)}
          <span>{getRoleTitle(currentRole)}</span>
          {currentRole === 'buyer' && currentBuyer && (
            <span className="text-meridian-text-secondary text-[11px] hidden md:inline">
              ({currentBuyer.name} • {currentBuyer.planId})
            </span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-meridian-text-muted ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-72 bg-meridian-surface rounded-card border border-meridian-border shadow-sh-2 z-30 p-2 space-y-2 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] uppercase font-semibold text-meridian-text-muted tracking-wider">
              Switch Active Role
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleRoleChange('buyer')}
                className={`w-full flex items-center justify-between p-2 rounded transition-colors text-left ${
                  currentRole === 'buyer'
                    ? 'bg-meridian-primary-tint text-meridian-primary font-medium'
                    : 'hover:bg-meridian-surface-sunken text-meridian-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-meridian-primary" />
                  <div>
                    <p className="font-semibold">Buyer Portal</p>
                    <p className="text-[11px] text-meridian-text-secondary">
                      Agency self-service, quotes, bookings, proofs
                    </p>
                  </div>
                </div>
                {currentRole === 'buyer' && <Check className="w-4 h-4 text-meridian-primary" />}
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center justify-between p-2 rounded transition-colors text-left ${
                  currentRole === 'admin'
                    ? 'bg-meridian-primary-tint text-meridian-primary font-medium'
                    : 'hover:bg-meridian-surface-sunken text-meridian-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-meridian-accent" />
                  <div>
                    <p className="font-semibold">Operator Admin</p>
                    <p className="text-[11px] text-meridian-text-secondary">
                      Approval queue, rejection, full lifecycle completion
                    </p>
                  </div>
                </div>
                {currentRole === 'admin' && <Check className="w-4 h-4 text-meridian-primary" />}
              </button>

              <button
                onClick={() => handleRoleChange('coordinator')}
                className={`w-full flex items-center justify-between p-2 rounded transition-colors text-left ${
                  currentRole === 'coordinator'
                    ? 'bg-meridian-primary-tint text-meridian-primary font-medium'
                    : 'hover:bg-meridian-surface-sunken text-meridian-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-meridian-info" />
                  <div>
                    <p className="font-semibold">Payment Coordinator</p>
                    <p className="text-[11px] text-meridian-text-secondary">
                      Supplier line confirmation, proof inspection
                    </p>
                  </div>
                </div>
                {currentRole === 'coordinator' && <Check className="w-4 h-4 text-meridian-primary" />}
              </button>
            </div>

            {/* Select Active Buyer Tenant */}
            {currentRole === 'buyer' && (
              <div className="pt-2 border-t border-meridian-border">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-meridian-text-muted tracking-wider flex items-center gap-1.5">
                  <Building className="w-3 h-3" />
                  Simulated Buyer Agency
                </div>
                <div className="space-y-0.5 mt-1 max-h-36 overflow-y-auto">
                  {buyers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBuyerId(b.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left ${
                        b.id === activeBuyerId
                          ? 'bg-meridian-surface-sunken font-semibold text-meridian-primary'
                          : 'hover:bg-meridian-surface-sunken/60 text-meridian-text-secondary'
                      }`}
                    >
                      <div className="truncate">
                        <span className="truncate">{b.name}</span>
                        <span className="text-[10px] text-meridian-text-muted ml-1.5 uppercase font-mono">
                          [{b.planId}]
                        </span>
                      </div>
                      {b.id === activeBuyerId && <Check className="w-3 h-3 text-meridian-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
