import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware de autenticación JWT
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return void res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return void res.status(500).json({
        success: false,
        error: 'Error de configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      name?: string;
    };

    req.user = decoded;
    return void next();
  } catch (error) {
    return void res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
}

/**
 * Middleware opcional de autenticación (para endpoints que pueden funcionar con o sin usuario)
 */
export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET;

      if (secret) {
        const decoded = jwt.verify(token, secret) as {
          id: number;
          email: string;
          name?: string;
        };
        req.user = decoded;
      }
    }
    
    return void next();
  } catch (error) {
    // Si hay error en el token, simplemente continuamos sin usuario
    return void next();
  }
}
