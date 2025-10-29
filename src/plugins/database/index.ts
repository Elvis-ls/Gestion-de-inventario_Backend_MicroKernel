import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { DatabaseService } from './database.service';

/**
 * Plugin de Base de Datos
 * Inicializa la conexión a PostgreSQL y la mantiene disponible para otros plugins
 */
export class DatabasePlugin implements Plugin {
  public name = 'database';
  public version = '1.0.0';
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [DatabasePlugin] Inicializando...');

    // Probar conexión
    const connected = await this.dbService.testConnection();
    
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Escuchar evento de cierre del sistema
    eventBus.on('system:stopping', async () => {
      console.log(' [DatabasePlugin] Recibida señal de cierre...');
      await this.shutdown();
    });

    console.log(' [DatabasePlugin] Inicializado correctamente');
  }

  async shutdown(): Promise<void> {
    console.log(' [DatabasePlugin] Cerrando conexiones...');
    await this.dbService.disconnect();
  }

  /**
   * Método para que otros plugins obtengan el servicio de BD
   */
  public getDatabaseService(): DatabaseService {
    return this.dbService;
  }
}

// Exportar instancia del plugin
export const databasePlugin = new DatabasePlugin();