import { IPlugin } from './IPlugin';
import { QueryResult, Pool } from 'pg';

export interface IDatabasePlugin extends IPlugin {
  /**
   * Prueba la conexión a la BD
   */
  testConnection(): Promise<boolean>;
  
  /**
   * Ejecuta una query
   */
  query(text: string, params?: any[]): Promise<QueryResult>;
  
  /**
   * Obtiene un cliente del pool para transacciones
   */
  getClient(): Promise<any>;
  
  /**
   * Obtiene el pool (para casos especiales)
   */
  getPool(): Pool;
  
  /**
   * Cierra el pool de conexiones
   */
  disconnect(): Promise<void>;
}