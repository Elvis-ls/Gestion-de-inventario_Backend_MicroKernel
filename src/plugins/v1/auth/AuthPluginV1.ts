import { IAuthPlugin, AuthResult } from '../../../core/interfaces/IAuthPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { AuthServiceV1 } from './AuthServiceV1';
import { AuthControllerV1 } from './AuthControllerV1';
import { createAuthRoutesV1 } from './AuthRoutesV1';
/**
 * Plugin de Autenticación V1 - Autenticación Local
 * Sin JWT, sin tokens, autenticación directa con BD
 */
export class AuthPluginV1 implements IAuthPlugin {
  public readonly name = 'auth';
  public readonly version = '1.0.0';
  
  private service!: AuthServiceV1;
  private controller!: AuthControllerV1;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log('🔐 [AuthV1] Inicializando autenticación local...');
    
    this.service = new AuthServiceV1(this.dbPlugin);
    this.controller = new AuthControllerV1(this.service);
    this.router = createAuthRoutesV1(this.controller);
    
    eventBus.on('auth:login', (data) => {
      console.log('✓ [AuthV1] Usuario autenticado:', data.usuario);
    });
    
    console.log('✓ [AuthV1] Autenticación local inicializada');
  }

  async login(usuario: string, contrasena: string): Promise<AuthResult> {
    return await this.service.login(usuario, contrasena);
  }

  async verify(identifier: string): Promise<boolean> {
    // En V1 no hay tokens, siempre retorna false
    return false;
  }

  async logout(identifier: string): Promise<void> {
    // En V1 no hay sesiones persistentes
    console.log('[AuthV1] Logout ejecutado');
  }

  getRoutes(): Router {
    return this.router;
  }

  dependencies(): string[] {
    return ['database'];
  }

  async shutdown(): Promise<void> {
    console.log('🔐 [AuthV1] Cerrando...');
  }
}