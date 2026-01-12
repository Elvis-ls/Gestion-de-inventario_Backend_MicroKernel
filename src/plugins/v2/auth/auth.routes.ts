// src/plugins/auth/auth.routes.ts

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from './middleware/auth.middleware';

/**
 * Configura las rutas de autenticación con JWT
 */
export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  // Rutas públicas (no requieren autenticación)
  router.post('/login', controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/verify', controller.verify);

  // Rutas protegidas (requieren token JWT válido)
  router.get('/me', authenticateToken, controller.me);

  return router;
};