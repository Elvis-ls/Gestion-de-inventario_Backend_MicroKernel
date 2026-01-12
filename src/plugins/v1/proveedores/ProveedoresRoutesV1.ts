import { Router } from 'express';
import { ProveedoresControllerV1 } from './ProveedoresControllerV1';

/**
 * Configura las rutas de proveedores
 */
export const createProveedoresRoutesV1 = (controller: ProveedoresControllerV1): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};