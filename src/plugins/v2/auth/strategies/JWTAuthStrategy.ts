import { IAuthStrategy, AuthCredentials, AuthResult } from './IAuthStrategy';
import { DatabaseService } from '../../../database/database.service';

/**
 * Estrategia de autenticación con JWT
 * Implementación concreta para demostrar extensibilidad
 * 
 * NOTA: Requiere instalar: npm install jsonwebtoken @types/jsonwebtoken
 */
export class JWTAuthStrategy implements IAuthStrategy {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_in_production';
  private readonly JWT_EXPIRATION = '24h';

  constructor(private db: DatabaseService) {}

  /**
   * Autentica y genera un JWT
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

      // Generar JWT (requiere librería jsonwebtoken)
      // const jwt = require('jsonwebtoken');
      // const token = jwt.sign(
      //   { 
      //     id: user.idadmin, 
      //     usuario: user.usuario 
      //   },
      //   this.JWT_SECRET,
      //   { expiresIn: this.JWT_EXPIRATION }
      // );

      // Por ahora, retornamos sin token real
      const mockToken = Buffer.from(JSON.stringify({
        id: user.idadmin,
        usuario: user.usuario,
        exp: Date.now() + 86400000 // 24 horas
      })).toString('base64');

      return {
        success: true,
        user: {
          id: user.idadmin,
          usuario: user.usuario,
          nombreapellido: user.nombreapellido
        },
        token: mockToken,
        expiresIn: 86400, // 24 horas en segundos
        message: 'Autenticación exitosa con JWT'
      };

    } catch (error) {
      console.error('[JWTAuthStrategy] Error en autenticación:', error);
      return {
        success: false,
        message: 'Error en el servidor'
      };
    }
  }

  /**
   * Valida un JWT
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // const jwt = require('jsonwebtoken');
      // jwt.verify(token, this.JWT_SECRET);
      // return true;
      
      // Mock de validación
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      return decoded.exp > Date.now();
    } catch (error) {
      return false;
    }
  }

  /**
   * Invalida un JWT (blacklist)
   */
  async logout(token: string): Promise<void> {
    // Aquí se implementaría blacklist de tokens
    console.log('[JWTAuthStrategy] Token invalidado:', token.substring(0, 10) + '...');
  }
}