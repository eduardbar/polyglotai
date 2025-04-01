"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const languageController_1 = require("@/controllers/languageController");
const translationController_1 = require("@/controllers/translationController");
const auth_1 = require("@/middleware/auth");
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
}));
jest.mock('@/services/translationService', () => ({
    TranslationService: jest.fn().mockImplementation(() => ({
        translate: jest.fn(),
        validateLanguages: jest.fn(),
        validateText: jest.fn(),
    })),
}));
describe('API Integration Tests', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const languageController = new languageController_1.LanguageController();
        app.get('/api/v1/languages', languageController.getLanguages.bind(languageController));
        app.get('/api/v1/languages/:code', languageController.getLanguageByCode.bind(languageController));
        const translationController = new translationController_1.TranslationController();
        app.post('/api/v1/translate', auth_1.optionalAuthMiddleware, translationController.translate.bind(translationController));
        app.get('/api/v1/translations/history', auth_1.authMiddleware, translationController.getTranslationHistory.bind(translationController));
    });
    it('placeholder', () => {
        expect(true).toBe(true);
    });
});
//# sourceMappingURL=api.test.js.map