import { Router } from 'express';
import { AuthController } from './auth.controller';

/**
 * Configura las rutas de autenticación
 */
export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post('/login', controller.login);

  return router;
};