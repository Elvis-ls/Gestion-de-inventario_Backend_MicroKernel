import { Router } from 'express';
import { ProveedoresController } from './proveedores.controller';

/**
 * Configura las rutas de proveedores
 */
export const createProveedoresRoutes = (controller: ProveedoresController): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};