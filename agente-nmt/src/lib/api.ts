import { TranslationRequest, TranslationResponse, Language, ApiError } from '@/types';

const API_BASE_URL = '/api'; // Usar API routes de Next.js para Vercel

/**
 * Cliente API para comunicación con el backend
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza una petición HTTP con manejo de errores
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Importante: extender primero options y luego fusionar headers para no perder Content-Type
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Intentar parsear JSON de error; si falla, leer como texto
        let message = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          message = (errorData && (errorData.error || errorData.message)) || message;
        } catch (_) {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch (_) {
            // ignorar
          }
        }
        throw new Error(message);
      }

      const json = await response.json();
      if (json && typeof json === 'object' && 'success' in json) {
        if (json.success) return json.data as T;
        throw new Error(json.error || json.message || 'Error de API');
      }
      return json as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de idiomas disponibles
   */
  async getLanguages(): Promise<Language[]> {
    return this.request<Language[]>('/languages');
  }

  /**
   * Realiza una traducción
   */
  async translate(
    request: any,
    token?: string
  ): Promise<TranslationResponse> {
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<TranslationResponse>('/translate', {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
  }

  /**
   * Obtiene el historial de traducciones del usuario
   */
  async getTranslationHistory(token: string): Promise<any[]> {
    return this.request<any[]>('/translations/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

/**
 * Función helper para manejar errores de API
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }
  
  return {
    message: 'Error desconocido',
    status: 500,
  };
}
