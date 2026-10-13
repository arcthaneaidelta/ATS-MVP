import React, { useState } from 'react';
import { useCirqlaStore } from '../../../store/cirqla';
import { MenuItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Toggle } from '../../../components/ui/Toggle';
import { useToast } from '../../../components/ui/Toast';
import {
  Upload,
  Plus,
  Trash2,
  Copy,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';

export const MenuManagerPage: React.FC = () => {
  const { menuItems, activeTenantId, toggleItemSoldOut, updateMenuItem, addMenuItem } = useCirqlaStore();
  const { toast } = useToast();

  const items = menuItems[activeTenantId] || [];
  const categories = ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks'];

  const [selectedCategory, setSelectedCategory] = useState<string>('Starters');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [csvStep, setCsvStep] = useState<number>(1);
  const [branchPriceScope, setBranchPriceScope] = useState<'All' | 'Central' | 'Riverside' | 'Airport'>('All');

  const filteredItems = items.filter((it) => it.category === selectedCategory);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    updateMenuItem(activeTenantId, selectedItem);
    toast(`Saved updates for ${selectedItem.name}`, 'success');
  };

  const handleAddNewItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'New Seasonal Special',
      description: 'Chef seasonal selection with local ingredients.',
      category: selectedCategory as any,
      price: 15.00,
      tags: ['GF'],
      modifierGroups: [],
    };
    addMenuItem(activeTenantId, newItem);
    setSelectedItem(newItem);
    toast('Added new menu item', 'success');
  };

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Menu Engineering & Branches
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Manage live pricing, modifier groups, and instantaneous branch-level sold out toggles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowCsvModal(true);
              setCsvStep(1);
            }}
            icon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Import Menu (CSV)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddNewItem}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Main 3-Column Manager Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Col 1: Categories List (2 cols) */}
        <div className="lg:col-span-3 bg-surface rounded-2xl border border-line p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider px-3 block mb-2">
            Categories
          </span>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedItem(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-elevated font-semibold text-primary border border-line shadow-xs'
                    : 'text-ink-2 hover:bg-bg hover:text-ink'
                }`}
              >
                <span>{cat}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-bg text-ink-3">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Col 2: Items in Category (4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-2xl border border-line p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              {selectedCategory} Items ({filteredItems.length})
            </span>
            <span className="text-[10px] text-ink-3">Live Status</span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isEditing = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                    isEditing
                      ? 'bg-elevated border-primary shadow-sm'
                      : 'bg-elevated border-line hover:border-line-2'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-serif text-base font-semibold text-ink truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-ink-3 line-clamp-1">{item.description}</p>
                    </div>
                    <span className="font-mono font-bold text-xs text-ink shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                    <span className="text-[10px] text-ink-3">
                      {item.isSoldOut ? (
                        <span className="text-err font-bold">SOLD OUT</span>
                      ) : (
                        <span className="text-ok font-medium">AVAILABLE</span>
                      )}
                    </span>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5"
                    >
                      <Toggle
                        checked={!item.isSoldOut}
                        onChange={() => {
                          toggleItemSoldOut(activeTenantId, item.id);
                          toast(
                            `${item.name} marked ${!item.isSoldOut ? 'Sold out' : 'Available'}`,
                            'info'
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: Edit Item Panel (5 cols) */}
        <div className="lg:col-span-5 bg-elevated rounded-2xl border border-line p-6 shadow-sm space-y-5">
          {selectedItem ? (
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <span className="text-[10px] uppercase font-bold text-clay tracking-wider">
                    Item Editor
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink">{selectedItem.name}</h3>
                </div>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>

              {/* Branch price overrides bar */}
              <div className="p-2.5 rounded-lg bg-bg border border-line space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-ink-3 block">
                  Branch Price Scope
                </span>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {['All', 'Central', 'Riverside', 'Airport'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranchPriceScope(b as any)}
                      className={`py-1 rounded border text-center font-medium ${
                        branchPriceScope === b
                          ? 'bg-elevated border-primary text-primary font-bold'
                          : 'bg-surface border-line text-ink-3'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Item Name"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
              />

              <Textarea
                label="Menu Description"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, description: e.target.value })
                }
                charCount={selectedItem.description.length}
                maxChars={140}
                rows={3}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price ($ USD)"
                  type="number"
                  step="0.25"
                  value={selectedItem.price}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5">
                    Category
                  </label>
                  <select
                    value={selectedItem.category}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full h-11 px-3 bg-elevated border border-line-2 rounded-md text-xs font-sans text-ink outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modifier Groups Summary */}
              <div className="p-3 rounded-xl bg-surface border border-line space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-ink">
                    Modifier Groups ({selectedItem.modifierGroups?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newMod = {
                        id: `mod-${Date.now()}`,
                        name: 'Serving Options',
                        required: false,
                        options: [
                          { id: `opt-${Date.now()}-1`, name: 'Standard', priceDelta: 0 },
                          { id: `opt-${Date.now()}-2`, name: 'Extra Large', priceDelta: 2.0 },
                        ],
                      };
                      setSelectedItem({
                        ...selectedItem,
                        modifierGroups: [...(selectedItem.modifierGroups || []), newMod],
                      });
                    }}
                    className="text-xs text-clay hover:underline font-medium"
                  >
                    + Add Group
                  </button>
                </div>

                {(selectedItem.modifierGroups || []).map((grp) => (
                  <div key={grp.id} className="p-2 rounded bg-bg border border-line text-xs flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-ink">{grp.name}</span>
                      <span className="text-ink-3 ml-1.5 text-[10px]">
                        ({grp.required ? 'Required' : 'Optional'}, {grp.options.length} options)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="py-24 text-center text-ink-3 space-y-2">
              <p className="text-xs">Select any menu item from the list to modify pricing and modifiers.</p>
              <p className="text-[11px] text-ink-3/70">Changes apply immediately to diner QR apps.</p>
            </div>
          )}
        </div>
      </div>

      {/* CSV Bulk Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-elevated rounded-2xl border border-line p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-clay" />
                <h3 className="font-serif text-lg font-bold text-ink">
                  Bulk Menu Import (CSV Pipeline)
                </h3>
              </div>
              <button onClick={() => setShowCsvModal(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>

            {csvStep === 1 && (
              <div className="space-y-4 text-xs text-ink-2">
                <p>
                  Demonstrates bulk ingestion tooling for onboarding multi-location restaurant chains without manual data entry.
                </p>
                <div className="p-6 border-2 border-dashed border-line rounded-xl text-center space-y-2 bg-surface/50">
                  <Upload className="w-6 h-6 text-ink-3 mx-auto" />
                  <p className="font-semibold text-ink">Attach items_export_2026.csv</p>
                  <p className="text-[11px] text-ink-3">24 items detected across 5 categories</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => setCsvStep(2)}>
                    Map Columns & Validate →
                  </Button>
                </div>
              </div>
            )}

            {csvStep === 2 && (
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-ink block">Validation Preview (2 Errors Found)</span>
                <div className="border border-line rounded-lg overflow-hidden font-mono text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-surface text-ink-3 border-b border-line">
                      <tr>
                        <th className="p-2">Item Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      <tr>
                        <td className="p-2">Truffle Arancini</td>
                        <td className="p-2">Starters</td>
                        <td className="p-2">$11.00</td>
                        <td className="p-2 text-ok font-semibold">Valid</td>
                      </tr>
                      <tr className="bg-err-tint/40">
                        <td className="p-2">Dry-Aged Ribeye</td>
                        <td className="p-2">Mains</td>
                        <td className="p-2 text-err font-bold">MISSING</td>
                        <td className="p-2 text-err font-semibold">Invalid Price</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between pt-3">
                  <Button variant="ghost" size="sm" onClick={() => setCsvStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setShowCsvModal(false);
                      toast('Imported 22 validated menu items successfully!', 'success');
                    }}
                  >
                    Import Validated Rows
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
