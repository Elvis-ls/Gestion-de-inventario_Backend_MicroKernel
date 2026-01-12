/*import { PluginFactory } from '../../core/factories/PluginFactory';
import { IAuthPlugin } from '../../core/interfaces/IAuthPlugin';
import { IDatabasePlugin } from '../../core/interfaces/IDatabasePlugin';
import { ICategoriasPlugin } from '../../core/interfaces/ICategoriasPlugin';
import { IProductosPlugin } from '../../core/interfaces/IProductosPlugin';
import { IProveedoresPlugin } from '../../core/interfaces/IProveedoresPlugin';

// Importar plugins V2
import { AuthPluginV2 } from '../v2/auth/AuthPluginV2';
import { DatabasePluginV2 } from '../v2/database/DatabasePluginV2';
import { CategoriasPluginV2 } from '../v2/categorias/CategoriasPluginV2';
import { ProductosPluginV2 } from '../v2/productos/ProductosPluginV2';
import { ProveedoresPluginV2 } from '../v2/proveedores/ProveedoresPluginV2';

/**
 * Concrete Factory V2
 * Crea una familia completa de plugins versión 2.0 (JWT/Avanzado)
 * 
 * Características de V2:
 * - Auth: JWT con tokens, refresh tokens
 * - Database: Optimizaciones y caching
 * - Endpoints de dashboard y estadísticas
 * - Funcionalidades avanzadas
 *//*
export class PluginFactoryV2 extends PluginFactory {
  private databaseInstance: IDatabasePlugin | null = null;

  getVersion(): string {
    return '2.0.0';
  }

  createDatabasePlugin(): IDatabasePlugin {
    if (!this.databaseInstance) {
      console.log('🏭 [FactoryV2] Creando DatabasePluginV2...');
      this.databaseInstance = DatabasePluginV2.getInstance();
    }
    return this.databaseInstance;
  }

  createAuthPlugin(): IAuthPlugin {
    console.log('🏭 [FactoryV2] Creando AuthPluginV2 (JWT)...');
    const dbPlugin = this.createDatabasePlugin();
    return new AuthPluginV2(dbPlugin);
  }

  createCategoriasPlugin(): ICategoriasPlugin {
    console.log('🏭 [FactoryV2] Creando CategoriasPluginV2 (con Dashboard)...');
    const dbPlugin = this.createDatabasePlugin();
    return new CategoriasPluginV2(dbPlugin);
  }

  createProductosPlugin(): IProductosPlugin {
    console.log('🏭 [FactoryV2] Creando ProductosPluginV2 (con Dashboard)...');
    const dbPlugin = this.createDatabasePlugin();
    return new ProductosPluginV2(dbPlugin);
  }

  createProveedoresPlugin(): IProveedoresPlugin {
    console.log('🏭 [FactoryV2] Creando ProveedoresPluginV2 (con Dashboard)...');
    const dbPlugin = this.createDatabasePlugin();
    return new ProveedoresPluginV2(dbPlugin);
  }
}*/