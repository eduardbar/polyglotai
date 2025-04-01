import { z } from 'zod';

// Esquemas Zod para validación
export const LanguageSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  isLowResource: z.boolean().default(true),
});

export const TranslationRequestSchema = z.object({
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  text: z.string().min(1, 'El texto no puede estar vacío'),
});

export const TranslationResponseSchema = z.object({
  translatedText: z.string(),
  confidenceScore: z.number().min(0).max(1),
});

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TranslationHistorySchema = z.object({
  id: z.number(),
  sourceText: z.string(),
  translatedText: z.string(),
  confidenceScore: z.number().min(0).max(1).optional(),
  userId: z.number(),
  sourceLanguageId: z.number(),
  targetLanguageId: z.number(),
  createdAt: z.date(),
});

// Tipos TypeScript derivados de los esquemas
export type Language = z.infer<typeof LanguageSchema>;
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type TranslationHistory = z.infer<typeof TranslationHistorySchema>;

// Tipos adicionales para la aplicación
export interface TranslationState {
  sourceText: string;
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  confidenceScore: number | null;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Tipos para el componente de confianza
export interface ConfidenceGaugeProps {
  score: number; // 0-1
  size?: number;
  className?: string;
}

// Tipos para los selectores de idioma
export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Tipos para el área de texto
export interface TextAreaPanelProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  label?: string;
}
