// src/plugins/auth/auth.service.ts

import { DatabaseService } from '../database/database.service';
import { AdminDB } from './auth.model';
import { IAuthStrategy } from './strategies/IAuthStrategy';

/**
 * Servicio de lógica de negocio para Autenticación
 * Ahora usa la Strategy del Abstract Factory
 */
export class AuthService {
  private strategy?: IAuthStrategy;

  constructor(
    private db: DatabaseService,
    strategy?: IAuthStrategy
  ) {
    this.strategy = strategy;
  }

  /**
   * Autentica a un administrador usando la estrategia configurada
   * Si hay strategy, la usa; si no, usa el método directo (backward compatibility)
   */
  async login(usuario: string, contrasena: string): Promise<AdminDB | null> {
    // Si hay strategy configurada, usarla
    if (this.strategy) {
      const result = await this.strategy.authenticate({ usuario, contrasena });
      
      if (result.success && result.user) {
        // Convertir el resultado a AdminDB
        return {
          idadmin: result.user.id,
          usuario: result.user.usuario,
          nombreapellido: result.user.nombreapellido || '',
          numero: undefined
        };
      }
      return null;
    }

    // Fallback: Método directo (mantiene compatibilidad)
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE usuario = $1 AND contrasena = $2
    `;
    
    const result = await this.db.query(query, [usuario, contrasena]);

    if (result.rows.length > 0) {
      return result.rows[0] as AdminDB;
    }

    return null;
  }

  /**
   * Obtiene un administrador por ID
   */
  async getById(id: number): Promise<AdminDB | null> {
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE idadmin = $1
    `;
    
    const result = await this.db.query(query, [id]);

    if (result.rows.length > 0) {
      return result.rows[0] as AdminDB;
    }

    return null;
  }

  /**
   * Obtiene un administrador por nombre de usuario
   */
  async getByUsername(usuario: string): Promise<AdminDB | null> {
    const query = `
      SELECT idadmin, nombreapellido, numero, usuario
      FROM admin
      WHERE usuario = $1
    `;
    
    const result = await this.db.query(query, [usuario]);

    if (result.rows.length > 0) {
      return result.rows[0] as AdminDB;
    }

    return null;
  }

  /**
   * Establece la estrategia de autenticación (permite cambiarla dinámicamente)
   */
  setStrategy(strategy: IAuthStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Obtiene la estrategia actual
   */
  getStrategy(): IAuthStrategy | undefined {
    return this.strategy;
  }
}