import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatAddress } from '../../lib/format';

export interface AddressFieldProps {
  address: string;
  isTruncated?: boolean;
  label?: string;
  className?: string;
}

export const AddressField: React.FC<AddressFieldProps> = ({
  address,
  isTruncated = true,
  label,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const displayText = isTruncated ? formatAddress(address, 8, 6) : address;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F]">
          {label}
        </span>
      )}
      <div className="inline-flex items-center justify-between gap-2 px-3 py-2 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs font-mono text-[#1B2420]">
        <span className="select-all break-all">{displayText}</span>
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Copied to clipboard' : 'Copy address'}
          className="relative p-1 text-[#7C867F] hover:text-[#1B2420] rounded hover:bg-[#DDD8CD] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-[#3E7D5A] font-sans font-medium text-[11px]">
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
