import { AuthFactory } from './AuthFactory';
import { IAuthStrategy } from '../strategies/IAuthStrategy';
import { IAuthValidator } from '../validators/IAuthValidator';
import { LocalAuthStrategy } from '../strategies/LocalAuthStrategy';
import { LocalAuthValidator } from '../validators/LocalAuthValidator';
import { DatabaseService } from '../../../database/database.service';

/**
 * Concrete Factory para autenticación local
 * Crea toda la familia de objetos necesarios para auth local
 */
export class LocalAuthFactory extends AuthFactory {
  constructor(private db: DatabaseService) {
    super();
  }

  /**
   * Crea la estrategia de autenticación local
   */
  createAuthStrategy(): IAuthStrategy {
    return new LocalAuthStrategy(this.db);
  }

  /**
   * Crea el validador para autenticación local
   */
  createValidator(): IAuthValidator {
    return new LocalAuthValidator();
  }

  /**
   * Retorna el tipo de autenticación
   */
  getAuthType(): string {
    return 'local';
  }
}