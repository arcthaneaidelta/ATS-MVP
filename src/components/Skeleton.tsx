import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-meridian-surface-sunken/80 rounded ${className}`}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full space-y-3 p-4 bg-meridian-surface rounded-card border border-meridian-border">
      <div className="flex items-center justify-between pb-3 border-b border-meridian-border">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 py-2">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 ${c === 0 ? 'w-1/4' : c === cols - 1 ? 'w-16' : 'w-1/6'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
