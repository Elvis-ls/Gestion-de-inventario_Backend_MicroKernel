import { Router } from 'express';
import { CategoriasController } from './CategoriasControllerV2';
import { AuthMiddleware } from '../auth/authMiddleware';

const router = Router();

// V2: Todas las rutas requieren autenticación JWT
router.use(AuthMiddleware.authenticate);

router.get('/', CategoriasController.getAll);
router.get('/with-count', CategoriasController.getWithProductCount); // V2: Nueva ruta
router.get('/:id', CategoriasController.getById);
router.post('/', CategoriasController.create);
router.put('/:id', CategoriasController.update);
router.delete('/:id', CategoriasController.delete);

export default router;