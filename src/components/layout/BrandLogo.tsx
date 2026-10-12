import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  inverted?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  inverted = false,
  className,
  size = 'md',
}) => {
  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5 group select-none', className)}
    >
      {/* Horizon road mark SVG */}
      <svg
        width={size === 'sm' ? 24 : size === 'lg' ? 36 : 28}
        height={size === 'sm' ? 24 : size === 'lg' ? 36 : 28}
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <path
          d="M6 22L16 10L26 22"
          stroke={inverted ? '#EDE6D8' : '#23302B'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22L16 16L20 22"
          stroke="#B5683A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col text-left leading-none">
        <span
          className={cn(
            'font-serif font-normal tracking-tight transition-colors',
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl',
            inverted ? 'text-white' : 'text-ink'
          )}
        >
          Future
        </span>
        <span
          className={cn(
            'text-[9px] font-semibold tracking-[0.2em] uppercase transition-colors -mt-0.5',
            inverted ? 'text-sand/80' : 'text-ink-2'
          )}
        >
          Shuttles & Rentals
        </span>
      </div>
    </Link>
  );
};
