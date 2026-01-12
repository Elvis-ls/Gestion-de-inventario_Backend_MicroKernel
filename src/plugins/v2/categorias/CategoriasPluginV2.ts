import categoriasRoutes from './CategoriasRoutesV2';
import { CategoriasService } from './CategoriasServiceV2';

export interface CategoriasPluginV2 {
  name: string;
  version: string;
  initialize: (core: any) => Promise<void>;
}

const categoriasPlugin: CategoriasPluginV2 = {
  name: 'categorias',
  version: '2.0.0',

  initialize: async (core: any) => {
    try {
      if (!core.database) {
        throw new Error('El plugin de base de datos debe inicializarse primero');
      }

      CategoriasService.initialize(core.database);

      core.app.use('/api/v2/categorias', categoriasRoutes);

      console.log('✅ Plugin Categorías v2 inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar plugin Categorías v2:', error);
      throw error;
    }
  },
};

export default categoriasPlugin;