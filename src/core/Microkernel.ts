import { Plugin } from './types';
import { EventBus } from './EventBus';
import { Server } from './Server';

/**
 * Microkernel - Núcleo mínimo del sistema
 * Gestiona la carga, registro y ciclo de vida de los plugins
 */
export class Microkernel {
  private plugins: Map<string, Plugin>;
  private eventBus: EventBus;
  private server: Server;

  constructor(port: number) {
    this.plugins = new Map();
    this.eventBus = new EventBus();
    this.server = new Server(port);
  }

  /**
   * Registra un plugin en el sistema
   */
  public async registerPlugin(plugin: Plugin): Promise<void> {
    try {
      console.log(`\n🔌 [Microkernel] Registrando plugin: ${plugin.name} v${plugin.version}`);

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
        this.server.registerRoutes(`/api/${plugin.name.toLowerCase()}`, routes);
      }

      // Guardar plugin
      this.plugins.set(plugin.name, plugin);
      
      console.log(`✅ [Microkernel] Plugin ${plugin.name} registrado exitosamente`);
    } catch (error) {
      console.error(`❌ [Microkernel] Error registrando plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  /**
   * Inicia el microkernel y el servidor
   */
  public async start(): Promise<void> {
    console.log('\n='.repeat(50));
    console.log('🏗️  INICIANDO MICROKERNEL');
    console.log('='.repeat(50));

    try {
      // Emitir evento de inicio
      this.eventBus.emit('system:starting');

      // Iniciar servidor
      await this.server.start();

      // Emitir evento de inicio completado
      this.eventBus.emit('system:started');

      console.log('\n✨ [Microkernel] Sistema iniciado correctamente');
      console.log(`📦 [Microkernel] Plugins cargados: ${this.plugins.size}`);
      console.log('='.repeat(50) + '\n');
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

    // Ejecutar shutdown de cada plugin
    for (const [name, plugin] of this.plugins) {
      if (plugin.shutdown) {
        console.log(`🔌 [Microkernel] Deteniendo plugin: ${name}`);
        await plugin.shutdown();
      }
    }

    this.eventBus.emit('system:stopped');
    console.log('✅ [Microkernel] Sistema detenido correctamente');
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
  public getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
}