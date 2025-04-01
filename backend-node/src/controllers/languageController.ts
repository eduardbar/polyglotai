import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { LanguageResponse, ApiResponse } from '../types';

const DEFAULT_LANGUAGES: LanguageResponse[] = [
  { id: 0, code: 'en', name: 'English', isLowResource: false },
  { id: 0, code: 'es', name: 'Español', isLowResource: false },
  { id: 0, code: 'fr', name: 'Français', isLowResource: false },
  { id: 0, code: 'de', name: 'Deutsch', isLowResource: false },
  { id: 0, code: 'ibo', name: 'Igbo', isLowResource: true },
  { id: 0, code: 'yo', name: 'Yoruba', isLowResource: true },
  { id: 0, code: 'ha', name: 'Hausa', isLowResource: true },
  { id: 0, code: 'sw', name: 'Swahili', isLowResource: true },
  { id: 0, code: 'pt', name: 'Português', isLowResource: false },
  { id: 0, code: 'it', name: 'Italiano', isLowResource: false },
];

/**
 * Controlador para manejar operaciones relacionadas con idiomas
 */
export class LanguageController {
  /**
   * Obtiene la lista de todos los idiomas disponibles
   */
  async getLanguages(req: Request, res: Response<ApiResponse<LanguageResponse[]>>): Promise<void> {
    try {
      const languages = await prisma.language.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      if (!languages || languages.length === 0) {
        return void res.json({ success: true, data: DEFAULT_LANGUAGES });
      }

      const response: LanguageResponse[] = languages.map(lang => ({
        id: lang.id,
        code: lang.code,
        name: lang.name,
        isLowResource: lang.isLowResource,
      }));

      return void res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error('Error al obtener idiomas:', error);
      // Fallback a lista por defecto
      return void res.json({ success: true, data: DEFAULT_LANGUAGES });
    }
  }

  /**
   * Obtiene un idioma específico por código
   */
  async getLanguageByCode(req: Request, res: Response<ApiResponse<LanguageResponse>>): Promise<void> {
    try {
      const { code } = req.params;

      const language = await prisma.language.findUnique({
        where: { code },
      });

      const fromDb: LanguageResponse | null = language
        ? { id: language.id, code: language.code, name: language.name, isLowResource: language.isLowResource }
        : null;

      const fromDefault = DEFAULT_LANGUAGES.find(l => l.code === code) || null;

      if (!fromDb && !fromDefault) {
        return void res.status(404).json({ success: false, error: 'Idioma no encontrado' });
      }

      return void res.json({ success: true, data: (fromDb || fromDefault)! });
    } catch (error) {
      console.error('Error al obtener idioma:', error);
      // Fallback a lista por defecto
      const { code } = req.params;
      const fallback = DEFAULT_LANGUAGES.find(l => l.code === code);
      if (fallback) {
        return void res.json({ success: true, data: fallback });
      }
      return void res.status(404).json({ success: false, error: 'Idioma no encontrado' });
    }
  }
}
