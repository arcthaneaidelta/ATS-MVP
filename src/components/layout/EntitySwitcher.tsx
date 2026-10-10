import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { ENTITIES } from '../../config/brand';
import { ChevronDown, Globe, Building2, Check, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export function EntitySwitcher() {
  const { currentEntity, setEntity, addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = ENTITIES[currentEntity] || ENTITIES['peru'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    setEntity(key as any);
    setIsOpen(false);
    addToast(`Switched active entity: ${ENTITIES[key].name}`, 'info');
  };

  const getDotColor = (code: string) => {
    if (code === 'PE') return 'bg-[#B4713B]'; // Copper accent for Peru
    if (code === 'ZM') return 'bg-[#3F7A5B]'; // Green for Zambia
    if (code === 'INT') return 'bg-[#3F6B8A]'; // Blue for Intl
    return 'bg-ink-700';
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-sm border border-border bg-surface hover:bg-surface-sunken transition-colors text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={clsx('w-2 h-2 rounded-full shrink-0', getDotColor(active.countryCode))} />
          <div className="truncate">
            <span className="text-xs font-semibold text-ink-900 block truncate">
              {active.shortName}
            </span>
            <span className="text-[10px] text-ink-500 font-mono block">
              {active.baseCurrency} · {active.prefix}
            </span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-ink-500 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-surface-elevated rounded-sm border border-border shadow-md py-1 text-xs">
          <div className="px-3 py-1.5 border-b border-border text-[10px] uppercase font-bold tracking-wider text-ink-500 flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-primary" />
            <span>Select Operating Entity</span>
          </div>

          {Object.entries(ENTITIES).map(([key, item]) => {
            const isSelected = key === currentEntity;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(key)}
                className={clsx(
                  'w-full text-left px-3 py-2 flex items-center justify-between transition-colors hover:bg-surface-sunken',
                  isSelected && 'bg-primary-tint/60 text-primary font-medium'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={clsx('w-2 h-2 rounded-full shrink-0', getDotColor(item.countryCode))} />
                  <div className="truncate">
                    <p className="font-semibold text-xs text-ink-900 leading-tight">
                      {item.shortName}
                    </p>
                    <p className="text-[10.5px] text-ink-500 font-mono">
                      {item.country} · {item.baseCurrency}
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}

          {currentEntity === 'consolidated' && (
            <div className="p-2 border-t border-border bg-surface-sunken/60 text-[10.5px] text-ink-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Consolidated is read-only for document creation</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
