import { Router } from 'express';
import { ProductosControllerV1 } from './ProductosControllerV1';

export const createProductosRoutesV1 = (controller: ProductosControllerV1): Router => {
  const router = Router();
  
  router.get('/', controller.getAll);
  router.get('/bajo-stock', controller.getBajoStock);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  
  return router;
};