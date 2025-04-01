import { TranslationRequest, TranslationResponse, NmtServiceResponse } from '../types';

/**
 * Servicio de traducción que orquesta la comunicación con el servicio NMT
 */
export class TranslationService {
  private nmtServiceUrl: string;

  constructor() {
    this.nmtServiceUrl = process.env.NMT_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Realiza una traducción llamando al servicio NMT
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${this.nmtServiceUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          source_lang: request.sourceLanguage,
          target_lang: request.targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error del servicio NMT: ${response.status} ${response.statusText}`);
      }

      const json = (await response.json()) as unknown;
      const nmtResponse = json as NmtServiceResponse;

      return {
        translatedText: nmtResponse.translated_text,
        confidenceScore: nmtResponse.confidence_score,
      };
    } catch (error) {
      console.error('Error en servicio de traducción:', error);
      throw new Error('Error al comunicarse con el servicio de traducción');
    }
  }

  /**
   * Valida que los idiomas sean diferentes
   */
  validateLanguages(sourceLanguage: string, targetLanguage: string): void {
    if (sourceLanguage === targetLanguage) {
      throw new Error('Los idiomas de origen y destino deben ser diferentes');
    }
  }

  /**
   * Valida que el texto no esté vacío
   */
  validateText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new Error('El texto no puede estar vacío');
    }
  }
}
