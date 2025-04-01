import React from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { TextAreaPanelProps } from '@/types';

/**
 * Componente panel de área de texto para traducción
 */
export function TextAreaPanel({
  value,
  onChange,
  placeholder = 'Ingresa el texto a traducir...',
  readOnly = false,
  className,
  label,
}: TextAreaPanelProps) {
  return (
    <div className={className}>
      <TextArea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        label={label}
        rows={8}
        className="min-h-[200px]"
      />
    </div>
  );
}
