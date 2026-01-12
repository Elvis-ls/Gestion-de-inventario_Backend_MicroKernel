import { Pool, QueryResult } from 'pg';
import { databaseConfig } from './database.config';

/**
 * Servicio de base de datos
 * Gestiona el pool de conexiones y las queries
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool(databaseConfig);
    this.setupListeners();
  }

  /**
   * Singleton - obtiene la instancia única
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Configura listeners del pool
   */
  private setupListeners(): void {
    this.pool.on('connect', () => {
      console.log(' [Database] Nueva conexión establecida');
    });

    this.pool.on('error', (err) => {
      console.error(' [Database] Error inesperado en el pool:', err);
    });
  }

  /**
   * Prueba la conexión a la base de datos
   */
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log(' [Database] Conexión exitosa a PostgreSQL');
      console.log(` [Database] Timestamp del servidor: ${result.rows[0].now}`);
      return true;
    } catch (error) {
      console.error(' [Database] Error conectando a PostgreSQL:', error);
      return false;
    }
  }

  /**
   * Ejecuta una query
   */
  public async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log(` [Database] Query ejecutada en ${duration}ms`);
      return result;
    } catch (error) {
      console.error(' [Database] Error ejecutando query:', error);
      throw error;
    }
  }

  /**
   * Obtiene un cliente del pool para transacciones
   */
  public async getClient() {
    return await this.pool.connect();
  }

  /**
   * Cierra el pool de conexiones
   */
  public async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log(' [Database] Pool de conexiones cerrado');
    } catch (error) {
      console.error(' [Database] Error cerrando pool:', error);
      throw error;
    }
  }

  /**
   * Obtiene el pool (para casos especiales)
   */
  public getPool(): Pool {
    return this.pool;
  }
}