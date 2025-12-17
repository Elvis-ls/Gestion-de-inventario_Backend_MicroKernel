import { IAuthValidator, ValidationResult } from './IAuthValidator';

/**
 * Validador para autenticación JWT
 */
export class JWTAuthValidator implements IAuthValidator {
  
  validateCredentials(credentials: any): ValidationResult {
    const errors: string[] = [];
    
    // Para JWT también necesitamos usuario/contraseña inicial
    if (!credentials.usuario && !credentials.token) {
      errors.push('Se requiere usuario/contraseña o token');
    }
    
    if (credentials.usuario) {
      if (credentials.usuario.length < 3) {
        errors.push('El usuario debe tener al menos 3 caracteres');
      }
    }
    
    if (credentials.contrasena) {
      if (credentials.contrasena.length < 4) {
        errors.push('La contraseña debe tener al menos 4 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      sanitizedData: this.sanitizeInput(credentials)
    };
  }
  
  /**
   * Valida formato de JWT
   */
  validateTokenFormat(token: string): boolean {
    if (!token) return false;
    
    // JWT tiene formato: xxxxx.yyyyy.zzzzz
    const parts = token.split('.');
    return parts.length === 3;
  }
  
  sanitizeInput(input: any): any {
    if (!input) return {};
    
    return {
      usuario: input.usuario ? String(input.usuario).trim() : undefined,
      contrasena: input.contrasena ? String(input.contrasena) : undefined,
      token: input.token ? String(input.token).trim() : undefined
    };
  }
}