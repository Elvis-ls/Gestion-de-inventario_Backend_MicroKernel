import { Pool } from 'pg';

interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
}

export class ProveedoresService {
  private static pool: Pool;

  static initialize(pool: Pool): void {
    this.pool = pool;
  }

  // V2: Ahora ordena por nombre ascendente
  static async getAll(): Promise<Proveedor[]> {
    const query = 'SELECT * FROM proveedores ORDER BY nombre ASC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  static async getById(id: number): Promise<Proveedor | null> {
    const query = 'SELECT * FROM proveedores WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(proveedor: Proveedor): Promise<Proveedor> {
    const query = `
      INSERT INTO proveedores (nombre, contacto) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const result = await this.pool.query(query, [proveedor.nombre, proveedor.contacto]);
    return result.rows[0];
  }

  static async update(id: number, proveedor: Proveedor): Promise<Proveedor | null> {
    const query = `
      UPDATE proveedores 
      SET nombre = $1, contacto = $2 
      WHERE id = $3 
      RETURNING *
    `;
    const result = await this.pool.query(query, [proveedor.nombre, proveedor.contacto, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM proveedores WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  // V2: Nuevo método para buscar proveedores por nombre o contacto
  static async search(searchTerm: string): Promise<Proveedor[]> {
    const query = `
      SELECT * FROM proveedores 
      WHERE nombre ILIKE $1 OR contacto ILIKE $1 
      ORDER BY nombre ASC
    `;
    const result = await this.pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // V2: Nuevo método para contar proveedores
  static async getCount(): Promise<number> {
    const query = 'SELECT COUNT(*) as total FROM proveedores';
    const result = await this.pool.query(query);
    return parseInt(result.rows[0].total);
  }
}