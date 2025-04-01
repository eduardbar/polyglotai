import { Request, Response } from 'express'
import { LanguageController } from '../languageController'
import prisma from '@/utils/prisma'

// Mock de Prisma
jest.mock('@/utils/prisma', () => ({
  language: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}))

describe('LanguageController', () => {
  let languageController: LanguageController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockJson: jest.Mock
  let mockStatus: jest.Mock

  beforeEach(() => {
    languageController = new LanguageController()
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnValue({ json: mockJson })
    
    mockRequest = {}
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getLanguages', () => {
    it('should return all languages successfully', async () => {
      const mockLanguages = [
        { id: 1, code: 'en', name: 'English', isLowResource: false },
        { id: 2, code: 'es', name: 'Español', isLowResource: false },
      ]

      ;(prisma.language.findMany as jest.Mock).mockResolvedValue(mockLanguages)

      await languageController.getLanguages(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.language.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      })
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockLanguages.map(lang => ({
          id: lang.id,
          code: lang.code,
          name: lang.name,
          isLowResource: lang.isLowResource,
        })),
      })
    })

    it('should handle database error', async () => {
      const mockError = new Error('Database error')
      ;(prisma.language.findMany as jest.Mock).mockRejectedValue(mockError)

      await languageController.getLanguages(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Error interno del servidor',
      })
    })
  })

  describe('getLanguageByCode', () => {
    it('should return language by code successfully', async () => {
      const mockLanguage = {
        id: 1,
        code: 'en',
        name: 'English',
        isLowResource: false,
      }

      mockRequest.params = { code: 'en' }
      ;(prisma.language.findUnique as jest.Mock).mockResolvedValue(mockLanguage)

      await languageController.getLanguageByCode(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.language.findUnique).toHaveBeenCalledWith({
        where: { code: 'en' },
      })
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockLanguage.id,
          code: mockLanguage.code,
          name: mockLanguage.name,
          isLowResource: mockLanguage.isLowResource,
        },
      })
    })

    it('should return 404 when language not found', async () => {
      mockRequest.params = { code: 'invalid' }
      ;(prisma.language.findUnique as jest.Mock).mockResolvedValue(null)

      await languageController.getLanguageByCode(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Idioma no encontrado',
      })
    })

    it('should handle database error', async () => {
      const mockError = new Error('Database error')
      mockRequest.params = { code: 'en' }
      ;(prisma.language.findUnique as jest.Mock).mockRejectedValue(mockError)

      await languageController.getLanguageByCode(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Error interno del servidor',
      })
    })
  })
})

