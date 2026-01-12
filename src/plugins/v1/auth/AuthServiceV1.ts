import { AuthResult } from '../../../core/interfaces/IAuthPlugin';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';

export class AuthServiceV1 {
  constructor(private db: IDatabasePlugin) {}

  async login(usuario: string, contrasena: string): Promise<AuthResult> {
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE usuario = $1 AND contrasena = $2
    `;
    
    try {
      const result = await this.db.query(query, [usuario, contrasena]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        return {
          success: true,
          user: {
            id: user.idadmin,
            usuario: user.usuario,
            nombreapellido: user.nombreapellido
          },
          message: 'Autenticación local exitosa'
        };
      }

      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    } catch (error) {
      console.error('[AuthServiceV1] Error en login:', error);
      return {
        success: false,
        message: 'Error en el servidor'
      };
    }
  }

  async getById(id: number): Promise<any> {
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE idadmin = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }
}