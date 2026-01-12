import { IAuthStrategy } from '../strategies/IAuthStrategy';
import { IAuthValidator } from '../validators/IAuthValidator';

/**
 * Abstract Factory para crear familias de objetos de autenticación
 * Este patrón permite crear diferentes tipos de autenticación sin
 * exponer la lógica de creación
 */
export abstract class AuthFactory {
  /**
   * Crea una estrategia de autenticación específica
   */
  abstract createAuthStrategy(): IAuthStrategy;
  
  /**
   * Crea un validador específico para el tipo de autenticación
   */
  abstract createValidator(): IAuthValidator;
  
  /**
   * Método de fábrica que retorna el tipo de autenticación
   */
  abstract getAuthType(): string;

  /**
   * Método helper para crear toda la familia de objetos
   */
  public createAuthComponents(): AuthComponents {
    return {
      strategy: this.createAuthStrategy(),
      validator: this.createValidator(),
      type: this.getAuthType()
    };
  }
}

/**
 * Interface que agrupa todos los componentes de autenticación
 */
export interface AuthComponents {
  strategy: IAuthStrategy;
  validator: IAuthValidator;
  type: string;
}