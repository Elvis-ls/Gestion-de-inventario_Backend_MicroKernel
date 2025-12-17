// src/plugins/auth/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';
import { JwtPayload } from '../types/jwt.types';

/**
 * Extiende la interfaz Request para incluir el usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware de autenticación JWT
 * Verifica que el request tenga un token válido
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
      return;
    }

    // Verificar y decodificar el token
    const decoded = JwtService.verifyAccessToken(token);

    // Agregar información del usuario al request
    req.user = decoded;

    // Continuar con el siguiente middleware/controlador
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error en autenticación:', error);
    
    const message = error instanceof Error ? error.message : 'Token inválido';
    
    res.status(401).json({
      success: false,
      message,
    });
  }
};

/**
 * Middleware opcional de autenticación
 * No bloquea el request si no hay token, pero lo decodifica si existe
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = JwtService.verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        // Si hay error, simplemente no añadimos el usuario
        console.warn('[AuthMiddleware] Token presente pero inválido:', error);
      }
    }

    next();
  } catch (error) {
    // En caso de error inesperado, continuar sin usuario
    next();
  }
};

/**
 * Middleware para verificar roles específicos
 * Debe usarse DESPUÉS de authenticateToken
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    const userRole = req.user.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
      return;
    }

    next();
  };
};