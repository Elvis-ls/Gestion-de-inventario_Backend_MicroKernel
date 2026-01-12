import { Request, Response, NextFunction } from 'express';
import { JwtService, TokenPayload } from './JwtService';

// Extender la interfaz de Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export class AuthMiddleware {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  /**
   * Middleware para verificar JWT en las peticiones
   */
  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado o formato inválido'
        });
        return;
      }

      const token = authHeader.substring(7); // Remover "Bearer "
      const payload = this.jwtService.verifyAccessToken(token);

      // Agregar información del usuario al request
      req.user = payload;

      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'TOKEN_EXPIRED') {
          res.status(401).json({
            success: false,
            message: 'Token expirado',
            code: 'TOKEN_EXPIRED'
          });
          return;
        }

        if (error.message === 'INVALID_TOKEN') {
          res.status(401).json({
            success: false,
            message: 'Token inválido',
            code: 'INVALID_TOKEN'
          });
          return;
        }
      }

      res.status(401).json({
        success: false,
        message: 'Error de autenticación'
      });
    }
  };

  /**
   * Middleware opcional para verificar JWT (no falla si no hay token)
   */
  optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = this.jwtService.verifyAccessToken(token);
        req.user = payload;
      }

      next();
    } catch {
      // Ignorar errores y continuar sin usuario
      next();
    }
  };
}

// Exportar instancia única
export const authMiddleware = new AuthMiddleware();