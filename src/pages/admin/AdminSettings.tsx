import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, CreditCard, Bus, Info, Lock } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <AdminShell
      title="System & Business Settings"
      subtitle="Gateway integrations, business particulars, and future capability modules"
    >
      <div className="max-w-3xl space-y-6 text-left">
        {/* Business Particulars */}
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sh-1 space-y-4">
          <h3 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
            Business & Company Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input label="Company Legal Name" defaultValue="Future Shuttles & Rentals (Pty) Ltd" readOnly />
            <Input label="Namibian Registration Number" defaultValue="2022/04812/NA" readOnly />
            <Input label="VAT Number" defaultValue="VAT-9821491-015" readOnly />
            <Input label="Official WhatsApp Number" defaultValue="+264 81 234 5678" readOnly />
          </div>
          <Input label="Depot Physical Address" defaultValue="14 Bismarck Street, Windhoek, Namibia" readOnly />
        </div>

        {/* Payment Gateway Integration Status (DPO & Pre-auth) */}
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sh-1 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-lg font-normal text-ink">
                Payment Provider: DPO Group (Demo)
              </h3>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Simulated Mode Active
            </span>
          </div>

          <div className="p-4 bg-amber-50/80 rounded-lg border border-amber-200/60 text-xs text-amber-900 space-y-1.5 leading-relaxed">
            <div className="font-semibold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Assumption 4: Security Deposit Pre-Authorisation</span>
            </div>
            <p>
              This prototype demonstrates the complete user experience for card pre-authorisation holds (card hold at vehicle pickup, released post-return). Note that merchant pre-auth features are subject to final DPO merchant tier and acquiring bank underwriting in Namibia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input label="Merchant Account ID" defaultValue="DPO-MERCHANT-NA-90412" readOnly />
            <Input label="Settlement Currency" defaultValue="Namibian Dollar (NAD / N$)" readOnly />
          </div>
        </div>

        {/* Scalability / Shuttles Extension per PRD §2 */}
        <div className="bg-sand-soft/50 rounded-xl p-6 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-lg font-normal text-ink">
              Shuttles & Transfers Module
            </h3>
            <span className="text-[10px] bg-white/60 text-ink-3 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Planned for Phase 2
            </span>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            The architecture is designed to support point-to-point shuttle bookings (e.g., Windhoek Airport to Swakopmund, Sossusvlei lodges) in future releases without altering vehicle rental availability engines.
          </p>
        </div>
      </div>
    </AdminShell>
  );
};
