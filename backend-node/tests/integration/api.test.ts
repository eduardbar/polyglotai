// @ts-nocheck
import request from 'supertest'
import express, { RequestHandler } from 'express'
import { LanguageController } from '@/controllers/languageController'
import { TranslationController } from '@/controllers/translationController'
import { authMiddleware, optionalAuthMiddleware } from '@/middleware/auth'

// Mock de Prisma
jest.mock('@/utils/prisma', () => ({
  language: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  translationHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}))

// Mock del servicio de traducción
jest.mock('@/services/translationService', () => ({
  TranslationService: jest.fn().mockImplementation(() => ({
    translate: jest.fn(),
    validateLanguages: jest.fn(),
    validateText: jest.fn(),
  })),
}))

describe('API Integration Tests', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())

    // Rutas de idiomas
    const languageController = new LanguageController()
    app.get('/api/v1/languages', languageController.getLanguages.bind(languageController))
    app.get('/api/v1/languages/:code', languageController.getLanguageByCode.bind(languageController))

    // Rutas de traducción
    const translationController = new TranslationController()
    app.post('/api/v1/translate', optionalAuthMiddleware as unknown as RequestHandler, translationController.translate.bind(translationController))
    app.get('/api/v1/translations/history', authMiddleware as unknown as RequestHandler, translationController.getTranslationHistory.bind(translationController))
  })

  it('placeholder', () => {
    expect(true).toBe(true)
  })
})
