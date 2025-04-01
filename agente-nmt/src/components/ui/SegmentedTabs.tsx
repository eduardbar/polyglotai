import React from 'react';
import { cn } from '@/lib/utils';

export type SegmentOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

interface SegmentedTabsProps {
  options: SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SegmentedTabs({ options, value, onChange, className }: SegmentedTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-md',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={opt.disabled}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative px-4 py-2 rounded-full text-sm transition-all duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              active
                ? 'bg-white/15 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
                : 'text-text-secondary hover:text-white hover:bg-white/10'
            )}
            title={typeof opt.label === 'string' ? opt.label : undefined}
          >
            <span className="inline-flex items-center gap-2">
              {opt.icon}
              <span>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}


