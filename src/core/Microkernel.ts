import { IPlugin } from './interfaces/IPlugin';
import { EventBus } from './EventBus';
import { Server } from './Server';
import { PluginFactory, PluginFamily } from './factories/PluginFactory';

/**
 * Microkernel - Núcleo mínimo del sistema
 * Ahora usa Abstract Factory para gestionar versiones de plugins
 */
export class Microkernel {
  private plugins: Map<string, IPlugin>;
  private eventBus: EventBus;
  private server: Server;
  private pluginFamily?: PluginFamily;

  constructor(port: number) {
    this.plugins = new Map();
    this.eventBus = new EventBus();
    this.server = new Server(port);
  }

  /**
   * Carga una familia completa de plugins usando una factory
   */
  public async loadPluginFamily(factory: PluginFactory): Promise<void> {
    console.log('\n🏭 [Microkernel] Cargando familia de plugins...');
    
    // Crear toda la familia de plugins
    this.pluginFamily = factory.createAllPlugins();
    
    console.log(`✓ [Microkernel] Familia de plugins versión ${this.pluginFamily.version} creada`);
    console.log(`  - Auth: ${this.pluginFamily.auth.version}`);
    console.log(`  - Database: ${this.pluginFamily.database.version}`);
    console.log(`  - Categorías: ${this.pluginFamily.categorias.version}`);
    console.log(`  - Productos: ${this.pluginFamily.productos.version}`);
    console.log(`  - Proveedores: ${this.pluginFamily.proveedores.version}`);
    
    // Registrar cada plugin en el orden correcto
    await this.registerPlugin(this.pluginFamily.database);
    await this.registerPlugin(this.pluginFamily.auth);
    await this.registerPlugin(this.pluginFamily.categorias);
    await this.registerPlugin(this.pluginFamily.productos);
    await this.registerPlugin(this.pluginFamily.proveedores);
  }

  /**
   * Registra un plugin individual
   */
  private async registerPlugin(plugin: IPlugin): Promise<void> {
    try {
      console.log(`\n📦 [Microkernel] Registrando plugin: ${plugin.name} v${plugin.version}`);

      // Verificar dependencias
      if (plugin.dependencies) {
        const deps = plugin.dependencies();
        for (const dep of deps) {
          if (!this.plugins.has(dep)) {
            throw new Error(`Plugin ${plugin.name} requiere ${dep} que no está cargado`);
          }
        }
      }

      // Inicializar plugin
      await plugin.initialize(this.eventBus);

      // Registrar rutas si existen
      if (plugin.getRoutes) {
        const routes = plugin.getRoutes();
        this.server.registerRoutes(`/api/${plugin.name}`, routes);
      }

      // Guardar plugin
      this.plugins.set(plugin.name, plugin);
      
      console.log(`✓ [Microkernel] Plugin ${plugin.name} registrado exitosamente`);
    } catch (error) {
      console.error(`❌ [Microkernel] Error registrando plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  /**
   * Inicia el microkernel y el servidor
   */
  public async start(): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log('  🚀 INICIANDO MICROKERNEL CON ABSTRACT FACTORY');
    console.log('='.repeat(60));

    try {
      this.eventBus.emit('system:starting');

      await this.server.start();

      this.eventBus.emit('system:started');

      console.log('\n✅ [Microkernel] Sistema iniciado correctamente');
      if (this.pluginFamily) {
        console.log(`📦 [Microkernel] Versión de plugins: ${this.pluginFamily.version}`);
      }
      console.log(`📦 [Microkernel] Plugins cargados: ${this.plugins.size}`);
      console.log('='.repeat(60) + '\n');
    } catch (error) {
      console.error('❌ [Microkernel] Error iniciando el sistema:', error);
      throw error;
    }
  }

  /**
   * Detiene el microkernel y limpia recursos
   */
  public async shutdown(): Promise<void> {
    console.log('\n🛑 [Microkernel] Deteniendo sistema...');
    
    this.eventBus.emit('system:stopping');

    // Ejecutar shutdown de plugins en orden inverso
    const pluginArray = Array.from(this.plugins.values()).reverse();
    for (const plugin of pluginArray) {
      if (plugin.shutdown) {
        await plugin.shutdown();
      }
    }

    this.eventBus.emit('system:stopped');
    console.log('✓ [Microkernel] Sistema detenido correctamente');
  }

  /**
   * Obtiene el EventBus del sistema
   */
  public getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Obtiene el servidor
   */
  public getServer(): Server {
    return this.server;
  }

  /**
   * Obtiene un plugin por nombre
   */
  public getPlugin(name: string): IPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Obtiene la familia de plugins actual
   */
  public getPluginFamily(): PluginFamily | undefined {
    return this.pluginFamily;
  }
}