import { DatabaseService } from '../database/database.service';
import { Admin } from './auth.model';

/**
 * Servicio de lógica de negocio para Autenticación
 */
export class AuthService {
  constructor(private db: DatabaseService) {}

  /**
   * Autentica a un administrador
   */
  async login(usuario: string, contrasena: string): Promise<Omit<Admin, 'contrasena'> | null> {
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE usuario = $1 AND contrasena = $2
    `;
    
    const result = await this.db.query(query, [usuario, contrasena]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  }
}