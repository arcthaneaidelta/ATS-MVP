import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { formatCurrency } from '../../lib/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/FormControls';
import { ShieldCheck, Edit3, Check, Plus, Trash2 } from 'lucide-react';
import type { InsurancePackage } from '../../types';

export const InsuranceEditor: React.FC = () => {
  const { insurance, updateInsurancePackage } = useDemoStore();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dailyPrice, setDailyPrice] = useState(0);
  const [excess, setExcess] = useState(0);
  const [description, setDescription] = useState('');

  const handleStartEdit = (pkg: InsurancePackage) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setDailyPrice(pkg.dailyPrice);
    setExcess(pkg.excess);
    setDescription(pkg.description);
  };

  const handleSave = (pkgId: string) => {
    updateInsurancePackage(pkgId, {
      name,
      dailyPrice,
      excess,
      description,
    });
    setEditingId(null);
    toast({
      type: 'success',
      title: 'Package Updated',
      message: `${name} policy terms saved.`,
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-surface p-4 rounded-lg border border-border">
        <h3 className="font-serif text-lg font-normal text-ink">
          Insurance & Damage Waiver Packages
        </h3>
        <p className="text-xs text-ink-3">
          Configure daily cover rates, customer excess limits, and liability terms reflected across the checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insurance.map((pkg) => {
          const isEditing = editingId === pkg.id;

          return (
            <div
              key={pkg.id}
              className="bg-surface rounded-lg p-5 border border-border shadow-sh-1 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {pkg.popular ? 'Recommended' : 'Cover Option'}
                  </span>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(pkg)}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 text-xs">
                    <Input
                      label="Package Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Daily Price (NAD)"
                      type="number"
                      value={dailyPrice}
                      onChange={(e) => setDailyPrice(Number(e.target.value))}
                    />
                    <Input
                      label="Customer Excess (NAD)"
                      type="number"
                      value={excess}
                      onChange={(e) => setExcess(Number(e.target.value))}
                    />
                    <Textarea
                      label="Policy Description"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => handleSave(pkg.id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-serif text-xl font-normal text-ink">{pkg.name}</h4>
                    <p className="text-xs text-ink-2 leading-relaxed">{pkg.description}</p>

                    <div className="p-3 bg-surface-elevated rounded border border-border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-3">Daily Fee:</span>
                        <span className="font-serif font-bold text-primary tabular-nums">
                          {formatCurrency(pkg.dailyPrice)}/day
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-3">Customer Excess:</span>
                        <span className="font-bold text-ink tabular-nums">
                          {pkg.excess === 0 ? 'N$0 (Zero)' : formatCurrency(pkg.excess)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 text-xs text-ink-2">
                      <div className="font-semibold text-[11px] uppercase tracking-wider text-ink-3">
                        Included Protection
                      </div>
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                          <span className="text-[11px]">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
