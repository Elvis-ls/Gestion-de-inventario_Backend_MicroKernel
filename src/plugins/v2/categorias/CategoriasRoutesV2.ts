import { Router } from 'express';
import { CategoriasControllerV2 } from './CategoriasControllerV2';

export const createCategoriasRoutesV2 = (controller: CategoriasControllerV2): Router => {
  const router = Router();
  
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  
  return router;
};