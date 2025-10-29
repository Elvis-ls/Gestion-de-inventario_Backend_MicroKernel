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
   * Elimina (soft delete) una categoría
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

  /**
   *  DASHBOARD: Estadísticas de proveedores
   */
  async getEstadisticas(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_proveedores,
        COUNT(CASE WHEN idestado = 1 THEN 1 END) as activos,
        COUNT(CASE WHEN idestado = 2 THEN 1 END) as inactivos
      FROM proveedores
    `;
    
    const result = await this.db.query(query);
    return result.rows[0];
  }

  /**
   *  DASHBOARD: Proveedores con más productos
   */
  async getProveedoresConMasProductos(): Promise<any[]> {
    const query = `
      SELECT 
        pr.idproveedor,
        pr.nombreempresa,
        pr.telefono,
        pr.email,
        COUNT(p.codigo) as total_productos,
        SUM(p.stockactual) as stock_total,
        SUM(p.stockactual * p.precioventa) as valor_inventario
      FROM proveedores pr
      LEFT JOIN productos p ON pr.idproveedor = p.idproveedor AND p.idestado = 1
      WHERE pr.idestado = 1
      GROUP BY pr.idproveedor, pr.nombreempresa, pr.telefono, pr.email
      HAVING COUNT(p.codigo) > 0
      ORDER BY total_productos DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   *  DASHBOARD: Top proveedores por valor de inventario
   */
  async getTopProveedoresPorValor(): Promise<any[]> {
    const query = `
      SELECT 
        pr.idproveedor,
        pr.nombreempresa,
        COUNT(p.codigo) as total_productos,
        SUM(p.stockactual * p.preciocompra) as costo_total,
        SUM(p.stockactual * p.precioventa) as valor_venta_total,
        SUM(p.stockactual * (p.precioventa - p.preciocompra)) as ganancia_potencial
      FROM proveedores pr
      LEFT JOIN productos p ON pr.idproveedor = p.idproveedor AND p.idestado = 1
      WHERE pr.idestado = 1
      GROUP BY pr.idproveedor, pr.nombreempresa
      HAVING SUM(p.stockactual * p.precioventa) > 0
      ORDER BY valor_venta_total DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   *  DASHBOARD: Productos por proveedor específico
   */
  async getProductosPorProveedor(idProveedor: number): Promise<any[]> {
    const query = `
      SELECT 
        p.codigo,
        p.nombre,
        p.stockactual,
        p.preciocompra,
        p.precioventa,
        c.nombre as categoria_nombre,
        (p.stockactual * p.precioventa) as valor_stock
      FROM productos p
      LEFT JOIN categorias c ON p.idcategoria = c.idcategoria
      WHERE p.idproveedor = $1 AND p.idestado = 1
      ORDER BY valor_stock DESC
    `;
    
    const result = await this.db.query(query, [idProveedor]);
    return result.rows;
  }
}