import { TranslationService } from '../translationService'
import { TranslationRequest } from '@/types'

// Mock de fetch global
global.fetch = jest.fn()

describe('TranslationService', () => {
  let translationService: TranslationService

  beforeEach(() => {
    translationService = new TranslationService()
    jest.clearAllMocks()
  })

  describe('translate', () => {
    it('should translate text successfully', async () => {
      const mockResponse = {
        translated_text: 'Hola mundo',
        confidence_score: 0.85,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      })

      const request: TranslationRequest = {
        sourceLanguage: 'en',
        targetLanguage: 'es',
        text: 'Hello world',
      }

      const result = await translationService.translate(request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/translate'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Hello world',
            source_lang: 'en',
            target_lang: 'es',
          }),
        }
      )

      expect(result).toEqual({
        translatedText: 'Hola mundo',
        confidenceScore: 0.85,
      })
    })

    it('should handle NMT service error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const request: TranslationRequest = {
        sourceLanguage: 'en',
        targetLanguage: 'es',
        text: 'Hello world',
      }

      await expect(translationService.translate(request)).rejects.toThrow(
        'Error al comunicarse con el servicio de traducción'
      )
    })

    it('should handle network error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const request: TranslationRequest = {
        sourceLanguage: 'en',
        targetLanguage: 'es',
        text: 'Hello world',
      }

      await expect(translationService.translate(request)).rejects.toThrow(
        'Error al comunicarse con el servicio de traducción'
      )
    })
  })

  describe('validateLanguages', () => {
    it('should not throw error for different languages', () => {
      expect(() => {
        translationService.validateLanguages('en', 'es')
      }).not.toThrow()
    })

    it('should throw error for same languages', () => {
      expect(() => {
        translationService.validateLanguages('en', 'en')
      }).toThrow('Los idiomas de origen y destino deben ser diferentes')
    })
  })

  describe('validateText', () => {
    it('should not throw error for valid text', () => {
      expect(() => {
        translationService.validateText('Hello world')
      }).not.toThrow()
    })

    it('should throw error for empty text', () => {
      expect(() => {
        translationService.validateText('')
      }).toThrow('El texto no puede estar vacío')
    })

    it('should throw error for whitespace only text', () => {
      expect(() => {
        translationService.validateText('   ')
      }).toThrow('El texto no puede estar vacío')
    })

    it('should throw error for null text', () => {
      expect(() => {
        translationService.validateText(null as any)
      }).toThrow('El texto no puede estar vacío')
    })
  })
})

