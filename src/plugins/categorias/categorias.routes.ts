import { Router } from 'express';
import { CategoriasController } from './categorias.controller';

/**
 * Configura las rutas de categorías
 */
export const createCategoriasRoutes = (controller: CategoriasController): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};