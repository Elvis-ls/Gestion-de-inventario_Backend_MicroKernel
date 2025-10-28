import { Router } from 'express';
import { ProductosController } from './productos.controller';

/**
 * Configura las rutas de productos
 */
export const createProductosRoutes = (controller: ProductosController): Router => {
  const router = Router();

  // 📊 RUTAS DE DASHBOARD (deben ir PRIMERO, antes de /:id)
  router.get('/dashboard/estadisticas', controller.getEstadisticas);
  router.get('/dashboard/mas-movidos', controller.getProductosMasMovidos);
  router.get('/dashboard/proximos-vencer', controller.getProductosProximosVencer);
  router.get('/dashboard/top-valor', controller.getTopProductosPorValor);
  router.get('/dashboard/resumen-categoria', controller.getResumenPorCategoria);

  router.get('/', controller.getAll);
  router.get('/bajo-stock', controller.getBajoStock); // Debe ir antes de /:id
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.deletePermanente);

  return router;
};