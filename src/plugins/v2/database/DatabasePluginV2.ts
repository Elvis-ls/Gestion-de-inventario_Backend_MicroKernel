import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { EventBus } from '../../../core/EventBus';
import { Pool, QueryResult } from 'pg';
import { Router } from 'express';
import { config } from '../../../config/env';

export class DatabasePluginV2 implements IDatabasePlugin {
  public readonly name = 'database';
  public readonly version = '2.0.0';
  
  private pool: Pool;
  private static instance: DatabasePluginV2;

  constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    this.setupListeners();
  }

  static getInstance(): DatabasePluginV2 {
    if (!DatabasePluginV2.instance) {
      DatabasePluginV2.instance = new DatabasePluginV2();
    }
    return DatabasePluginV2.instance;
  }

  private setupListeners(): void {
    this.pool.on('connect', () => {
      console.log('🗄️  [DatabaseV1] Nueva conexión establecida');
    });

    this.pool.on('error', (err) => {
      console.error('🗄️  [DatabaseV1] Error inesperado:', err);
    });
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log('🗄️  [DatabaseV1] Inicializando...');
    
    const connected = await this.testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    eventBus.on('system:stopping', async () => {
      await this.shutdown();
    });

    console.log('✓ [DatabaseV1] Inicializado correctamente');
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('✓ [DatabaseV1] Conexión exitosa');
      return true;
    } catch (error) {
      console.error('❌ [DatabaseV1] Error conectando:', error);
      return false;
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`⚡ [DatabaseV1] Query ejecutada en ${duration}ms`);
      return result;
    } catch (error) {
      console.error('❌ [DatabaseV1] Error ejecutando query:', error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  getPool(): Pool {
    return this.pool;
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log('✓ [DatabaseV1] Pool cerrado');
    } catch (error) {
      console.error('❌ [DatabaseV1] Error cerrando pool:', error);
      throw error;
    }
  }

  dependencies(): string[] {
    return [];
  }

  async shutdown(): Promise<void> {
    await this.disconnect();
  }
}