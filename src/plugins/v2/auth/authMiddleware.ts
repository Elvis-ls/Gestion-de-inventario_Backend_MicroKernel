import { Request, Response, NextFunction } from 'express';
import { JwtService } from './JwtService';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    usuario: string;
  };
}

export class AuthMiddleware {
  /**
   * Middleware para verificar el token JWT
   */
  static authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado',
        });
        return;
      }

      // Extraer el token del header "Bearer <token>"
      const token = authHeader.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Formato de token inválido',
        });
        return;
      }

      // Verificar el token usando el método estático
      const payload = JwtService.verifyAccessToken(token);

      // Agregar la información del usuario al request
      req.user = {
        id: payload.id,
        usuario: payload.usuario,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  }

  /**
   * Middleware opcional para verificar token sin bloquear la request
   */
  static optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
          const payload = JwtService.verifyAccessToken(token);
          req.user = {
            id: payload.id,
            usuario: payload.usuario,
          };
        }
      }
      next();
    } catch (error) {
      // En caso de error, simplemente continúa sin usuario autenticado
      next();
    }
  }
}