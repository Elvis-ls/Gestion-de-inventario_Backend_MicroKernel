import { Router } from 'express';
import { AuthControllerV2 } from './AuthControllerV2';

export const createAuthRoutesV2 = (controller: AuthControllerV2): Router => {
  const router = Router();
  
  // Rutas públicas
  router.post('/login', controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/verify', controller.verify);
  
  return router;
};