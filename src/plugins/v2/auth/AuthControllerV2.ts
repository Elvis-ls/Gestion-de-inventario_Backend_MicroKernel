import { Request, Response } from 'express';
import { AuthServiceV2 } from './AuthServiceV2';
import { JwtService } from './JwtService';

export class AuthControllerV2 {
  constructor(private service: AuthServiceV2) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        res.status(400).json({
          success: false,
          message: 'Usuario y contraseña requeridos',
        });
        return;
      }

      const result = await this.service.login(usuario, contrasena);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token requerido' });
        return;
      }

      const decoded = JwtService.verifyRefreshToken(refreshToken);
      const admin = await this.service.getById(decoded.sub);

      if (!admin) {
        res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        return;
      }

      const tokens = JwtService.generateTokens(admin.idadmin, admin.usuario);

      res.json({
        success: true,
        data: { tokens },
        message: 'Token renovado',
      });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Error renovando token' });
    }
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ success: false, message: 'Token requerido' });
        return;
      }

      const decoded = JwtService.verifyAccessToken(token);

      res.json({
        success: true,
        data: { valid: true, payload: decoded },
        message: 'Token válido',
      });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token inválido' });
    }
  };
}
