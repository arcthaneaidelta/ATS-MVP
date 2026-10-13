import React from 'react';

/**
 * Deterministic muted tint chosen from 6 tints derived from sage/clay/sand/slate.
 * Monogram tile (36px or 56px, first letter, Fraunces 500).
 */
const TINTS = [
  { bg: '#E3EDE9', text: '#2F5D55' }, // sage
  { bg: '#F6E4DC', text: '#B4543A' }, // clay
  { bg: '#EFECE5', text: '#4F5B5C' }, // sand
  { bg: '#E1ECF2', text: '#3F6F8F' }, // slate
  { bg: '#F7ECD4', text: '#8A5A12' }, // warm amber
  { bg: '#EAE6DF', text: '#1E2A2B' }, // deep paper
];

export function getMerchantTint(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  const index = Math.abs(hash) % TINTS.length;
  return TINTS[index];
}

export interface MerchantTileProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MerchantTile({ name, size = 'md', className = '' }: MerchantTileProps) {
  const initial = (name.trim()[0] || 'S').toUpperCase();
  const tint = getMerchantTint(name);

  let dimClass = 'w-9 h-9 text-base rounded-[10px]'; // 36px default
  if (size === 'sm') dimClass = 'w-7 h-7 text-xs rounded-sm';
  if (size === 'lg') dimClass = 'w-14 h-14 text-2xl rounded-md'; // 56px for detail

  return (
    <div
      className={`flex items-center justify-center font-display font-medium select-none flex-shrink-0 ${dimClass} ${className}`}
      style={{ backgroundColor: tint.bg, color: tint.text }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
