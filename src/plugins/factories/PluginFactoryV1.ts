import { PluginFactory } from '../../core/factories/PluginFactory';
import { IAuthPlugin } from '../../core/interfaces/IAuthPlugin';
import { IDatabasePlugin } from '../../core/interfaces/IDatabasePlugin';
import { ICategoriasPlugin } from '../../core/interfaces/ICategoriasPlugin';
import { IProductosPlugin } from '../../core/interfaces/IProductosPlugin';
import { IProveedoresPlugin } from '../../core/interfaces/IProveedoresPlugin';

// Importar plugins V1
import { AuthPluginV1 } from '../v1/auth/AuthPluginV1';
import { DatabasePluginV1 } from '../v1/database/DatabasePluginV1';
import { CategoriasPluginV1 } from '../v1/categorias/CategoriasPluginV1';
import { ProductosPluginV1 } from '../v1/productos/ProductosPluginV1';
import { ProveedoresPluginV1 } from '../v1/proveedores/ProveedoresPluginV1';

/**
 * Concrete Factory V1
 * Crea una familia completa de plugins versión 1.0 (Local/Básico)
 * 
 * Características de V1:
 * - Auth: Autenticación local sin JWT
 * - Database: Conexión básica a PostgreSQL
 * - CRUD básico para todos los módulos
 * - Sin estadísticas ni endpoints avanzados
 */
export class PluginFactoryV1 extends PluginFactory {
  private databaseInstance: IDatabasePlugin | null = null;

  getVersion(): string {
    return '1.0.0';
  }

  createDatabasePlugin(): IDatabasePlugin {
    if (!this.databaseInstance) {
      console.log(' [FactoryV1] Creando DatabasePluginV1...');
      this.databaseInstance = DatabasePluginV1.getInstance();
    }
    return this.databaseInstance;
  }

  createAuthPlugin(): IAuthPlugin {
    console.log(' [FactoryV1] Creando AuthPluginV1 (Local)...');
    const dbPlugin = this.createDatabasePlugin();
    return new AuthPluginV1(dbPlugin);
  }

  createCategoriasPlugin(): ICategoriasPlugin {
    console.log(' [FactoryV1] Creando CategoriasPluginV1...');
    const dbPlugin = this.createDatabasePlugin();
    return new CategoriasPluginV1(dbPlugin);
  }

  createProductosPlugin(): IProductosPlugin {
    console.log(' [FactoryV1] Creando ProductosPluginV1...');
    const dbPlugin = this.createDatabasePlugin();
    return new ProductosPluginV1(dbPlugin);
  }

  createProveedoresPlugin(): IProveedoresPlugin {
    console.log(' [FactoryV1] Creando ProveedoresPluginV1...');
    const dbPlugin = this.createDatabasePlugin();
    return new ProveedoresPluginV1(dbPlugin);
  }
}