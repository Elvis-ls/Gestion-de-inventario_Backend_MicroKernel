import { Router } from 'express';
import { CategoriasControllerV1 } from './CategoriasControllerV1';

export const createCategoriasRoutesV1 = (controller: CategoriasControllerV1): Router => {
  const router = Router();
  
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  
  return router;
};