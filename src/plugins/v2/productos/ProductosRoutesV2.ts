import { Router } from 'express';
import { ProductosController } from './ProductosControllerV2';
import { AuthMiddleware } from '../auth/authMiddleware';

const router = Router();

// V2: Todas las rutas requieren autenticación JWT
router.use(AuthMiddleware.authenticate);

router.get('/', ProductosController.getAll);
router.get('/bajo-stock', ProductosController.getBajoStock);
router.get('/search', ProductosController.search); // V2: Nueva ruta para búsqueda
router.get('/:id', ProductosController.getById);
router.post('/', ProductosController.create);
router.put('/:id', ProductosController.update);
router.delete('/:id', ProductosController.delete);

export default router;