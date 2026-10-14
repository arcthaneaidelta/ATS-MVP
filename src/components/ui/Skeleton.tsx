import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`bg-[#E2DDD3]/60 rounded-md animate-pulse ${className}`}
      style={{ animationDuration: '1.4s' }}
    />
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 6 }) => {
  return (
    <tr className="border-b border-[#E2DDD3]/60 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 bg-[#E2DDD3]/70 rounded w-4/5" />
        </td>
      ))}
    </tr>
  );
};
