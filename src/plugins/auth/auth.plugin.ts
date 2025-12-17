// src/plugins/auth/auth.plugin.ts

import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRoutes } from './auth.routes';
import { validateJwtConfig } from './config/jwt.config';

/**
 * Plugin de Autenticación con JWT
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
    console.log('🔐 [AuthPlugin] Inicializando...');

    // Validar configuración de JWT
    validateJwtConfig();

    // Obtener servicio de base de datos
    const dbService = DatabaseService.getInstance();

    // Inicializar capas
    this.service = new AuthService(dbService);
    this.controller = new AuthController(this.service);
    this.router = createAuthRoutes(this.controller);

    // Escuchar eventos de autenticación
    eventBus.on('auth:login', (data) => {
      console.log('✓ [AuthPlugin] Usuario autenticado:', data.usuario);
    });

    eventBus.on('auth:logout', (data) => {
      console.log('✓ [AuthPlugin] Usuario cerró sesión:', data.usuario);
    });

    console.log('✓ [AuthPlugin] Inicializado correctamente con JWT');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log('🔐 [AuthPlugin] Cerrando...');
  }
}