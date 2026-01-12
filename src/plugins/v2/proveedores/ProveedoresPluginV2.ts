import proveedoresRoutes from './ProveedoresRoutesV2';
import { ProveedoresService } from './ProveedoresServiceV2';

export interface ProveedoresPluginV2 {
  name: string;
  version: string;
  initialize: (core: any) => Promise<void>;
}

const proveedoresPlugin: ProveedoresPluginV2 = {
  name: 'proveedores',
  version: '2.0.0',

  initialize: async (core: any) => {
    try {
      if (!core.database) {
        throw new Error('El plugin de base de datos debe inicializarse primero');
      }

      ProveedoresService.initialize(core.database);

      core.app.use('/api/v2/proveedores', proveedoresRoutes);

      console.log('✅ Plugin Proveedores v2 inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar plugin Proveedores v2:', error);
      throw error;
    }
  },
};

export default proveedoresPlugin;