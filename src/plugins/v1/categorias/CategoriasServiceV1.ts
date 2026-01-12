import { Categoria } from '../../../core/interfaces/ICategoriasPlugin';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';

export class CategoriasServiceV1 {
  constructor(private db: IDatabasePlugin) {}

  async getAll(): Promise<Categoria[]> {
    const query = `
      SELECT idcategoria, nombre, descripcion, idestado
      FROM categorias
      ORDER BY idcategoria DESC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  async getById(id: number): Promise<Categoria | null> {
    const query = `
      SELECT idcategoria, nombre, descripcion, idestado
      FROM categorias
      WHERE idcategoria = $1
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(categoria: Categoria): Promise<Categoria> {
    const query = `
      INSERT INTO categorias (nombre, descripcion, idestado)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      categoria.nombre,
      categoria.descripcion || null,
      categoria.idestado || 1
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria | null> {
    const query = `
      UPDATE categorias 
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        idestado = COALESCE($3, idestado)
      WHERE idcategoria = $4
      RETURNING *
    `;
    const values = [
      categoria.nombre,
      categoria.descripcion,
      categoria.idestado,
      id
    ];
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    try {
      const client = await this.db.getClient();
      await client.query('BEGIN');
      
      await client.query(
        `UPDATE productos SET idcategoria = NULL WHERE idcategoria = $1`,
        [id]
      );
      
      const result = await client.query(
        `UPDATE categorias SET idestado = 2 WHERE idcategoria = $1`,
        [id]
      );
      
      await client.query('COMMIT');
      client.release();
      
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      const client = await this.db.getClient();
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }
  }
}