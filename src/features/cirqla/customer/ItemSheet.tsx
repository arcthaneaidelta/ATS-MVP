import React, { useState } from 'react';
import { MenuItem, OrderItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';

interface ItemSheetProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (orderItem: OrderItem) => void;
  accent: string;
}

export const ItemSheet: React.FC<ItemSheetProps> = ({
  item,
  onClose,
  onAddToCart,
  accent,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [instructions, setInstructions] = useState('');
  const [shakeRequired, setShakeRequired] = useState(false);

  // Check required groups
  const requiredGroups = (item.modifierGroups || []).filter((g) => g.required);
  const hasMetRequirements = requiredGroups.every((g) => !!selectedOptions[g.id]);

  // Compute total item price with modifier deltas
  let singleItemPrice = item.price;
  (item.modifierGroups || []).forEach((group) => {
    const chosenOptionId = selectedOptions[group.id];
    if (chosenOptionId) {
      const option = group.options.find((o) => o.id === chosenOptionId);
      if (option) singleItemPrice += option.priceDelta;
    }
  });
  const totalPrice = singleItemPrice * quantity;

  const handleSelectOption = (groupId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  const handleAdd = () => {
    if (!hasMetRequirements) {
      setShakeRequired(true);
      setTimeout(() => setShakeRequired(false), 400);
      return;
    }

    const modifierList: { groupName: string; optionName: string; priceDelta: number }[] = [];
    (item.modifierGroups || []).forEach((group) => {
      const chosenOptionId = selectedOptions[group.id];
      if (chosenOptionId) {
        const option = group.options.find((o) => o.id === chosenOptionId);
        if (option) {
          modifierList.push({
            groupName: group.name,
            optionName: option.name,
            priceDelta: option.priceDelta,
          });
        }
      }
    });

    onAddToCart({
      id: `cart-item-${Date.now()}-${Math.random()}`,
      menuItemId: item.id,
      name: item.name,
      price: singleItemPrice,
      quantity,
      modifiers: modifierList,
      instructions,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-40 bg-ink/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      <div className="w-full max-h-[85%] bg-elevated rounded-t-3xl border-t border-line shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 text-left">
        {/* Handle & Close */}
        <div className="p-3 border-b border-line flex items-center justify-between shrink-0 bg-surface/60">
          <div className="w-10 h-1 bg-ink/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider pt-2">
            Customise Dish
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-3 hover:text-ink rounded-full pt-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-sans">
          {/* Item Info */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-xl text-ink font-semibold">{item.name}</h3>
              <span className="font-mono text-base font-bold text-ink shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-ink-2 mt-1 leading-relaxed">{item.description}</p>
            {item.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-bg border border-line font-medium text-ink-3"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modifier Groups */}
          {(item.modifierGroups || []).map((group) => {
            const isUnmetRequired = group.required && !selectedOptions[group.id];
            return (
              <div
                key={group.id}
                className={`p-3 rounded-xl border transition-all ${
                  isUnmetRequired && shakeRequired
                    ? 'border-err bg-err-tint/40 animate-bounce'
                    : 'border-line bg-surface/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-ink text-xs">
                    {group.name}
                  </span>
                  {group.required ? (
                    <span className="text-[10px] uppercase font-bold text-clay">Required</span>
                  ) : (
                    <span className="text-[10px] text-ink-3">Optional</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions[group.id] === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-elevated border-primary text-primary font-medium'
                            : 'bg-bg/50 border-line text-ink-2 hover:bg-elevated'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={group.id}
                            checked={isSelected}
                            onChange={() => handleSelectOption(group.id, option.id)}
                            className="accent-primary"
                          />
                          <span className="text-xs">{option.name}</span>
                        </div>
                        {option.priceDelta > 0 && (
                          <span className="font-mono text-xs text-ink-3">
                            +${option.priceDelta.toFixed(2)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Special Kitchen Notes
            </label>
            <input
              type="text"
              maxLength={140}
              placeholder="e.g. dressing on the side, extra crispy..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-elevated border border-line text-xs font-sans text-ink placeholder:text-ink-3 outline-none focus:border-primary"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-line">
            <span className="text-xs font-semibold text-ink">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border border-line bg-elevated flex items-center justify-center text-ink disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full border border-line bg-elevated flex items-center justify-center text-ink"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Add to Order Button */}
        <div className="p-4 border-t border-line bg-elevated shrink-0">
          <Button
            variant="primary"
            size="md"
            block
            disabled={!hasMetRequirements}
            onClick={handleAdd}
            style={{ backgroundColor: hasMetRequirements ? accent : undefined }}
          >
            <span>
              {hasMetRequirements
                ? `Add to order · $${totalPrice.toFixed(2)}`
                : 'Choose required option'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
