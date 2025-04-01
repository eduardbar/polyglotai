import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases CSS de manera inteligente usando clsx y tailwind-merge
 * @param inputs - Clases CSS a combinar
 * @returns String con las clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número de confianza (0-1) a porcentaje
 * @param score - Puntuación de confianza entre 0 y 1
 * @returns String formateado como porcentaje
 */
export function formatConfidenceScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Obtiene el color de la puntuación de confianza
 * @param score - Puntuación de confianza entre 0 y 1
 * @returns Clase CSS del color
 */
export function getConfidenceColor(score: number): string {
  if (score >= 0.8) return 'text-success';
  if (score >= 0.6) return 'text-yellow-400';
  return 'text-error';
}

/**
 * Simula un delay para mostrar estados de carga
 * @param ms - Milisegundos de delay
 * @returns Promise que se resuelve después del delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Valida si un string no está vacío
 * @param text - Texto a validar
 * @returns Boolean indicando si el texto es válido
 */
export function isValidText(text: string): boolean {
  return text.trim().length > 0;
}

/**
 * Limpia y normaliza texto para traducción
 * @param text - Texto a limpiar
 * @returns Texto limpio
 */
export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
