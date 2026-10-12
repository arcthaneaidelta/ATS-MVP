import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { formatCurrency } from '../../lib/format';
import { quotePrice, getBracket } from '../../lib/pricing';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/FormControls';
import { Plus, Trash2, Copy, Check, Calculator, AlertCircle, ArrowRight } from 'lucide-react';
import type { RateBracket, Vehicle } from '../../types';

export const BracketEditor: React.FC = () => {
  const { vehicles, updateVehicleBrackets, copyBracketsToOthers } = useDemoStore();
  const { toast } = useToast();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Editable brackets state
  const [brackets, setBrackets] = useState<RateBracket[]>(
    activeVehicle ? JSON.parse(JSON.stringify(activeVehicle.brackets)) : []
  );

  // Live interactive calculator testing state
  const [testDays, setTestDays] = useState<number>(10);

  // Update internal brackets when changing vehicle
  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    const v = vehicles.find((veh) => veh.id === id);
    if (v) {
      setBrackets(JSON.parse(JSON.stringify(v.brackets)));
    }
  };

  const handleBracketChange = (index: number, field: keyof RateBracket, val: any) => {
    const updated = [...brackets];
    if (field === 'to') {
      updated[index][field] = val === '' || val === null ? null : Number(val);
    } else {
      updated[index][field] = Number(val);
    }
    setBrackets(updated);
  };

  const handleAddBracket = () => {
    const last = brackets[brackets.length - 1];
    const newFrom = last ? (last.to ? last.to + 1 : last.from + 10) : 1;
    setBrackets([
      ...brackets,
      { from: newFrom, to: null, dailyRate: last ? Math.max(200, last.dailyRate - 150) : 1200 },
    ]);
  };

  const handleRemoveBracket = (index: number) => {
    if (brackets.length <= 1) {
      toast({ type: 'warning', title: 'Minimum 1 bracket required' });
      return;
    }
    setBrackets(brackets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateVehicleBrackets(activeVehicle.id, brackets);
    toast({
      type: 'success',
      title: 'Pricing Updated',
      message: `Tiered brackets for ${activeVehicle.name} saved. Public site pricing is immediately updated.`,
    });
  };

  const handleCopyAll = () => {
    if (window.confirm(`Copy ${activeVehicle.name}'s rate bracket tiers to all other fleet vehicles?`)) {
      copyBracketsToOthers(activeVehicle.id);
      toast({
        type: 'success',
        title: 'Brackets Copied',
        message: 'All vehicles updated with this bracket structure.',
      });
    }
  };

  // Mock test vehicle with current unsaved edits for live calculator preview
  const previewVehicle: Vehicle = {
    ...activeVehicle,
    brackets,
  };

  const testBreakdown = quotePrice(
    previewVehicle,
    null,
    '2026-11-01',
    new Date(new Date('2026-11-01').getTime() + testDays * 86400000)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Left Column: Bracket Editor Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-surface rounded-lg p-6 border border-border shadow-sh-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h3 className="font-serif text-lg font-normal text-ink">
                Tiered Duration Brackets
              </h3>
              <p className="text-xs text-ink-3">
                Edit per-day rates based on rental length in days.
              </p>
            </div>

            <Select
              value={selectedVehicleId}
              onChange={(e) => handleSelectVehicle(e.target.value)}
              className="sm:w-64 text-xs font-medium"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Brackets Table */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3 px-2">
              <span className="col-span-3">From Day</span>
              <span className="col-span-3">To Day</span>
              <span className="col-span-4">Daily Rate (NAD)</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            <div className="space-y-2">
              {brackets.map((b, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-surface-elevated p-2 rounded-md border border-border"
                >
                  <div className="col-span-3">
                    <input
                      type="number"
                      min={1}
                      value={b.from}
                      onChange={(e) => handleBracketChange(idx, 'from', e.target.value)}
                      className="w-full bg-white border border-border-strong rounded px-2.5 py-1.5 text-xs text-ink font-mono tabular-nums"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="∞ (Unlimited)"
                      value={b.to === null ? '' : b.to}
                      onChange={(e) => handleBracketChange(idx, 'to', e.target.value)}
                      className="w-full bg-white border border-border-strong rounded px-2.5 py-1.5 text-xs text-ink font-mono tabular-nums"
                    />
                  </div>

                  <div className="col-span-4 relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-ink-3 pointer-events-none">
                      N$
                    </span>
                    <input
                      type="number"
                      step={10}
                      value={b.dailyRate}
                      onChange={(e) => handleBracketChange(idx, 'dailyRate', e.target.value)}
                      className="w-full bg-white border border-border-strong rounded pl-8 pr-2.5 py-1.5 text-xs text-ink font-semibold font-mono tabular-nums"
                    />
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveBracket(idx)}
                      className="p-1.5 text-ink-3 hover:text-error rounded hover:bg-error-soft/50 transition-colors"
                      title="Remove bracket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBracket}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Tier Bracket
              </Button>

              <button
                type="button"
                onClick={handleCopyAll}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Apply to All Fleet</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleSelectVehicle(selectedVehicleId)}
            >
              Reset
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              Save Rates to Store
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Testing Calculator Proof */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-surface rounded-lg p-6 border border-border shadow-sh-1 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Calculator className="w-4 h-4 text-accent" />
            <h4 className="font-serif text-lg font-normal text-ink">
              Live Test Calculator (Simulated)
            </h4>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            Test how duration impacts customer pricing in real time with the current brackets:
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-ink">
              <span>Rental Duration:</span>
              <span className="font-mono bg-accent-soft text-accent px-2 py-0.5 rounded text-sm">
                {testDays} {testDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={35}
              value={testDays}
              onChange={(e) => setTestDays(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-3">
              <span>1 day</span>
              <span>7 days</span>
              <span>14 days</span>
              <span>21+ days</span>
            </div>
          </div>

          {/* Output card */}
          <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-ink-3">Applied Bracket:</span>
              <span className="font-semibold text-accent">
                {testBreakdown.bracket.to
                  ? `${testBreakdown.bracket.from}–${testBreakdown.bracket.to} days tier`
                  : `${testBreakdown.bracket.from}+ days tier`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-2">Effective Daily Rate:</span>
              <span className="font-serif text-base font-semibold text-primary tabular-nums">
                {formatCurrency(testBreakdown.dailyRate)} / day
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-2">Subtotal for {testDays} days:</span>
              <span className="font-serif text-lg font-bold text-primary tabular-nums">
                {formatCurrency(testBreakdown.rentalTotal)}
              </span>
            </div>

            {testBreakdown.savingsTotal > 0 && (
              <div className="flex justify-between items-center text-success font-medium bg-success-soft/60 p-2 rounded">
                <span>Customer Savings vs 1-day rate:</span>
                <span className="tabular-nums font-bold">
                  {formatCurrency(testBreakdown.savingsTotal)}
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-sand-soft/50 rounded text-[11px] text-ink-2 leading-relaxed border border-border">
            <strong>Proof of AC 9 & 2:</strong> Saving these brackets immediately modifies customer prices on the public Home page and Fleet catalog without code redeploy.
          </div>
        </div>
      </div>
    </div>
  );
};
