import { Router } from 'express';
import { CategoriasController } from './categorias.controller';

/**
 * Configura las rutas de categorías
 */
export const createCategoriasRoutes = (controller: CategoriasController): Router => {
  const router = Router();


  //  RUTAS DE DASHBOARD (deben ir PRIMERO, antes de /:id)
  router.get('/dashboard/estadisticas', controller.getEstadisticas);
  router.get('/dashboard/con-productos', controller.getCategoriasConProductos);
  router.get('/dashboard/top-valor', controller.getTopCategoriasPorValor);

  
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};