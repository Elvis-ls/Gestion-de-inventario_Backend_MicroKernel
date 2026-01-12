import { Router } from 'express';
import { EventBus } from '../EventBus';

/**
 * Interfaz base para todos los plugins
 */
export interface IPlugin {
  name: string;
  version: string;
  
  initialize(eventBus: EventBus): Promise<void>;
  getRoutes?(): Router;
  shutdown?(): Promise<void>;
  dependencies?(): string[];
}