import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useCirqlaStore } from '../../../store/cirqla';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import {
  MapPin,
  QrCode,
  Palette,
  Plus,
  Copy,
  Printer,
  Download,
  Building,
  Check,
  Smartphone,
} from 'lucide-react';

export const BranchesSettingsPage: React.FC = () => {
  const { activeTenantId, tenants, updateTenantAccent } = useCirqlaStore();
  const { toast } = useToast();

  const tenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const [activeTab, setActiveTab] = useState<'branches' | 'qrcodes' | 'branding'>('branches');
  const [tableCount, setTableCount] = useState<number>(8);
  const [tableQrs, setTableQrs] = useState<{ table: number; dataUrl: string }[]>([]);

  // Curated 8 swatches for tenant branding per PRD Section 9.7
  const curatedSwatches = [
    { name: 'Terracotta Clay', hex: '#B85C3C' },
    { name: 'Harbour Teal', hex: '#2F5D62' },
    { name: 'Orchard Plum', hex: '#6A4A5C' },
    { name: 'Tandoor Amber', hex: '#A8641F' },
    { name: 'Bakehouse Olive', hex: '#8A6F3A' },
    { name: 'Midnight Pine', hex: '#1F3A33' },
    { name: 'Indigo Slate', hex: '#4E6A86' },
    { name: 'Espresso Rust', hex: '#8C432B' },
  ];

  const branches = [
    { name: 'Central Branch', address: '48 Kiln Street, Soho, London', hours: '11:00 – 23:00', tables: 24, ordersToday: 68 },
    { name: 'Riverside Branch', address: '12 Wharf Road, Battersea', hours: '12:00 – 22:30', tables: 18, ordersToday: 42 },
    { name: 'Airport Express', address: 'Terminal 2 Concourse B', hours: '06:00 – 22:00', tables: 14, ordersToday: 94 },
  ];

  // Regenerate table QRs whenever table count or tenant changes
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bioniciq.example';
    const generate = async () => {
      const qrs: { table: number; dataUrl: string }[] = [];
      for (let i = 1; i <= tableCount; i++) {
        const url = `${origin}/cirqla/scan/${tenant.slug}?table=${i}`;
        const dataUrl = await QRCode.toDataURL(url, {
          margin: 1,
          width: 160,
          color: { dark: '#17231F', light: '#FCFBF8' },
        });
        qrs.push({ table: i, dataUrl });
      }
      setTableQrs(qrs);
    };
    generate();
  }, [tableCount, tenant]);

  const handleCopyTableLink = (tableNum: number) => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(`${origin}/cirqla/scan/${tenant.slug}?table=${tableNum}`);
    toast(`Copied direct QR link for Table ${tableNum}`, 'success');
  };

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Branches, QR Station Generator & Branding
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Generate printable table-tent QR cards and configure venue white-label themes.
          </p>
        </div>

        <div className="flex rounded-lg bg-surface border border-line p-1 text-xs">
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1 rounded-md font-medium ${
              activeTab === 'branches' ? 'bg-elevated font-bold text-primary shadow-xs' : 'text-ink-3'
            }`}
          >
            Branches
          </button>
          <button
            onClick={() => setActiveTab('qrcodes')}
            className={`px-3 py-1 rounded-md font-medium ${
              activeTab === 'qrcodes' ? 'bg-elevated font-bold text-primary shadow-xs' : 'text-ink-3'
            }`}
          >
            QR Station Generator
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1 rounded-md font-medium ${
              activeTab === 'branding' ? 'bg-elevated font-bold text-primary shadow-xs' : 'text-ink-3'
            }`}
          >
            Branding & Theme
          </button>
        </div>
      </div>

      {/* Tab 1: Branches */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.name} className="p-6 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-serif text-lg font-bold text-ink">{b.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ok-tint text-ok font-bold">
                  Open
                </span>
              </div>
              <div className="text-xs text-ink-2 space-y-1">
                <p className="flex items-center gap-1.5 text-ink">
                  <MapPin className="w-3.5 h-3.5 text-clay shrink-0" />
                  <span>{b.address}</span>
                </p>
                <p className="text-ink-3">Service Hours: {b.hours}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs font-mono">
                <div className="p-2 rounded bg-elevated border border-line">
                  <span className="text-[10px] text-ink-3 block">Configured Tables</span>
                  <span className="font-bold text-ink">{b.tables} Tables</span>
                </div>
                <div className="p-2 rounded bg-elevated border border-line">
                  <span className="text-[10px] text-ink-3 block">Orders Today</span>
                  <span className="font-bold text-clay">{b.ordersToday} Orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: QR Codes Station Generator */}
      {activeTab === 'qrcodes' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-ink">Table Quantity Stepper:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={tableCount <= 2}
                  onClick={() => setTableCount((c) => Math.max(2, c - 2))}
                  className="w-7 h-7 rounded border border-line bg-elevated flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold w-8 text-center">{tableCount}</span>
                <button
                  type="button"
                  onClick={() => setTableCount((c) => Math.min(24, c + 2))}
                  className="w-7 h-7 rounded border border-line bg-elevated flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-ink-3">Live regenerating printable cards</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => toast(`Simulated generation of ${tableCount} table tent print cards`, 'success')}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Download All as PDF (Print Ready)
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {tableQrs.map((qr) => (
              <div
                key={qr.table}
                className="p-4 rounded-xl bg-elevated border border-line shadow-xs text-center space-y-2 group hover:border-clay transition-all"
              >
                <span className="font-mono text-xs font-bold text-ink block">
                  Table {qr.table}
                </span>
                <div className="p-1 bg-bg rounded-lg border border-line">
                  <img src={qr.dataUrl} alt={`Table ${qr.table} QR`} className="w-full h-auto mx-auto" />
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTableLink(qr.table)}
                  className="inline-flex items-center gap-1 text-[11px] text-clay hover:underline font-medium"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Link</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Branding & Color Theme Swatches */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-line p-6 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink">Venue Theme Tokens</h3>
              <p className="text-xs text-ink-3 mt-1">
                Select from our vetted, accessible hospitality swatches to instantly re-skin diner web apps.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase font-bold text-ink-2">
                Curated Accent Palette (WCAG AA Compliant)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {curatedSwatches.map((swatch) => {
                  const isSelected = tenant.accent.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => {
                        updateTenantAccent(tenant.id, swatch.hex);
                        toast(`Theme updated to ${swatch.name}`, 'success');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-ink bg-elevated ring-2 ring-primary/20 shadow-xs'
                          : 'border-line bg-bg hover:bg-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full shadow-xs shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs font-semibold text-ink truncate">
                          {swatch.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg border border-line text-xs space-y-2">
              <span className="font-bold text-ink block">Theme Token Injection Note</span>
              <p className="text-ink-2 text-[11px] leading-relaxed">
                Per PRD Section 8.7, only the <code>--clay</code> primary CTA and header accent token is overridden at the app root; layout structure, radius, typography, and spacing tokens remain permanently locked to preserve ecosystem consistency.
              </p>
            </div>
          </div>

          {/* Live Mobile Mockup Re-Skin Preview */}
          <div className="lg:col-span-5 bg-surface rounded-2xl border border-line p-6 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block">
              Live Diner App Re-Skin Preview
            </span>

            {/* Mini Phone Preview */}
            <div className="w-64 h-[380px] bg-bg rounded-[32px] border-4 border-ink shadow-lg mx-auto p-4 flex flex-col justify-between overflow-hidden text-left relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: tenant.accent }}
                    >
                      {tenant.name.charAt(0)}
                    </div>
                    <span className="font-bold text-xs text-ink truncate">{tenant.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink-3">T12</span>
                </div>

                <div className="p-3 rounded-lg bg-elevated border border-line space-y-1">
                  <span className="text-[11px] font-bold text-ink">Slow-Cooked Short Rib</span>
                  <span className="font-mono text-[11px] text-ink-3 block">$24.50</span>
                  <div className="w-full h-1 bg-line rounded-full overflow-hidden mt-1">
                    <div className="h-full w-2/3" style={{ backgroundColor: tenant.accent }} />
                  </div>
                </div>
              </div>

              <div
                className="w-full py-2 rounded-lg text-white text-center text-xs font-bold shadow-xs transition-colors"
                style={{ backgroundColor: tenant.accent }}
              >
                Pay & Send to Kitchen · $24.50
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
