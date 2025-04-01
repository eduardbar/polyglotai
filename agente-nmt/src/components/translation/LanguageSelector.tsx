import React from 'react';
import { Select } from '@/components/ui/Select';
import { LanguageSelectorProps, Language } from '@/types';

/**
 * Componente selector de idioma
 */
export function LanguageSelector({
  value,
  onChange,
  placeholder = 'Seleccionar idioma',
  disabled = false,
  className,
}: LanguageSelectorProps) {
  const languages: Language[] = [
    { id: 0, code: 'auto', name: 'Auto (Detectar)', isLowResource: false },
    { id: 1, code: 'en', name: 'English', isLowResource: false },
    { id: 2, code: 'es', name: 'Español', isLowResource: false },
    { id: 3, code: 'fr', name: 'Français', isLowResource: false },
    { id: 4, code: 'de', name: 'Deutsch', isLowResource: false },
    { id: 5, code: 'it', name: 'Italiano', isLowResource: false },
    { id: 6, code: 'pt', name: 'Português', isLowResource: false },
    { id: 7, code: 'nl', name: 'Nederlands', isLowResource: false },
    { id: 8, code: 'ru', name: 'Русский', isLowResource: false },
    { id: 9, code: 'ja', name: '日本語', isLowResource: false },
    { id: 10, code: 'zh', name: '中文', isLowResource: false },
    { id: 11, code: 'ar', name: 'العربية', isLowResource: true },
    { id: 12, code: 'ibo', name: 'Igbo', isLowResource: true },
    { id: 13, code: 'yo', name: 'Yoruba', isLowResource: true },
    { id: 14, code: 'ha', name: 'Hausa', isLowResource: true },
    { id: 15, code: 'sw', name: 'Swahili', isLowResource: true },
  ];

  const options = languages.map(lang => ({
    value: lang.code,
    label: `${lang.name} ${lang.isLowResource ? '(Bajo Recurso)' : ''}`,
  }));

  return (
    <Select
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      disabled={disabled}
      className={className}
    />
  );
}
