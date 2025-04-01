import { Language } from '@/types';

/**
 * Lista completa de idiomas soportados para traducción
 */
export const LANGUAGES: Language[] = [
  // Idiomas principales
  { id: 1, code: 'en', name: 'English', nativeName: 'English', isLowResource: false },
  { id: 2, code: 'es', name: 'Español', nativeName: 'Español', isLowResource: false },
  { id: 3, code: 'fr', name: 'Français', nativeName: 'Français', isLowResource: false },
  { id: 4, code: 'de', name: 'Deutsch', nativeName: 'Deutsch', isLowResource: false },
  { id: 5, code: 'it', name: 'Italiano', nativeName: 'Italiano', isLowResource: false },
  { id: 6, code: 'pt', name: 'Português', nativeName: 'Português', isLowResource: false },
  { id: 7, code: 'ru', name: 'Russian', nativeName: 'Русский', isLowResource: false },
  { id: 8, code: 'ja', name: 'Japanese', nativeName: '日本語', isLowResource: false },
  { id: 9, code: 'ko', name: 'Korean', nativeName: '한국어', isLowResource: false },
  { id: 10, code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', isLowResource: false },
  
  // Idiomas africanos
  { id: 60, code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', isLowResource: true },
  { id: 65, code: 'ha', name: 'Hausa', nativeName: 'Hausa', isLowResource: true },
  { id: 66, code: 'ig', name: 'Igbo', nativeName: 'Igbo', isLowResource: true },
  { id: 67, code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', isLowResource: true },
];

export const SOURCE_LANGUAGES: Language[] = [
  { id: 0, code: 'auto', name: 'Auto-detectar', nativeName: 'Auto-detect', isLowResource: false },
  ...LANGUAGES
];

export const TARGET_LANGUAGES: Language[] = LANGUAGES;
