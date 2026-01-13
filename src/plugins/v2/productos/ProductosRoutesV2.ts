import { Router } from 'express';
import { ProductosControllerV2 } from './ProductosControllerV2';
import { authenticateToken } from '../auth/authMiddleware'; // ← Añadir esta línea

export const createProductosRoutesV2 = (controller: ProductosControllerV2): Router => {
  const router = Router();
  
  router.get('/', controller.getAll);
  router.get('/bajo-stock', controller.getBajoStock);
  router.get('/:id', controller.getById);
  router.post('/', authenticateToken, controller.create);
  router.put('/:id', authenticateToken, controller.update);
  router.delete('/:id', authenticateToken, controller.delete);
  
  return router;
};