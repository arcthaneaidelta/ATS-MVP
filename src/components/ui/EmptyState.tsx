import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[12px] border border-dashed border-[#DDD6C8] bg-[#FBF9F4]/60">
      {icon && <div className="text-[#79827D] mb-3">{icon}</div>}
      <h3 className="font-serif text-lg text-[#1F2A27] font-medium">{title}</h3>
      <p className="text-xs text-[#79827D] mt-1 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
