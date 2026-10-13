import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  asButton?: boolean;
  isDemo?: boolean;
  demoTag?: string;
}

export function Chip({
  asButton = false,
  isDemo = false,
  demoTag = 'Demo',
  children,
  className = '',
  ...props
}: ChipProps) {
  const Comp = asButton ? 'button' : 'div';
  return (
    <Comp
      className={`chip ${isDemo ? 'chip-demo' : ''} ${className}`}
      {...(asButton ? { type: 'button' as const } : {})}
      {...props}
    >
      {isDemo && <span className="chip-demo-tag">{demoTag}</span>}
      {children}
    </Comp>
  );
}
