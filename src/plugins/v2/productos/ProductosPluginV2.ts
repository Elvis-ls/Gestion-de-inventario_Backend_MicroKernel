import productosRoutes from './ProductosRoutesV2';
import { ProductosService } from './ProductosServiceV2';

export interface ProductosPluginV2 {
  name: string;
  version: string;
  initialize: (core: any) => Promise<void>;
}

const productosPlugin: ProductosPluginV2 = {
  name: 'productos',
  version: '2.0.0',

  initialize: async (core: any) => {
    try {
      if (!core.database) {
        throw new Error('El plugin de base de datos debe inicializarse primero');
      }

      ProductosService.initialize(core.database);

      core.app.use('/api/v2/productos', productosRoutes);

      console.log('✅ Plugin Productos v2 inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar plugin Productos v2:', error);
      throw error;
    }
  },
};

export default productosPlugin;