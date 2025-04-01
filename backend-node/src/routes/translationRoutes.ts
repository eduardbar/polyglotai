import { Router } from 'express';
import { TranslationController } from '../controllers/translationController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();
const translationController = new TranslationController();

/**
 * @route POST /api/v1/translate
 * @desc Realiza una traducción
 * @access Public (con autenticación opcional para guardar historial)
 */
router.post('/translate', optionalAuthMiddleware, translationController.translate.bind(translationController));

/**
 * @route GET /api/v1/translations/history
 * @desc Obtiene el historial de traducciones del usuario
 * @access Private
 */
router.get('/translations/history', authMiddleware, translationController.getTranslationHistory.bind(translationController));

export default router;

