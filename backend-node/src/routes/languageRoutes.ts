import { Router } from 'express';
import { LanguageController } from '../controllers/languageController';

const router = Router();
const languageController = new LanguageController();

/**
 * @route GET /api/v1/languages
 * @desc Obtiene la lista de todos los idiomas disponibles
 * @access Public
 */
router.get('/', languageController.getLanguages.bind(languageController));

/**
 * @route GET /api/v1/languages/:code
 * @desc Obtiene un idioma específico por código
 * @access Public
 */
router.get('/:code', languageController.getLanguageByCode.bind(languageController));

export default router;

