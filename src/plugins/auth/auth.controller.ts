// src/plugins/auth/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from './services/jwt.service';

/**
 * Controlador de Autenticación con JWT
 * Maneja las peticiones HTTP relacionadas con autenticación
 */
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * POST /api/auth/login
   * Inicia sesión y devuelve tokens JWT
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, contrasena } = req.body;

      // Validar datos requeridos
      if (!usuario || !contrasena) {
        res.status(400).json({
          success: false,
          message: 'El usuario y la contraseña son requeridos',
        });
        return;
      }

      // Autenticar usuario
      const admin = await this.service.login(usuario, contrasena);

      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }

      // Generar tokens JWT
      const tokens = JwtService.generateTokens(
        admin.idadmin,
        admin.usuario,
        // Puedes añadir email si lo tienes en tu tabla
      );

      // Respuesta exitosa con tokens
      res.json({
        success: true,
        data: {
          user: {
            id: admin.idadmin,
            usuario: admin.usuario,
            nombreapellido: admin.nombreapellido,
            numero: admin.numero,
          },
          tokens,
        },
        message: 'Inicio de sesión exitoso',
      });

    } catch (error) {
      console.error('[AuthController] Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor',
      });
    }
  };

  /**
   * POST /api/auth/refresh
   * Refresca el access token usando un refresh token válido
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requerido',
        });
        return;
      }

      // Verificar refresh token
      const decoded = JwtService.verifyRefreshToken(refreshToken);

      // Verificar que el usuario aún existe
      const admin = await this.service.getById(decoded.sub);

      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Generar nuevos tokens
      const tokens = JwtService.generateTokens(
        admin.idadmin,
        admin.usuario,
      );

      res.json({
        success: true,
        data: {
          tokens,
        },
        message: 'Token renovado exitosamente',
      });

    } catch (error) {
      console.error('[AuthController] Error en refresh:', error);
      
      const message = error instanceof Error ? error.message : 'Error renovando token';
      
      res.status(401).json({
        success: false,
        message,
      });
    }
  };

  /**
   * GET /api/auth/me
   * Obtiene información del usuario autenticado
   */
  me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      // Obtener información actualizada del usuario
      const admin = await this.service.getById(req.user.sub);

      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: admin.idadmin,
          usuario: admin.usuario,
          nombreapellido: admin.nombreapellido,
          numero: admin.numero,
        },
      });

    } catch (error) {
      console.error('[AuthController] Error en me:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo información del usuario',
      });
    }
  };

  /**
   * POST /api/auth/verify
   * Verifica si un token es válido
   */
  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token requerido',
        });
        return;
      }

      // Verificar token
      const decoded = JwtService.verifyAccessToken(token);

      res.json({
        success: true,
        data: {
          valid: true,
          payload: decoded,
        },
        message: 'Token válido',
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }
  };
}