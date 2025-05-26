import { useState, useCallback } from 'react';
import { apiClient, handleApiError } from '@/lib/api';
import { TranslationRequest, TranslationResponse, Language, TranslationState } from '@/types';
import { cleanText, isValidText } from '@/lib/utils';

/**
 * Hook personalizado para gestionar el estado de traducción y comunicación con la API
 */
export function useTranslationApi() {
  const [state, setState] = useState<TranslationState>({
    sourceText: '',
    translatedText: '',
    isLoading: false,
    error: null,
    confidenceScore: null,
    sourceLanguage: 'en',
    targetLanguage: 'es',
  });

  const [languages, setLanguages] = useState<Language[]>([]);

  /**
   * Carga la lista de idiomas disponibles
   */
  const loadLanguages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const languagesData = await apiClient.getLanguages();
      setLanguages(languagesData);
    } catch (error) {
      const apiError = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: apiError.message,
        isLoading: false 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Actualiza el texto de origen
   */
  const setSourceText = useCallback((text: string) => {
    setState(prev => ({ 
      ...prev, 
      sourceText: text,
      error: null // Limpiar errores al cambiar el texto
    }));
  }, []);

  /**
   * Intercambia los idiomas de origen y destino
   */
  const swapLanguages = useCallback(() => {
    setState(prev => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage,
      sourceText: prev.translatedText,
      translatedText: prev.sourceText,
      error: null,
    }));
  }, []);

  /**
   * Cambia el idioma de origen
   */
  const setSourceLanguage = useCallback((language: string) => {
    setState(prev => ({ 
      ...prev, 
      sourceLanguage: language,
      error: null 
    }));
  }, []);

  /**
   * Cambia el idioma de destino
   */
  const setTargetLanguage = useCallback((language: string) => {
    setState(prev => ({ 
      ...prev, 
      targetLanguage: language,
      error: null 
    }));
  }, []);

  /**
   * Realiza la traducción
   */
  const handleTranslate = useCallback(async () => {
    const cleanedText = cleanText(state.sourceText);
    
    if (!isValidText(cleanedText)) {
      setState(prev => ({ 
        ...prev, 
        error: 'Por favor, ingresa un texto para traducir' 
      }));
      return;
    }

    if (state.sourceLanguage !== 'auto' && state.sourceLanguage === state.targetLanguage) {
      setState(prev => ({ 
        ...prev, 
        error: 'Los idiomas de origen y destino deben ser diferentes' 
      }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        translatedText: '',
        confidenceScore: null
      }));

      const request = {
        source_lang: state.sourceLanguage,
        target_lang: state.targetLanguage,
        text: cleanedText,
      };

      const response: any = await apiClient.translate(request);
      
      setState(prev => ({
        ...prev,
        translatedText: response.translatedText || response.data?.translatedText || 'Traducción no disponible',
        confidenceScore: response.confidenceScore || response.data?.confidenceScore || 0,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const apiError = handleApiError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        isLoading: false,
      }));
    }
  }, [state.sourceText, state.sourceLanguage, state.targetLanguage]);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Limpia todo el estado de traducción
   */
  const clearTranslation = useCallback(() => {
    setState(prev => ({
      ...prev,
      sourceText: '',
      translatedText: '',
      error: null,
      confidenceScore: null,
    }));
  }, []);

  return {
    // Estado
    ...state,
    languages,
    
    // Acciones
    setSourceText,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
    handleTranslate,
    loadLanguages,
    clearError,
    clearTranslation,
  };
}
