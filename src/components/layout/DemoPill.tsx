import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { Shield, RotateCcw, ArrowRight, Eye, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DemoPill: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetDemoData, bookings, quotations } = useDemoStore();

  const isAdmin = location.pathname.startsWith('/admin');

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to initial seed state? (Restores mock bookings, rates, and vehicles)')) {
      resetDemoData();
      toast({
        type: 'info',
        title: 'Demo Data Reset',
        message: 'All seed bookings, quotes, and pricing brackets restored.',
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden select-none">
      <div className="bg-primary/95 text-sand-soft backdrop-blur-md border border-white/20 rounded-lg shadow-sh-3 text-xs overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between px-3 py-2 bg-[#1A2420] border-b border-white/10 gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span>Interactive Demo Control</span>
          </div>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-sand/70 hover:text-white p-0.5"
            aria-label="Toggle demo bar"
          >
            {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!minimized && (
          <div className="p-3 space-y-2.5 min-w-[240px]">
            <div className="flex items-center justify-between text-[11px] text-sand/80 pb-1">
              <span>Live Shared Mock Store</span>
              <span className="font-mono text-accent">
                {bookings.length} bks · {quotations.length} qts
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-white py-1.5 px-3 rounded font-medium transition-colors text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public Website</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white py-1.5 px-3 rounded font-medium transition-colors text-xs border border-white/20"
                >
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>Switch to Admin</span>
                </button>
              )}

              <button
                onClick={handleReset}
                title="Restore fresh seed data"
                className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-sand p-1.5 rounded transition-colors text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="sr-only">Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
