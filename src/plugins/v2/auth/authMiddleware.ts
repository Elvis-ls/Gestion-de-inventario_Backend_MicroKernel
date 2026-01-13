import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        usuario: string;
        rol: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta', (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Error en authenticateToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar el token'
    });
  }
};