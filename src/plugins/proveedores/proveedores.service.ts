import { DatabaseService } from '../database/database.service';
import { Proveedor, ProveedorConEstado } from './proveedores.model';

/**
 * Servicio de lógica de negocio para Proveedores
 */
export class ProveedoresService {
  constructor(private db: DatabaseService) {}

  /**
   * Obtiene todos los proveedores
   */
  async getAll(): Promise<ProveedorConEstado[]> {
    const query = `
      SELECT 
        p.idproveedor,
        p.nombreempresa,
        p.nombreceo,
        p.telefono,
        p.email,
        p.direccion,
        p.idestado,
        e.nombre as estado_nombre
      FROM proveedores p
      LEFT JOIN estados e ON p.idestado = e.idestado
      ORDER BY p.idproveedor DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   * Obtiene un proveedor por ID
   */
  async getById(id: number): Promise<ProveedorConEstado | null> {
    const query = `
      SELECT 
        p.idproveedor,
        p.nombreempresa,
        p.nombreceo,
        p.telefono,
        p.email,
        p.direccion,
        p.idestado,
        e.nombre as estado_nombre
      FROM proveedores p
      LEFT JOIN estados e ON p.idestado = e.idestado
      WHERE p.idproveedor = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Crea un nuevo proveedor
   */
  async create(proveedor: Proveedor): Promise<Proveedor> {
    const query = `
      INSERT INTO proveedores (nombreempresa, nombreceo, telefono, email, direccion, idestado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      proveedor.nombreempresa,
      proveedor.nombreceo || null,
      proveedor.telefono || null,
      proveedor.email || null,
      proveedor.direccion || null,
      proveedor.idestado || 1
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Actualiza un proveedor
   */
  async update(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor | null> {
    const query = `
      UPDATE proveedores 
      SET 
        nombreempresa = COALESCE($1, nombreempresa),
        nombreceo = COALESCE($2, nombreceo),
        telefono = COALESCE($3, telefono),
        email = COALESCE($4, email),
        direccion = COALESCE($5, direccion),
        idestado = COALESCE($6, idestado)
      WHERE idproveedor = $7
      RETURNING *
    `;
    
    const values = [
      proveedor.nombreempresa,
      proveedor.nombreceo,
      proveedor.telefono,
      proveedor.email,
      proveedor.direccion,
      proveedor.idestado,
      id
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Elimina (soft delete) un proveedor
   */
  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE proveedores 
      SET idestado = 2
      WHERE idproveedor = $1
      RETURNING idproveedor
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}