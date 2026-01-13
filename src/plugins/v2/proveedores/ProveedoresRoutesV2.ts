import { Router } from 'express';
import { ProveedoresControllerV2 } from './ProveedoresControllerV2';

/**
 * Configura las rutas de proveedores
 */
export const createProveedoresRoutesV2 = (controller: ProveedoresControllerV2): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};