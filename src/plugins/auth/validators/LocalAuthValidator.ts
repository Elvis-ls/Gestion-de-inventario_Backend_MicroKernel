import { IAuthValidator, ValidationResult } from './IAuthValidator';

/**
 * Validador para autenticación local
 * Implementación concreta del patrón Abstract Factory
 */
export class LocalAuthValidator implements IAuthValidator {
  
  /**
   * Valida credenciales de usuario local
   */
  validateCredentials(credentials: any): ValidationResult {
    const errors: string[] = [];
    
    // Validar existencia de campos
    if (!credentials.usuario) {
      errors.push('El usuario es requerido');
    }
    
    if (!credentials.contrasena) {
      errors.push('La contraseña es requerida');
    }
    
    // Validar formato de usuario
    if (credentials.usuario) {
      if (credentials.usuario.length < 3) {
        errors.push('El usuario debe tener al menos 3 caracteres');
      }
      
      if (credentials.usuario.length > 50) {
        errors.push('El usuario no puede exceder 50 caracteres');
      }
      
      // Solo alfanuméricos y guiones bajos
      if (!/^[a-zA-Z0-9_]+$/.test(credentials.usuario)) {
        errors.push('El usuario solo puede contener letras, números y guiones bajos');
      }
    }
    
    // Validar contraseña
    if (credentials.contrasena) {
      if (credentials.contrasena.length < 4) {
        errors.push('La contraseña debe tener al menos 4 caracteres');
      }
      
      if (credentials.contrasena.length > 100) {
        errors.push('La contraseña no puede exceder 100 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      sanitizedData: this.sanitizeInput(credentials)
    };
  }
  
  /**
   * Valida formato de token (no aplica para local auth)
   */
  validateTokenFormat(token: string): boolean {
    return false;
  }
  
  /**
   * Sanitiza las credenciales de entrada
   */
  sanitizeInput(input: any): any {
    if (!input) return {};
    
    return {
      usuario: input.usuario ? String(input.usuario).trim() : undefined,
      contrasena: input.contrasena ? String(input.contrasena) : undefined
    };
  }
}