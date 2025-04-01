import { Request, Response } from 'express';
import { TranslationRequestSchema, TranslationRequest, TranslationResponse, ApiResponse, AuthenticatedRequest } from '../types';
import { TranslationService } from '../services/translationService';
import prisma from '../utils/prisma';

/**
 * Controlador para manejar operaciones de traducción
 */
export class TranslationController {
  private translationService: TranslationService;

  constructor() {
    this.translationService = new TranslationService();
  }

  /**
   * Realiza una traducción
   */
  async translate(req: AuthenticatedRequest, res: Response<ApiResponse<TranslationResponse>>): Promise<void> {
    try {
      // Validar entrada con Zod
      const validationResult = TranslationRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return void res.status(400).json({
          success: false,
          error: validationResult.error.errors[0].message,
        });
      }

      const { sourceLanguage, targetLanguage, text } = validationResult.data;

      // Validaciones adicionales
      this.translationService.validateLanguages(sourceLanguage, targetLanguage);
      this.translationService.validateText(text);

      // Realizar traducción
      const translationResult = await this.translationService.translate({
        sourceLanguage,
        targetLanguage,
        text,
      });

      // Guardar en historial si hay usuario autenticado
      if (req.user) {
        try {
          // Obtener IDs de idiomas
          const sourceLang = await prisma.language.findUnique({
            where: { code: sourceLanguage },
          });
          const targetLang = await prisma.language.findUnique({
            where: { code: targetLanguage },
          });

          if (sourceLang && targetLang) {
            await prisma.translationHistory.create({
              data: {
                sourceText: text,
                translatedText: translationResult.translatedText,
                confidenceScore: translationResult.confidenceScore,
                userId: req.user.id,
                sourceLanguageId: sourceLang.id,
                targetLanguageId: targetLang.id,
              },
            });
          }
        } catch (error) {
          console.error('Error al guardar en historial:', error);
          // No fallamos la traducción si falla el guardado del historial
        }
      }

      return void res.json({
        success: true,
        data: translationResult,
      });
    } catch (error) {
      console.error('Error en traducción:', error);
      
      if (error instanceof Error) {
        return void res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      return void res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  }

  /**
   * Obtiene el historial de traducciones del usuario
   */
  async getTranslationHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return void res.status(401).json({
          success: false,
          error: 'Usuario no autenticado',
        });
      }

      const history = await prisma.translationHistory.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          sourceLanguage: true,
          targetLanguage: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Limitar a las últimas 50 traducciones
      });

      const response = history.map(item => ({
        id: item.id,
        sourceText: item.sourceText,
        translatedText: item.translatedText,
        confidenceScore: item.confidenceScore,
        sourceLanguage: item.sourceLanguage.code,
        targetLanguage: item.targetLanguage.code,
        createdAt: item.createdAt,
      }));

      return void res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return void res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  }
}
