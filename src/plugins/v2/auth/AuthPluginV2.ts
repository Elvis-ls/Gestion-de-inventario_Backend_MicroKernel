import { IAuthPlugin, AuthResult } from '../../../core/interfaces/IAuthPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { AuthServiceV2 } from './AuthServiceV2';
import { AuthControllerV2 } from './AuthControllerV2';
import { createAuthRoutesV2 } from './AuthRoutesV2';
import { validateJwtConfig } from './jwt.config';

/**
 * Plugin de Autenticación V2 - Con JWT
 * Incluye tokens, refresh tokens, y endpoints avanzados
 */
export class AuthPluginV2 implements IAuthPlugin {
  public readonly name = 'auth';
  public readonly version = '2.0.0';
  
  private service!: AuthServiceV2;
  private controller!: AuthControllerV2;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [AuthV2] Inicializando con JWT...');
    
    validateJwtConfig();
    
    this.service = new AuthServiceV2(this.dbPlugin);
    this.controller = new AuthControllerV2(this.service);
    this.router = createAuthRoutesV2(this.controller);
    
    eventBus.on('auth:login', (data) => {
      console.log(' [AuthV2] Usuario autenticado:', data.usuario);
    });
    
    console.log(' [AuthV2] JWT Auth inicializado');
  }

  async login(usuario: string, contrasena: string): Promise<AuthResult> {
    return await this.service.login(usuario, contrasena);
  }

  async verify(token: string): Promise<boolean> {
    return await this.service.verifyToken(token);
  }

  async logout(token: string): Promise<void> {
    // Aquí podrías implementar blacklist de tokens
    console.log('[AuthV2] Logout ejecutado');
  }

  getRoutes(): Router {
    return this.router;
  }

  dependencies(): string[] {
    return ['database'];
  }

  async shutdown(): Promise<void> {
    console.log(' [AuthV2] Cerrando...');
  }
}