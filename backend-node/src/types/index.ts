import { z } from 'zod';
import type { Request } from 'express';

// Esquemas de validación Zod
export const TranslationRequestSchema = z.object({
  sourceLanguage: z.string().min(1, 'Idioma de origen es requerido'),
  targetLanguage: z.string().min(1, 'Idioma de destino es requerido'),
  text: z.string().min(1, 'El texto no puede estar vacío'),
});

export const TranslationResponseSchema = z.object({
  translatedText: z.string(),
  confidenceScore: z.number().min(0).max(1),
});

export const UserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Tipos TypeScript
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;

// Tipos adicionales
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NmtServiceResponse {
  translated_text: string;
  confidence_score: number;
}

export interface LanguageResponse {
  id: number;
  code: string;
  name: string;
  isLowResource: boolean;
}
