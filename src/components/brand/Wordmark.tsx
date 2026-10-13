import React from 'react';

interface WordmarkProps {
  product?: 'bioniciq' | 'academy' | 'cirqla';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Wordmark: React.FC<WordmarkProps> = ({
  product = 'bioniciq',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 text-lg',
    md: 'h-8 text-2xl',
    lg: 'h-10 text-3xl',
  };

  if (product === 'cirqla') {
    return (
      <div className={`inline-flex items-center gap-1.5 font-sans font-semibold tracking-tight text-ink ${className}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="w-5 h-5 text-clay"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M18 18l3 3" />
        </svg>
        <span className="font-semibold tracking-tight text-ink">cirqla</span>
      </div>
    );
  }

  if (product === 'academy') {
    return (
      <div className={`inline-flex items-center gap-2 font-serif ${sizeClasses[size]} text-ink ${className}`}>
        <span className="font-serif">BionicIQ</span>
        <span className="font-sans text-xs uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-slate/10 text-slate border border-slate/20">
          Academy
        </span>
      </div>
    );
  }

  // BionicIQ Corporate
  return (
    <div className={`inline-flex items-baseline font-serif ${sizeClasses[size]} tracking-tight text-ink select-none ${className}`}>
      <span>Bion</span>
      <span className="relative inline-block">
        <span>i</span>
        {/* Clay square dot replacing the 'i' dot */}
        <span className="absolute -top-[0.18em] left-1/2 -translate-x-1/2 w-[0.24em] h-[0.24em] bg-clay rounded-[1px]" />
      </span>
      <span>c</span>
      <span className="font-sans font-semibold tracking-tighter text-primary ml-[0.05em] text-[0.88em]">IQ</span>
    </div>
  );
};
