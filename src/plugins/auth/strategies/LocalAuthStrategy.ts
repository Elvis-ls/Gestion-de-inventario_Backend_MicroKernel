import { IAuthStrategy, AuthCredentials, AuthResult } from './IAuthStrategy';
import { DatabaseService } from '../../database/database.service';

/**
 * Estrategia de autenticación local (usuario/contraseña en BD)
 * Implementación concreta del patrón Abstract Factory
 */
export class LocalAuthStrategy implements IAuthStrategy {
  constructor(private db: DatabaseService) {}

  /**
   * Autentica usando usuario y contraseña local
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    const { usuario, contrasena } = credentials;

    if (!usuario || !contrasena) {
      return {
        success: false,
        message: 'Usuario y contraseña son requeridos'
      };
    }

    try {
      const query = `
        SELECT idadmin, nombreapellido, numero, usuario
        FROM admin
        WHERE usuario = $1 AND contrasena = $2
      `;
      
      const result = await this.db.query(query, [usuario, contrasena]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      const user = result.rows[0];

      return {
        success: true,
        user: {
          id: user.idadmin,
          usuario: user.usuario,
          nombreapellido: user.nombreapellido
        },
        message: 'Autenticación exitosa'
      };

    } catch (error) {
      console.error('[LocalAuthStrategy] Error en autenticación:', error);
      return {
        success: false,
        message: 'Error en el servidor'
      };
    }
  }

  /**
   * Para auth local, no hay tokens que validar
   */
  async validateToken(token: string): Promise<boolean> {
    // Local auth no usa tokens persistentes
    return false;
  }

  /**
   * Cierre de sesión (para local auth, no hace nada)
   */
  async logout(token: string): Promise<void> {
    // Local auth no mantiene sesiones persistentes
    console.log('[LocalAuthStrategy] Logout ejecutado');
  }
}