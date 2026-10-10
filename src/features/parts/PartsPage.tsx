import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  ArrowUpDown,
  Search,
  Filter,
  FileDown,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  RotateCcw,
  CheckCircle,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Part, OEMReference, CommercialEvent } from '../../mock/types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge, StatusBadge, FreshnessDot, PartNumber } from '../../components/ui/Badge';
import { Drawer, Modal } from '../../components/ui/Modal';
import { ReferenceMap } from '../../components/domain/ReferenceMap';
import { formatMoney, formatDate, formatNumber } from '../../lib/format';
import { matchPartQuery } from '../../lib/normalizer';
import { Tabs } from '../../components/ui/Tabs';
import { ErrorState, EmptyState } from '../../components/ui/Skeleton';
import clsx from 'clsx';

export function PartsPage() {
  const { parts, commercialEvents, addToast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOem, setSelectedOem] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasAlternativeFilter, setHasAlternativeFilter] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [sortField, setSortField] = useState<'id' | 'description' | 'lastQuotedPrice' | 'timesSold12m'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // New Part modal
  const [isNewPartModalOpen, setIsNewPartModalOpen] = useState(false);
  const [newPartId, setNewPartId] = useState('STR-001044');
  const [newPartDesc, setNewPartDesc] = useState('');
  const [newPartCat, setNewPartCat] = useState('Drill consumables');

  // Selected Part drawer state (from URL query param ?part=STR-xxx)
  const selectedPartId = searchParams.get('part');
  const selectedPart = parts.find((p) => p.id === selectedPartId) || null;

  // Drawer active tab
  const [drawerTab, setDrawerTab] = useState<'overview' | 'commercial' | 'alternatives' | 'documents'>('overview');

  // Filtered and sorted parts list
  const filteredParts = useMemo(() => {
    return parts
      .filter((p) => {
        // Text / multi-OEM search
        if (searchQuery.trim()) {
          const match = matchPartQuery(p, searchQuery);
          if (!match) return false;
        }

        // OEM filter
        if (selectedOem !== 'all') {
          const hasOem = p.oemReferences.some((r) =>
            r.oem.toLowerCase() === selectedOem.toLowerCase()
          );
          if (!hasOem) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        // Verified alternative filter
        if (hasAlternativeFilter && p.verifiedAlternatives.length === 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [parts, searchQuery, selectedOem, selectedCategory, hasAlternativeFilter, sortField, sortAsc]);

  // Handle drawer open/close
  const handleOpenDrawer = (partId: string) => {
    setSearchParams({ part: partId });
  };

  const handleCloseDrawer = () => {
    searchParams.delete('part');
    setSearchParams(searchParams);
  };

  // Drawer commercial history events
  const partEvents = useMemo(() => {
    if (!selectedPart) return [];
    return commercialEvents
      .filter((e) => e.partId === selectedPart.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [commercialEvents, selectedPart]);

  const handleCreateNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartDesc.trim()) return;
    addToast(`Part ${newPartId} created and added to master catalog`, 'success');
    setIsNewPartModalOpen(false);
    setNewPartDesc('');
  };

  // Error simulation state check
  const isSimulatedError = selectedPartId === 'STR-000999';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
              Global Parts Master
            </h1>
            <Badge variant="primary" size="md">
              4,812 parts · 11,930 OEM references
            </Badge>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Canonical multi-OEM catalog linking Epiroc, Sandvik, RESEMIN, Caterpillar, Komatsu and Normet references.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/migration')}
            leftIcon={<FileDown className="w-3.5 h-3.5" />}
          >
            Import parts
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewPartModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New part
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-surface border border-border rounded-md space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Main Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part ID, description, or ANY OEM reference (e.g. EP-3380-6350, SDV-4471-023)..."
              className="w-full bg-surface-elevated text-xs font-mono pl-9 pr-3 py-2 border border-border-strong rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* OEM select */}
          <div className="w-full sm:w-44">
            <select
              value={selectedOem}
              onChange={(e) => setSelectedOem(e.target.value)}
              className="w-full text-xs bg-surface-elevated border border-border-strong rounded-sm px-2.5 py-2 text-ink-900 focus:outline-none focus:border-primary"
            >
              <option value="all">All OEMs</option>
              <option value="Epiroc">Epiroc</option>
              <option value="Sandvik">Sandvik</option>
              <option value="RESEMIN">RESEMIN</option>
              <option value="Caterpillar">Caterpillar</option>
              <option value="Komatsu">Komatsu</option>
              <option value="Normet">Normet</option>
            </select>
          </div>

          {/* Category select */}
          <div className="w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-surface-elevated border border-border-strong rounded-sm px-2.5 py-2 text-ink-900 focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              <option value="Drill consumables">Drill consumables</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Filtration">Filtration</option>
              <option value="Breaker tools">Breaker tools</option>
              <option value="Undercarriage">Undercarriage</option>
              <option value="Ground engaging tools">Ground engaging tools</option>
              <option value="Engine">Engine</option>
              <option value="Shotcrete">Shotcrete</option>
            </select>
          </div>

          {/* Density Toggle */}
          <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-sm border border-border shrink-0">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={clsx(
                'px-2 py-1 text-[11px] font-medium rounded-xs transition-colors',
                density === 'comfortable' ? 'bg-surface text-ink-900 shadow-xs' : 'text-ink-500'
              )}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={clsx(
                'px-2 py-1 text-[11px] font-medium rounded-xs transition-colors',
                density === 'compact' ? 'bg-surface text-ink-900 shadow-xs' : 'text-ink-500'
              )}
            >
              Compact
            </button>
          </div>
        </div>

        {/* Filter Chips row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mr-1">
            Quick Filters:
          </span>
          <button
            type="button"
            onClick={() => setHasAlternativeFilter(!hasAlternativeFilter)}
            className={clsx(
              'px-2.5 py-1 rounded-xs border text-[11px] font-medium transition-colors flex items-center gap-1',
              hasAlternativeFilter
                ? 'bg-primary-tint border-primary text-primary font-semibold'
                : 'bg-surface-elevated border-border text-ink-700 hover:bg-surface-sunken'
            )}
          >
            <ShieldCheck className="w-3 h-3 text-success" />
            Has Verified Alternative
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('SDV-4471-023');
            }}
            className="px-2 py-1 rounded-xs border border-border text-[11px] text-ink-500 hover:text-ink-900 bg-surface-sunken/60 font-mono"
          >
            Try: SDV-4471-023
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('KM-HS-2210-8');
            }}
            className="px-2 py-1 rounded-xs border border-border text-[11px] text-ink-500 hover:text-ink-900 bg-surface-sunken/60 font-mono"
          >
            Try: KM-HS-2210-8
          </button>
          <button
            type="button"
            onClick={() => handleOpenDrawer('STR-000999')}
            className="px-2 py-1 rounded-xs border border-error/30 text-[11px] text-error hover:bg-error-tint/50 bg-error-tint/20 font-mono ml-auto"
          >
            Try Error Part (STR-000999)
          </button>
        </div>
      </div>

      {/* Main Parts Table (Desktop) / Cards (Mobile) */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider font-semibold text-ink-700">
                <th
                  onClick={() => {
                    setSortField('id');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-ink-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Part ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('description');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-ink-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Description / Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">OEM References</th>
                <th className="py-3 px-4 text-center">Verified Alt</th>
                <th
                  onClick={() => {
                    setSortField('lastQuotedPrice');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 text-right cursor-pointer hover:text-ink-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Last Quoted</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Supplier Cost</th>
                <th
                  onClick={() => {
                    setSortField('timesSold12m');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 text-right cursor-pointer hover:text-ink-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sold (12m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredParts.map((part) => {
                const isSelected = selectedPartId === part.id;
                return (
                  <tr
                    key={part.id}
                    onClick={() => handleOpenDrawer(part.id)}
                    className={clsx(
                      'cursor-pointer transition-colors text-xs hover:bg-primary-tint/30',
                      isSelected ? 'bg-primary-tint/60 border-l-2 border-primary' : '',
                      density === 'compact' ? 'py-2' : 'py-3'
                    )}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-ink-900 whitespace-nowrap">
                      <PartNumber value={part.id} showCopy={false} />
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-ink-900 leading-snug">{part.description}</p>
                      <span className="text-[11px] text-ink-500 font-mono mt-0.5 inline-block">
                        {part.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 items-center max-w-xs">
                        {part.oemReferences.slice(0, 3).map((ref, idx) => (
                          <span
                            key={idx}
                            className="bg-surface-sunken border border-border text-[10.5px] px-1.5 py-0.5 rounded-xs font-mono text-ink-700"
                          >
                            <strong className="font-semibold text-ink-900">{ref.oem}:</strong>{' '}
                            {ref.number}
                          </span>
                        ))}
                        {part.oemReferences.length > 3 && (
                          <span className="text-[10px] text-ink-500 font-mono">
                            +{part.oemReferences.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {part.verifiedAlternatives.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium bg-success-tint px-2 py-0.5 rounded-xs">
                          <ShieldCheck className="w-3 h-3" />
                          {part.verifiedAlternatives.length}
                        </span>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      <div className="flex items-center justify-end gap-1.5">
                        <FreshnessDot dateStr={part.lastQuotedDate} />
                        <span className="font-semibold text-ink-900">
                          {formatMoney(part.lastQuotedPrice, 'USD', true)}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-500 block">{part.lastQuotedRef}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-ink-700">
                      {formatMoney(part.lastSupplierCost, part.lastSupplierCurrency, true)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-medium text-ink-900">
                      {formatNumber(part.timesSold12m)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Stacked Cards (Section 15) */}
        <div className="md:hidden divide-y divide-border">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              onClick={() => handleOpenDrawer(part.id)}
              className="p-4 hover:bg-surface-sunken/50 cursor-pointer space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <PartNumber value={part.id} className="font-bold text-primary" />
                <div className="flex items-center gap-1 font-mono font-semibold">
                  <FreshnessDot dateStr={part.lastQuotedDate} />
                  <span>{formatMoney(part.lastQuotedPrice, 'USD', true)}</span>
                </div>
              </div>
              <p className="font-medium text-ink-900">{part.description}</p>
              <div className="flex items-center justify-between text-[11px] text-ink-500">
                <span>{part.category}</span>
                <span className="font-mono">{part.oemReferences.length} OEM refs</span>
              </div>
            </div>
          ))}
        </div>

        {filteredParts.length === 0 && (
          <EmptyState
            icon={Package}
            title="No part matches your search"
            description={`No catalogue item matched '${searchQuery}'. Try another OEM number or remove filters.`}
            actionText="Reset filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedOem('all');
              setSelectedCategory('all');
              setHasAlternativeFilter(false);
            }}
          />
        )}
      </div>

      {/* Part Detail Drawer (Signature Component & PRD Spec 12.2) */}
      <Drawer
        isOpen={Boolean(selectedPartId)}
        onClose={handleCloseDrawer}
        width="max-w-2xl"
        title={
          selectedPart ? (
            <div className="flex items-center gap-2">
              <PartNumber value={selectedPart.id} className="text-lg text-primary font-bold" />
              <Badge variant="primary" size="sm">
                {selectedPart.category}
              </Badge>
            </div>
          ) : (
            'Part Detail'
          )
        }
        subtitle={selectedPart?.description}
      >
        {isSimulatedError ? (
          <div className="p-6">
            <ErrorState
              message="Couldn't load this part record. Database error simulation triggered for STR-000999."
              onRetry={() => handleCloseDrawer()}
            />
          </div>
        ) : selectedPart ? (
          <div className="space-y-6">
            {/* Signature Reference Map */}
            <ReferenceMap
              partId={selectedPart.id}
              partDescription={selectedPart.description}
              oemReferences={selectedPart.oemReferences}
              verifiedAlternatives={selectedPart.verifiedAlternatives}
            />

            {/* Quick Action Navigation to Pricing Intelligence */}
            <div className="flex items-center justify-between p-3.5 bg-accent-tint/40 border border-accent/30 rounded-sm text-xs">
              <div>
                <span className="font-semibold text-accent block">Pricing Intelligence View</span>
                <span className="text-[11px] text-ink-700">
                  Inspect the six-point price ladder & chronological quote history.
                </span>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate(`/app/pricing?part=${selectedPart.id}`)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Open Pricing Ladder
              </Button>
            </div>

            {/* Tabs for Drawer */}
            <Tabs
              tabs={[
                { id: 'overview', label: 'Technical Specs' },
                { id: 'commercial', label: 'Commercial History', count: partEvents.length },
                { id: 'alternatives', label: 'Verified Alternatives', count: selectedPart.verifiedAlternatives.length },
                { id: 'documents', label: 'Documents & Drawings', count: selectedPart.documents.length },
              ]}
              activeTab={drawerTab}
              onChange={(t) => setDrawerTab(t as any)}
            />

            {/* Tab 1: Overview */}
            {drawerTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-ink-900 uppercase tracking-wider text-[11px] mb-2">
                    Specifications Matrix
                  </h4>
                  <div className="grid grid-cols-2 gap-2 bg-surface p-3 rounded-sm border border-border">
                    {Object.entries(selectedPart.specs).map(([k, v]) => (
                      <div key={k} className="p-1.5 border-b border-border/60">
                        <span className="text-[10px] text-ink-500 uppercase tracking-wider block font-semibold">
                          {k}
                        </span>
                        <span className="font-mono text-ink-900 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-ink-900 uppercase tracking-wider text-[11px] mb-2">
                    Equipment Applications
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPart.applications.map((app) => (
                      <span
                        key={app}
                        className="bg-surface-sunken border border-border text-[11px] px-2.5 py-1 rounded-xs font-medium text-ink-700"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPart.replacesChain && (
                  <div className="p-3 bg-surface-sunken border border-border rounded-xs text-[11px] space-y-1">
                    <span className="font-semibold text-ink-900 block">Supersession Chain</span>
                    {selectedPart.replacesChain.replaces && (
                      <p className="text-ink-500">
                        <strong>Replaces:</strong> {selectedPart.replacesChain.replaces}
                      </p>
                    )}
                    {selectedPart.replacesChain.replacedBy && (
                      <p className="text-ink-500">
                        <strong>Replaced By:</strong> {selectedPart.replacesChain.replacedBy}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Commercial History (Unified Timeline) */}
            {drawerTab === 'commercial' && (
              <div className="space-y-3">
                <span className="text-[11px] text-ink-500 block font-mono">
                  Full commercial memory across quotations, customer sales, supplier quotes, and purchases.
                </span>

                {partEvents.length > 0 ? (
                  <div className="divide-y divide-border border border-border rounded-sm bg-surface overflow-hidden">
                    {partEvents.map((ev) => {
                      const typeBadge = {
                        customer_quote: { label: 'Customer Quote', variant: 'primary' as const },
                        customer_sale: { label: 'Customer Sale (Inv)', variant: 'success' as const },
                        supplier_quote: { label: 'Supplier Quote', variant: 'accent' as const },
                        supplier_purchase: { label: 'Supplier PO', variant: 'neutral' as const },
                      }[ev.type];

                      return (
                        <div key={ev.id} className="p-3 flex items-center justify-between text-xs hover:bg-surface-sunken/40">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={typeBadge.variant} size="sm">
                                {typeBadge.label}
                              </Badge>
                              <span className="font-mono font-bold text-ink-900">{ev.reference}</span>
                              <span className="text-ink-500 text-[11px]">{formatDate(ev.date)}</span>
                            </div>
                            <p className="text-ink-700 font-medium">{ev.counterparty}</p>
                          </div>

                          <div className="text-right font-mono">
                            <span className="text-sm font-bold text-ink-900 block">
                              {formatMoney(ev.unitPrice, ev.currency, true)}
                            </span>
                            <span className="text-[10px] text-ink-500">
                              Qty: {ev.qty} {ev.marginPercent ? `· Margin ${ev.marginPercent}%` : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-ink-500 py-4 text-center">
                    No quotations yet for this part. Add it to your next RFQ.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Alternatives */}
            {drawerTab === 'alternatives' && (
              <div className="space-y-3 text-xs">
                {selectedPart.verifiedAlternatives.length > 0 ? (
                  selectedPart.verifiedAlternatives.map((alt) => (
                    <div
                      key={alt.partId}
                      className="p-3.5 bg-surface border border-border rounded-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-ink-900 text-sm">
                          {alt.partNumber}
                        </span>
                        <Badge variant="success" size="sm">
                          {alt.compatibilityScore}% Compatible
                        </Badge>
                      </div>
                      <p className="font-medium text-ink-900">{alt.description}</p>
                      <p className="text-[11px] text-ink-500">{alt.notes}</p>
                      <div className="pt-2 border-t border-border flex items-center justify-between text-[10.5px] text-ink-500 font-mono">
                        <span>Manufacturer: {alt.manufacturer}</span>
                        <span>Verified by {alt.verifiedBy}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-500 py-4 text-center">
                    No verified aftermarket alternatives registered for this OEM part.
                  </p>
                )}
              </div>
            )}

            {/* Tab 4: Documents */}
            {drawerTab === 'documents' && (
              <div className="space-y-2 text-xs">
                {selectedPart.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-surface border border-border rounded-sm flex items-center justify-between hover:bg-surface-sunken cursor-pointer"
                    onClick={() => addToast(`Opening ${doc.title} (Simulated)`, 'info')}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-primary" />
                      <div>
                        <span className="font-medium text-ink-900 block">{doc.title}</span>
                        <span className="text-[10px] text-ink-500 font-mono">
                          {doc.size} · Uploaded {formatDate(doc.date)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {doc.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </Drawer>

      {/* New Part Modal Form */}
      <Modal
        isOpen={isNewPartModalOpen}
        onClose={() => setIsNewPartModalOpen(false)}
        title="Add New Part to Canonical Master"
        description="Creates a new central part memory record linking OEM and alternative references."
      >
        <form onSubmit={handleCreateNewPart} className="space-y-4">
          <Input
            label="Internal Part ID (Canonical)"
            value={newPartId}
            onChange={(e) => setNewPartId(e.target.value)}
            disabled
            helperText="Auto-assigned next sequence number"
          />
          <Input
            label="Part Description"
            value={newPartDesc}
            onChange={(e) => setNewPartDesc(e.target.value)}
            placeholder="e.g. Hydraulic relief valve cartridge 210 bar"
            required
          />
          <Select
            label="Category"
            value={newPartCat}
            onChange={(e) => setNewPartCat(e.target.value)}
          >
            <option value="Drill consumables">Drill consumables</option>
            <option value="Hydraulics">Hydraulics</option>
            <option value="Filtration">Filtration</option>
            <option value="Breaker tools">Breaker tools</option>
            <option value="Undercarriage">Undercarriage</option>
            <option value="Engine">Engine</option>
          </Select>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsNewPartModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create part record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
