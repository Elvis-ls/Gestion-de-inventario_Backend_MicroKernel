/**
 * Interface para validadores de autenticación
 * Parte del patrón Abstract Factory
 */
export interface IAuthValidator {
  /**
   * Valida las credenciales antes de procesarlas
   */
  validateCredentials(credentials: any): ValidationResult;
  
  /**
   * Valida el formato del token
   */
  validateTokenFormat(token: string): boolean;
  
  /**
   * Sanitiza las credenciales
   */
  sanitizeInput(input: any): any;
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  sanitizedData?: any;
}