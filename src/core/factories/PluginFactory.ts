import { IAuthPlugin } from '../interfaces/IAuthPlugin';
import { IDatabasePlugin } from '../interfaces/IDatabasePlugin';
import { ICategoriasPlugin } from '../interfaces/ICategoriasPlugin';
import { IProductosPlugin } from '../interfaces/IProductosPlugin';
import { IProveedoresPlugin } from '../interfaces/IProveedoresPlugin';

/**
 * Abstract Factory para crear familias completas de plugins
 * 
 * Este patrón permite crear versiones completas del sistema
 * sin especificar las clases concretas.
 * 
 * Cada versión del sistema tendrá su propia Concrete Factory
 * que implementa estos métodos.
 */
export abstract class PluginFactory {
  /**
   * Versión de los plugins que esta factory crea
   */
  abstract getVersion(): string;
  
  /**
   * Crea el plugin de autenticación
   */
  abstract createAuthPlugin(): IAuthPlugin;
  
  /**
   * Crea el plugin de base de datos
   */
  abstract createDatabasePlugin(): IDatabasePlugin;
  
  /**
   * Crea el plugin de categorías
   */
  abstract createCategoriasPlugin(): ICategoriasPlugin;
  
  /**
   * Crea el plugin de productos
   */
  abstract createProductosPlugin(): IProductosPlugin;
  
  /**
   * Crea el plugin de proveedores
   */
  abstract createProveedoresPlugin(): IProveedoresPlugin;
  
  /**
   * Método helper que crea todos los plugins de una vez
   * Retorna una familia completa de plugins compatibles
   */
  public createAllPlugins(): PluginFamily {
    console.log(`🏭 [PluginFactory] Creando familia de plugins versión ${this.getVersion()}`);
    
    return {
      version: this.getVersion(),
      auth: this.createAuthPlugin(),
      database: this.createDatabasePlugin(),
      categorias: this.createCategoriasPlugin(),
      productos: this.createProductosPlugin(),
      proveedores: this.createProveedoresPlugin()
    };
  }
}

/**
 * Interfaz que agrupa toda una familia de plugins
 */
export interface PluginFamily {
  version: string;
  auth: IAuthPlugin;
  database: IDatabasePlugin;
  categorias: ICategoriasPlugin;
  productos: IProductosPlugin;
  proveedores: IProveedoresPlugin;
}