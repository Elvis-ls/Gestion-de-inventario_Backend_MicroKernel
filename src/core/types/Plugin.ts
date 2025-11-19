import { Router } from 'express';
import { EventBus } from '../EventBus';

/**
 * Interface que debe implementar cada plugin del sistema
 */
export interface Plugin {
  name: string;
  version: string;
  
  /**
   * Inicializa el plugin
   * @param eventBus - Bus de eventos para comunicación entre plugins
   */
  initialize(eventBus: EventBus): Promise<void>;
  
  /**
   * Retorna las rutas del plugin 
   */
  getRoutes?(): Router;
  
  /**
   * Limpia recursos del plugin antes de desconectar
   */
  shutdown?(): Promise<void>;
  
  /**
   * Define dependencias de otros plugins
   */
  dependencies?(): string[];
}

/**
 * Metadata del plugin
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}