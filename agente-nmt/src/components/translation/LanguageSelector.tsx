import React from 'react';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/SearchableSelect';
import { LanguageSelectorProps } from '@/types';
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from '@/data/languages';

/**
 * Componente selector de idioma
 */
export function LanguageSelector({
  value,
  onChange,
  placeholder = 'Seleccionar idioma',
  disabled = false,
  className,
  isSource = false,
  showSearch = true,
}: LanguageSelectorProps) {
  const languages = isSource ? SOURCE_LANGUAGES : TARGET_LANGUAGES;

  const options: SearchableSelectOption[] = languages.map(lang => ({
    value: lang.code,
    label: lang.name,
    nativeLabel: lang.nativeName,
    isLowResource: lang.isLowResource,
  }));

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Buscar idioma..."
      disabled={disabled}
      className={className}
      showSearch={showSearch}
    />
  );
}
