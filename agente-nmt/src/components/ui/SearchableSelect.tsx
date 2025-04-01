'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
  nativeLabel?: string;
  isLowResource?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  showSearch?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar idioma...',
  disabled = false,
  className,
  showSearch = true,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Filtrar opciones basado en la búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (option.nativeLabel && option.nativeLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener la opción seleccionada
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'select-input w-full flex items-center justify-between text-left',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-primary-500'
        )}
      >
        <span className={cn('block truncate', !selectedOption && 'text-muted')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border rounded-xl shadow-lg max-h-80 overflow-hidden">
          {showSearch && (
            <div className="p-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-primary-50',
                  option.value === value && 'bg-primary-100 text-primary-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.isLowResource && (
                    <span className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded">
                      Bajo recurso
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
