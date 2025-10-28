import { Request, Response } from 'express';
import { AuthService } from './auth.service';

/**
 * Controlador de Autenticación
 * Maneja las peticiones HTTP
 */
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        res.status(400).json({
          success: false,
          message: 'El usuario y la contraseña son requeridos'
        });
        return;
      }

      const admin = await this.service.login(usuario, contrasena);

      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      res.json({
        success: true,
        data: admin,
        message: 'Inicio de sesión exitoso'
      });

    } catch (error) {
      console.error('[AuthController] Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }
  };
}