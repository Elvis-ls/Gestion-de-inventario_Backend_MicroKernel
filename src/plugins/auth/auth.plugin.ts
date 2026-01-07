// src/plugins/auth/auth.plugin.ts

import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRoutes } from './auth.routes';
import { validateJwtConfig } from './config/jwt.config';
import { AuthFactory } from './factories/AuthFactory';
import { JWTAuthFactory } from './factories/JWTAuthFactory';
import { LocalAuthFactory } from './factories/LocalAuthFactory';

/**
 * Plugin de Autenticación con JWT
 * Ahora usa el patrón Abstract Factory para crear la familia de objetos de autenticación
 */
export class AuthPlugin implements Plugin {
  public name = 'auth';
  public version = '1.0.0';
  
  private service!: AuthService;
  private controller!: AuthController;
  private router!: Router;
  private factory!: AuthFactory;

  dependencies(): string[] {
    return ['database']; // Depende del plugin de database
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log('🔐 [AuthPlugin] Inicializando con Abstract Factory...');

    // Validar configuración de JWT
    validateJwtConfig();

    // Obtener servicio de base de datos
    const dbService = DatabaseService.getInstance();

    // ✅ PASO 1: Determinar qué tipo de autenticación usar
    const authType = this.getAuthType();
    console.log(`🔐 [AuthPlugin] Tipo de autenticación seleccionado: ${authType}`);

    // ✅ PASO 2: Crear la factory apropiada usando Abstract Factory
    this.factory = this.createFactory(authType, dbService);

    // ✅ PASO 3: Usar la factory para crear la familia completa de objetos
    const authComponents = this.factory.createAuthComponents();
    console.log(`✓ [AuthPlugin] Componentes de autenticación creados:`, {
      strategy: authComponents.strategy.constructor.name,
      validator: authComponents.validator.constructor.name,
      type: authComponents.type
    });

    // ✅ PASO 4: Inicializar capas con los componentes del factory
    this.service = new AuthService(dbService, authComponents.strategy);
    this.controller = new AuthController(this.service);
    this.router = createAuthRoutes(this.controller);

    // Escuchar eventos de autenticación
    eventBus.on('auth:login', (data) => {
      console.log('✓ [AuthPlugin] Usuario autenticado:', data.usuario);
    });

    eventBus.on('auth:logout', (data) => {
      console.log('✓ [AuthPlugin] Usuario cerró sesión:', data.usuario);
    });

    console.log('✓ [AuthPlugin] Inicializado correctamente con Abstract Factory Pattern');
  }

  /**
   * Determina el tipo de autenticación a usar
   * Puede leer de variables de entorno o configuración
   */
  private getAuthType(): string {
    // Puedes configurar esto desde .env
    return process.env.AUTH_TYPE || 'jwt'; // Opciones: 'jwt', 'local'
  }

  /**
   * Crea la factory apropiada según el tipo de autenticación
   * Este es el corazón del patrón Abstract Factory
   */
  private createFactory(type: string, db: DatabaseService): AuthFactory {
    switch (type.toLowerCase()) {
      case 'jwt':
        console.log('🏭 [AuthPlugin] Creando JWTAuthFactory...');
        return new JWTAuthFactory(db);
      
      case 'local':
        console.log('🏭 [AuthPlugin] Creando LocalAuthFactory...');
        return new LocalAuthFactory(db);
      
      default:
        console.warn(`⚠️  [AuthPlugin] Tipo de auth '${type}' no reconocido, usando JWT por defecto`);
        return new JWTAuthFactory(db);
    }
  }

  /**
   * Permite cambiar la estrategia dinámicamente (opcional)
   */
  public switchAuthType(type: string): void {
    console.log(`🔄 [AuthPlugin] Cambiando tipo de autenticación a: ${type}`);
    const dbService = DatabaseService.getInstance();
    this.factory = this.createFactory(type, dbService);
    const components = this.factory.createAuthComponents();
    this.service.setStrategy(components.strategy);
    console.log('✓ [AuthPlugin] Estrategia cambiada exitosamente');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log('🔐 [AuthPlugin] Cerrando...');
  }
}