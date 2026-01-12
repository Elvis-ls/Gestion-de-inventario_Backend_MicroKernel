import { Pool } from 'pg';

interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria_id: number;
}

export class ProductosService {
  private static pool: Pool;

  static initialize(pool: Pool): void {
    this.pool = pool;
  }

  // V2: Ahora incluye el nombre de la categoría en la consulta
  static async getAll(): Promise<any[]> {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nombre ASC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // V2: Stock bajo ahora es configurable (threshold de 15 en lugar de 10)
  static async getBajoStock(): Promise<Producto[]> {
    const query = 'SELECT * FROM productos WHERE cantidad <= $1 ORDER BY cantidad ASC';
    const result = await this.pool.query(query, [15]);
    return result.rows;
  }

  static async getById(id: number): Promise<Producto | null> {
    const query = 'SELECT * FROM productos WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(producto: Producto): Promise<Producto> {
    const query = `
      INSERT INTO productos (nombre, precio, cantidad, categoria_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      producto.nombre,
      producto.precio,
      producto.cantidad,
      producto.categoria_id,
    ]);
    return result.rows[0];
  }

  static async update(id: number, producto: Producto): Promise<Producto | null> {
    const query = `
      UPDATE productos 
      SET nombre = $1, precio = $2, cantidad = $3, categoria_id = $4 
      WHERE id = $5 
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      producto.nombre,
      producto.precio,
      producto.cantidad,
      producto.categoria_id,
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM productos WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  // V2: Nuevo método para buscar productos por nombre
  static async searchByName(nombre: string): Promise<Producto[]> {
    const query = 'SELECT * FROM productos WHERE nombre ILIKE $1 ORDER BY nombre ASC';
    const result = await this.pool.query(query, [`%${nombre}%`]);
    return result.rows;
  }
}