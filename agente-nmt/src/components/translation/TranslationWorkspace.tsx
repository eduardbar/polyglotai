'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from './LanguageSelector';
import { TextAreaPanel } from './TextAreaPanel';
import { ConfidenceGauge } from '@/components/analytics/ConfidenceGauge';
import { useTranslationApi } from '@/hooks/useTranslationApi';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Componente principal del espacio de trabajo de traducción
 */
export function TranslationWorkspace() {
  const {
    // Estado
    sourceText,
    translatedText,
    isLoading,
    error,
    confidenceScore,
    sourceLanguage,
    targetLanguage,
    languages,
    
    // Acciones
    setSourceText,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
    handleTranslate,
    loadLanguages,
    clearError,
  } = useTranslationApi();

  // Cargar idiomas al montar el componente
  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Función para copiar texto traducido
  const copyToClipboard = async () => {
    if (translatedText) {
      try {
        await navigator.clipboard.writeText(translatedText);
        // Aquí podrías mostrar una notificación de éxito
      } catch (err) {
        console.error('Error al copiar texto:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Contenedor principal con glassmorphism */}
      <div className="glass-card p-8 animate-fade-in">
        {/* Acciones y selectores de idioma */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <LanguageSelector
              value={sourceLanguage}
              onChange={setSourceLanguage}
              placeholder="Idioma de origen"
              className="flex-1"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={swapLanguages}
              className="p-2"
              title="Intercambiar idiomas"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
            
            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
              placeholder="Idioma de destino"
              className="flex-1"
            />
          </div>
        </div>

        {/* Área principal de traducción */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Panel de texto de origen */}
          <div className="space-y-2">
            <TextAreaPanel
              value={sourceText}
              onChange={setSourceText}
              placeholder="Escribe o pega el texto que quieres traducir..."
              label="Texto de origen"
            />
          </div>

          {/* Panel de texto traducido */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-secondary tracking-wide">
                Traducción
              </label>
              {translatedText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="p-2 text-text-secondary hover:text-white"
                  title="Copiar traducción"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="w-full px-4 py-3 glass-card min-h-[200px] animate-shimmer">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ) : (
              <TextAreaPanel
                value={translatedText}
                readOnly
                placeholder="La traducción aparecerá aquí..."
                className="min-h-[200px]"
              />
            )}
          </div>
        </div>

        {/* Botón de traducción */}
        <div className="flex justify-center mb-10">
          <Button
            onClick={handleTranslate}
            loading={isLoading}
            disabled={!sourceText.trim() || isLoading || sourceLanguage === targetLanguage}
            size="lg"
            className="px-12 btn-primary"
          >
            {isLoading ? 'Traduciendo...' : 'Traducir'}
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 glass-card border border-red-500/30">
            <p className="text-error text-sm font-medium">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="mt-2 text-text-secondary hover:text-white"
            >
              Cerrar
            </Button>
          </div>
        )}

        {/* Medidor de confianza */}
        {confidenceScore !== null && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl col-span-1">
              <ConfidenceGauge score={confidenceScore} size={150} />
            </div>
            <div className="glass-card p-6 rounded-xl col-span-1 hidden lg:block">
              <p className="text-text-secondary text-sm">Ejemplos</p>
            </div>
            <div className="glass-card p-6 rounded-xl col-span-1 hidden lg:block">
              <p className="text-text-secondary text-sm">Definiciones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
