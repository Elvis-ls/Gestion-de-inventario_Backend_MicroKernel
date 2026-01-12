import { Router } from 'express';
import { AuthControllerV1 } from './AuthControllerV1';

export const createAuthRoutesV1 = (controller: AuthControllerV1): Router => {
  const router = Router();
  
  // Solo login en V1
  router.post('/login', controller.login);
  
  return router;
};