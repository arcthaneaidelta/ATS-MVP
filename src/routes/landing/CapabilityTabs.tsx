import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  FileSpreadsheet,
  TrendingUp,
  ShoppingCart,
  Building,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FulfillmentBar } from '../../components/domain/FulfillmentBar';
import clsx from 'clsx';

export function CapabilityTabs() {
  const [activeTab, setActiveTab] = useState<'parts' | 'rfq' | 'pricing' | 'orders' | 'entities'>('parts');
  const [entityCurrency, setEntityCurrency] = useState<'PEN' | 'ZMW' | 'USD'>('USD');
  const navigate = useNavigate();

  const tabs = [
    { id: 'parts', label: 'Part Memory', icon: Package },
    { id: 'rfq', label: 'Quote from RFQ', icon: FileSpreadsheet },
    { id: 'pricing', label: 'Price History', icon: TrendingUp },
    { id: 'orders', label: 'Orders & Payments', icon: ShoppingCart },
    { id: 'entities', label: 'Multi-Entity', icon: Building },
  ];

  return (
    <section id="capabilities" className="py-24 px-4 sm:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            Capability Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-900">
            Real relational tools. Not disconnected forms.
          </h2>
          <p className="text-sm text-ink-700 leading-relaxed">
            Every feature in Stratum connects directly to your commercial history so your quotation specialists quote with speed and margin confidence.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-primary bg-primary-tint/30'
                    : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-surface-sunken/40'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Tab Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-bg p-6 sm:p-10 rounded-lg border border-border">
          {/* Left Description Column */}
          <div className="lg:col-span-5 space-y-4">
            {activeTab === 'parts' && (
              <>
                <h3 className="text-xl font-bold text-ink-900">Canonical Multi-OEM Numbering</h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  One part number connects Sandvik, Epiroc, RESEMIN, and Caterpillar references into one relational tree.
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">
                  When a buyer requests an obsolete number or aftermarket equivalent, the system highlights all verified alternatives instantly.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/app/parts')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Try Parts Master in demo
                </Button>
              </>
            )}

            {activeTab === 'rfq' && (
              <>
                <h3 className="text-xl font-bold text-ink-900">Automated RFQ Spreadsheet Matching</h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Drop a messy 42-line client inquiry spreadsheet and watch the engine resolve part numbers progressively.
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Set target margin rules across all items with one slider, compare up to 3 supplier quotes, and generate an official A4 quotation in seconds.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/app/rfq/new')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Test RFQ Import in demo
                </Button>
              </>
            )}

            {activeTab === 'pricing' && (
              <>
                <h3 className="text-xl font-bold text-ink-900">Six-Point Price Ladder Intelligence</h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Compare OEM catalog MSRP against best supplier cost, historical purchase price, landed cost, and latest quotation.
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">
                  The latest quote reference and date are auto-identified so your margin baseline is always grounded in verified transaction data.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/app/pricing')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Open Price Ladder in demo
                </Button>
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <h3 className="text-xl font-bold text-ink-900">Customer & Supplier PO Linking</h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Sales orders link directly to supplier purchase POs with visible segmented fulfillment tracking.
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Record partial deliveries with waybill logging, and watch backorder balances update across both contracts simultaneously.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/app/orders')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Inspect Orders in demo
                </Button>
              </>
            )}

            {activeTab === 'entities' && (
              <>
                <h3 className="text-xl font-bold text-ink-900">Multi-Entity & Currency Governance</h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Seamlessly isolate Peru S.A.C. (PEN/USD), Zambia Ltd (ZMW/USD), and International FZE (USD).
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Switch operating context instantly to recalculate ledgers and document letterheads, or view group consolidated reporting.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/app/admin')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Entity Access in demo
                </Button>
              </>
            )}
          </div>

          {/* Right Live Mini-Component Window */}
          <div className="lg:col-span-7 bg-surface rounded-md border border-border p-6 shadow-sm min-h-[300px] flex items-center justify-center">
            {activeTab === 'parts' && (
              <div className="w-full space-y-3 font-mono text-xs">
                <div className="p-3 bg-primary-tint/60 border border-primary/30 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-primary uppercase font-bold block">Canonical Master</span>
                    <span className="font-bold text-ink-900 text-sm">STR-000412</span>
                  </div>
                  <Badge variant="primary" size="sm">Drill Consumables</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 bg-surface-sunken border border-border rounded-xs flex justify-between">
                    <span>Epiroc EP-3380-6350</span>
                    <span className="text-ink-500">OEM Shank COP1838</span>
                  </div>
                  <div className="p-2 bg-surface-sunken border border-border rounded-xs flex justify-between">
                    <span>Sandvik SDV-4471-023</span>
                    <span className="text-ink-500">Cross-fit HLX5</span>
                  </div>
                  <div className="p-2 bg-surface-sunken border border-border rounded-xs flex justify-between">
                    <span>RESEMIN RS-T38-635</span>
                    <span className="text-ink-500">Muki 22 Drifter</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rfq' && (
              <div className="w-full space-y-2 text-xs">
                <span className="text-[10.5px] font-mono text-ink-500 uppercase block">5-Row Matching Simulation</span>
                {[
                  { ref: 'SDV-4471-023', match: 'STR-000412', status: 'Matched via Sandvik', color: 'text-success' },
                  { ref: 'EP-3380-6350', match: 'STR-000412', status: 'Matched via Epiroc', color: 'text-success' },
                  { ref: 'STR-000413', match: 'STR-000413', status: 'Direct Canonical Match', color: 'text-success' },
                  { ref: 'BR-0932-A', match: '2 Candidates', status: 'Needs Review', color: 'text-warning font-semibold' },
                  { ref: 'KM-HS-2210-8', match: 'STR-000501', status: 'Matched via Komatsu', color: 'text-success' },
                ].map((row, idx) => (
                  <div key={idx} className="p-2 bg-surface-elevated border border-border rounded-xs flex items-center justify-between font-mono">
                    <span className="font-bold text-ink-900">{row.ref}</span>
                    <span className={row.color}>{row.status}</span>
                    <span className="text-ink-700 font-semibold">{row.match}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="w-full space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="font-mono font-bold text-ink-900">STR-000412 Shank Adapter</span>
                  <Badge variant="accent" size="sm">Latest: QT-PE-0211</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-surface-sunken rounded-xs border border-border">
                    <span className="text-[10px] text-ink-500 block">Supplier Cost</span>
                    <span className="text-sm font-bold text-ink-900">$88.50</span>
                  </div>
                  <div className="p-2 bg-primary-tint/60 rounded-xs border border-primary/30">
                    <span className="text-[10px] text-primary block">Landed (+14.8%)</span>
                    <span className="text-sm font-bold text-primary">$101.60</span>
                  </div>
                  <div className="p-2 bg-accent-tint/60 rounded-xs border border-accent/30">
                    <span className="text-[10px] text-accent block">Latest Quoted</span>
                    <span className="text-sm font-bold text-accent">$136.00</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="w-full space-y-4 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-ink-900">PO-PE-0891 · Minera Andaluz</span>
                  <span className="text-success font-semibold">16 / 24 Delivered</span>
                </div>
                <FulfillmentBar ordered={24} delivered={16} inTransit={4} />
                <span className="text-[11px] text-ink-500 font-mono block">
                  Backed by Hartmann PO: SPO-PE-0391 (Delivered to Callao port)
                </span>
              </div>
            )}

            {activeTab === 'entities' && (
              <div className="w-full space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-semibold text-ink-900">Entity Currency Conversion</span>
                  <div className="flex items-center gap-1 font-mono">
                    {(['USD', 'PEN', 'ZMW'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setEntityCurrency(curr)}
                        className={clsx(
                          'px-2 py-0.5 rounded-xs border text-[11px]',
                          entityCurrency === curr ? 'bg-primary text-white font-bold' : 'bg-surface text-ink-500'
                        )}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-surface-sunken border border-border rounded-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Shank Adapter STR-000412:</span>
                    <span className="font-bold text-ink-900">
                      {entityCurrency === 'USD' ? 'USD 136.00' : entityCurrency === 'PEN' ? 'PEN 505.92' : 'ZMW 3,590.40'}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-500 text-[11px]">
                    <span>Air Filter STR-000731:</span>
                    <span>
                      {entityCurrency === 'USD' ? 'USD 42.00' : entityCurrency === 'PEN' ? 'PEN 156.24' : 'ZMW 1,108.80'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
