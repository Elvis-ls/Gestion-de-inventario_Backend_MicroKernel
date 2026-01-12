import { AuthFactory } from './AuthFactory';
import { IAuthStrategy } from '../strategies/IAuthStrategy';
import { IAuthValidator } from '../validators/IAuthValidator';
import { JWTAuthStrategy } from '../strategies/JWTAuthStrategy';
import { JWTAuthValidator } from '../validators/JWTAuthValidator';
import { DatabaseService } from '../../../database/database.service';

/**
 * Concrete Factory para autenticación JWT
 * Crea toda la familia de objetos necesarios para auth JWT
 */
export class JWTAuthFactory extends AuthFactory {
  constructor(private db: DatabaseService) {
    super();
  }

  createAuthStrategy(): IAuthStrategy {
    return new JWTAuthStrategy(this.db);
  }

  createValidator(): IAuthValidator {
    return new JWTAuthValidator();
  }

  getAuthType(): string {
    return 'jwt';
  }
}