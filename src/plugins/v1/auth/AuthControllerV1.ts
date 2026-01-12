import { Request, Response } from 'express';
import { AuthServiceV1 } from './AuthServiceV1';

export class AuthControllerV1 {
  constructor(private service: AuthServiceV1) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        res.status(400).json({
          success: false,
          message: 'Usuario y contraseña son requeridos',
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
      console.error('[AuthControllerV1] Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor',
      });
    }
  };

  // V1 no tiene refresh, verify, me
  // Estos endpoints solo retornan error indicando que no están soportados
}