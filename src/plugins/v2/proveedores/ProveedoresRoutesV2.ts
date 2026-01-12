import { Router } from 'express';
import { ProveedoresController } from './ProveedoresControllerV2';
import { AuthMiddleware } from '../auth/middleware/authMiddleware';

const router = Router();

// V2: Todas las rutas requieren autenticación JWT
router.use(AuthMiddleware.authenticate);

router.get('/', ProveedoresController.getAll);
router.get('/search', ProveedoresController.search); // V2: Nueva ruta para búsqueda
router.get('/count', ProveedoresController.getCount); // V2: Nueva ruta para conteo
router.get('/:id', ProveedoresController.getById);
router.post('/', ProveedoresController.create);
router.put('/:id', ProveedoresController.update);
router.delete('/:id', ProveedoresController.delete);

export default router;