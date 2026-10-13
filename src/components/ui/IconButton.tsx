import React, { forwardRef } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <button ref={ref} className={`icon-btn ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
