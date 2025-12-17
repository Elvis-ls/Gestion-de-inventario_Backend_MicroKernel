/**
 * Interface para las estrategias de autenticación
 * Parte del patrón Abstract Factory
 */
export interface IAuthStrategy {
  /**
   * Autentica un usuario con las credenciales proporcionadas
   */
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  
  /**
   * Valida un token o sesión
   */
  validateToken(token: string): Promise<boolean>;
  
  /**
   * Cierra sesión / invalida token
   */
  logout(token: string): Promise<void>;
}

/**
 * Credenciales de autenticación
 */
export interface AuthCredentials {
  usuario?: string;
  contrasena?: string;
  token?: string;
  refreshToken?: string;
  // Otros campos según el tipo de auth
  [key: string]: any;
}

/**
 * Resultado de autenticación
 */
export interface AuthResult {
  success: boolean;
  user?: {
    id: number;
    usuario: string;
    nombreapellido?: string;
  };
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
}