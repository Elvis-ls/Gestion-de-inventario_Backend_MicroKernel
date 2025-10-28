import { DatabaseService } from '../database/database.service';
import { Categoria, CategoriaConEstado } from './categorias.model';

/**
 * Servicio de lógica de negocio para Categorías
 */
export class CategoriasService {
  constructor(private db: DatabaseService) {}

  /**
   * Obtiene todas las categorías
   */
  async getAll(): Promise<CategoriaConEstado[]> {
    const query = `
      SELECT 
        c.idcategoria,
        c.nombre,
        c.descripcion,
        c.idestado,
        e.nombre as estado_nombre
      FROM categorias c
      LEFT JOIN estados e ON c.idestado = e.idestado
      ORDER BY c.idcategoria DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   * Obtiene una categoría por ID
   */
  async getById(id: number): Promise<CategoriaConEstado | null> {
    const query = `
      SELECT 
        c.idcategoria,
        c.nombre,
        c.descripcion,
        c.idestado,
        e.nombre as estado_nombre
      FROM categorias c
      LEFT JOIN estados e ON c.idestado = e.idestado
      WHERE c.idcategoria = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Crea una nueva categoría
   */
  async create(categoria: Categoria): Promise<Categoria> {
    const query = `
      INSERT INTO categorias (nombre, descripcion, idestado)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [
      categoria.nombre,
      categoria.descripcion || null,
      categoria.idestado || 1 // Estado activo por defecto
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Actualiza una categoría
   */
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

  /**
   * Elimina (soft delete) una categoría
   */
  async delete(id: number): Promise<boolean> {
    // Cambiar estado a inactivo (idestado = 2 asumiendo que es inactivo)
    const query = `
      UPDATE categorias 
      SET idestado = 2
      WHERE idcategoria = $1
      RETURNING idcategoria
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}