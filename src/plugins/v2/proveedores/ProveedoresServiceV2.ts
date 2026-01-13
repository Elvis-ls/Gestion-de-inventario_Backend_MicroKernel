import { Proveedor } from '../../../core/interfaces/IProveedoresPlugin';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';

/**
 * Servicio de lógica de negocio para Proveedores V2
 */
export class ProveedoresServiceV2 {
  constructor(private db: IDatabasePlugin) {}

  /**
   * Obtiene todos los proveedores
   */
  async getAll(): Promise<Proveedor[]> {
    const query = `
      SELECT 
        p.idproveedor,
        p.nombreempresa,
        p.nombreceo,
        p.telefono,
        p.email,
        p.direccion,
        p.idestado
      FROM proveedores p
      ORDER BY p.idproveedor DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   * Obtiene un proveedor por ID
   */
  async getById(id: number): Promise<Proveedor | null> {
    const query = `
      SELECT 
        p.idproveedor,
        p.nombreempresa,
        p.nombreceo,
        p.telefono,
        p.email,
        p.direccion,
        p.idestado
      FROM proveedores p
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
   * Elimina un proveedor (actualiza productos a NULL y elimina)
   */
  async delete(id: number): Promise<boolean> {
    const client = await this.db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Primero, establecer idproveedor a NULL en los productos relacionados
      await client.query(
        `UPDATE productos SET idproveedor = NULL WHERE idproveedor = $1`,
        [id]
      );
      
      // Luego, eliminar el proveedor
      const result = await client.query(
        `DELETE FROM proveedores WHERE idproveedor = $1 RETURNING idproveedor`,
        [id]
      );
      
      await client.query('COMMIT');
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}