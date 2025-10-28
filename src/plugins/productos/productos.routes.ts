import { Router } from 'express';
import { ProductosController } from './productos.controller';

/**
 * Configura las rutas de productos
 */
export const createProductosRoutes = (controller: ProductosController): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/bajo-stock', controller.getBajoStock); // Debe ir antes de /:id
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};