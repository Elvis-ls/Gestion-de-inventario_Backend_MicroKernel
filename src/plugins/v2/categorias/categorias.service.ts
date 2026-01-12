import { DatabaseService } from '../../database/database.service';
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
  try {
    // Iniciar transacción
    await this.db.query('BEGIN');

    // 1. Primero quitar la categoría de los productos
    await this.db.query(
      `UPDATE productos SET idcategoria = NULL WHERE idcategoria = $1`,
      [id]
    );

    // 2. Luego cambiar estado de la categoría a inactivo
    const query = `
      UPDATE categorias 
      SET idestado = 2
      WHERE idcategoria = $1
      RETURNING idcategoria
    `;
    
    const result = await this.db.query(query, [id]);

    // Confirmar transacción
    await this.db.query('COMMIT');

    return result.rowCount ? result.rowCount > 0 : false;

  } catch (error) {
    // Si hay error, revertir cambios
    await this.db.query('ROLLBACK');
    throw error;
  }
}

  /**
   *  DASHBOARD: Obtiene estadísticas de categorías
   */
  async getEstadisticas(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_categorias,
        COUNT(CASE WHEN idestado = 1 THEN 1 END) as activas,
        COUNT(CASE WHEN idestado = 2 THEN 1 END) as inactivas
      FROM categorias
    `;
    
    const result = await this.db.query(query);
    return result.rows[0];
  }

  /**
   *  DASHBOARD: Categorías con cantidad de productos
   */
  async getCategoriasConProductos(): Promise<any[]> {
    const query = `
      SELECT 
        c.idcategoria,
        c.nombre,
        c.descripcion,
        COUNT(p.codigo) as total_productos,
        SUM(p.stockactual) as stock_total,
        e.nombre as estado_nombre
      FROM categorias c
      LEFT JOIN productos p ON c.idcategoria = p.idcategoria AND p.idestado = 1
      LEFT JOIN estados e ON c.idestado = e.idestado
      WHERE c.idestado = 1
      GROUP BY c.idcategoria, c.nombre, c.descripcion, e.nombre
      ORDER BY total_productos DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   *  DASHBOARD: Top categorías por valor de inventario
   */
  async getTopCategoriasPorValor(): Promise<any[]> {
    const query = `
      SELECT 
        c.idcategoria,
        c.nombre,
        COUNT(p.codigo) as total_productos,
        SUM(p.stockactual * p.precioventa) as valor_inventario
      FROM categorias c
      LEFT JOIN productos p ON c.idcategoria = p.idcategoria AND p.idestado = 1
      WHERE c.idestado = 1
      GROUP BY c.idcategoria, c.nombre
      HAVING SUM(p.stockactual * p.precioventa) > 0
      ORDER BY valor_inventario DESC
      LIMIT 5
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }
}