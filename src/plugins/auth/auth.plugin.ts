import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRoutes } from './auth.routes';

/**
 * Plugin de Autenticación
 */
export class AuthPlugin implements Plugin {
  public name = 'auth';
  public version = '1.0.0';
  
  private service!: AuthService;
  private controller!: AuthController;
  private router!: Router;

  dependencies(): string[] {
    return ['database']; // Depende del plugin de database
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [AuthPlugin] Inicializando...');

    // Obtener servicio de base de datos
    const dbService = DatabaseService.getInstance();

    // Inicializar capas
    this.service = new AuthService(dbService);
    this.controller = new AuthController(this.service);
    this.router = createAuthRoutes(this.controller);

    console.log(' [AuthPlugin] Inicializado correctamente');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log(' [AuthPlugin] Cerrando...');
  }
}