import { Pool } from 'pg';

interface Categoria {
  id?: number;
  nombre: string;
}

export class CategoriasService {
  private static pool: Pool;

  static initialize(pool: Pool): void {
    this.pool = pool;
  }

  // V2: Ahora incluye ordenamiento por nombre
  static async getAll(): Promise<Categoria[]> {
    const query = 'SELECT * FROM categorias ORDER BY nombre ASC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  static async getById(id: number): Promise<Categoria | null> {
    const query = 'SELECT * FROM categorias WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(nombre: string): Promise<Categoria> {
    const query = 'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *';
    const result = await this.pool.query(query, [nombre]);
    return result.rows[0];
  }

  static async update(id: number, nombre: string): Promise<Categoria | null> {
    const query = 'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [nombre, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM categorias WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  // V2: Nuevo método para contar productos por categoría
  static async getWithProductCount(): Promise<any[]> {
    const query = `
      SELECT c.*, COUNT(p.id) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id
      GROUP BY c.id
      ORDER BY c.nombre ASC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }
}