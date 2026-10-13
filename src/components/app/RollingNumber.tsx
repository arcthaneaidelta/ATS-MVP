import React from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export interface RollingNumberProps {
  formattedValue: string;
  className?: string;
}

export function RollingNumber({ formattedValue, className = '' }: RollingNumberProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <span className={`tnum ${className}`}>{formattedValue}</span>;
  }

  const chars = formattedValue.split('');

  return (
    <span className={`roll ${className}`} aria-label={formattedValue}>
      {chars.map((ch, idx) => {
        const isDigit = /\d/.test(ch);
        if (!isDigit) {
          return (
            <span key={idx} className="roll-static">
              {ch}
            </span>
          );
        }

        const digitVal = parseInt(ch, 10);
        // Stagger right to left as per PRD §7.2
        const revIdx = chars.length - 1 - idx;
        const delay = revIdx * 24;

        return (
          <span key={idx} className="roll-col">
            <span
              className="roll-strip"
              style={{
                transform: `translateY(-${digitVal * 1.1}em)`,
                transitionDelay: `${delay}ms`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
