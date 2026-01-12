import { IPlugin } from './IPlugin';

export interface AuthResult {
  success: boolean;
  user?: {
    id: number;
    usuario: string;
    nombreapellido?: string;
  };
  token?: string;
  refreshToken?: string;
  message?: string;
}

export interface IAuthPlugin extends IPlugin {
  /**
   * Autentica a un usuario
   */
  login(usuario: string, contrasena: string): Promise<AuthResult>;
  
  /**
   * Verifica si un token/sesión es válido
   */
  verify(token: string): Promise<boolean>;
  
  /**
   * Cierra sesión
   */
  logout(identifier: string): Promise<void>;
}