import { DatabaseService } from '../database/database.service';
import { Producto, ProductoCompleto } from './productos.model';

/**
 * Servicio de lógica de negocio para Productos
 */
export class ProductosService {
  constructor(private db: DatabaseService) {}

  /**
   * Obtiene todos los productos con información relacionada
   */
  async getAll(): Promise<ProductoCompleto[]> {
    const query = `
      SELECT 
        p.codigo,
        p.nombre,
        p.descripcion,
        p.idcategoria,
        p.idproveedor,
        p.preciocompra,
        p.precioventa,
        p.stockactual,
        p.stockminimo,
        p.fechavencimiento,
        p.idestado,
        c.nombre as categoria_nombre,
        pr.nombreempresa as proveedor_nombre,
        e.nombre as estado_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.idcategoria = c.idcategoria
      LEFT JOIN proveedores pr ON p.idproveedor = pr.idproveedor
      LEFT JOIN estados e ON p.idestado = e.idestado
      ORDER BY p.codigo DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   * Obtiene un producto por código
   */
  async getById(codigo: number): Promise<ProductoCompleto | null> {
    const query = `
      SELECT 
        p.codigo,
        p.nombre,
        p.descripcion,
        p.idcategoria,
        p.idproveedor,
        p.preciocompra,
        p.precioventa,
        p.stockactual,
        p.stockminimo,
        p.fechavencimiento,
        p.idestado,
        c.nombre as categoria_nombre,
        pr.nombreempresa as proveedor_nombre,
        e.nombre as estado_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.idcategoria = c.idcategoria
      LEFT JOIN proveedores pr ON p.idproveedor = pr.idproveedor
      LEFT JOIN estados e ON p.idestado = e.idestado
      WHERE p.codigo = $1
    `;
    
    const result = await this.db.query(query, [codigo]);
    return result.rows[0] || null;
  }

  /**
   * Crea un nuevo producto
   */
  async create(producto: Producto): Promise<Producto> {
    const query = `
      INSERT INTO productos (
        nombre, descripcion, idcategoria, idproveedor, 
        preciocompra, precioventa, stockactual, stockminimo, 
        fechavencimiento, idestado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      producto.nombre,
      producto.descripcion || null,
      producto.idcategoria || null,
      producto.idproveedor || null,
      producto.preciocompra,
      producto.precioventa,
      producto.stockactual || 0,
      producto.stockminimo || 0,
      producto.fechavencimiento || null,
      producto.idestado || 1
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Actualiza un producto
   */
  async update(codigo: number, producto: Partial<Producto>): Promise<Producto | null> {
    const query = `
      UPDATE productos 
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        idcategoria = COALESCE($3, idcategoria),
        idproveedor = COALESCE($4, idproveedor),
        preciocompra = COALESCE($5, preciocompra),
        precioventa = COALESCE($6, precioventa),
        stockactual = COALESCE($7, stockactual),
        stockminimo = COALESCE($8, stockminimo),
        fechavencimiento = COALESCE($9, fechavencimiento),
        idestado = COALESCE($10, idestado)
      WHERE codigo = $11
      RETURNING *
    `;
    
    const values = [
      producto.nombre,
      producto.descripcion,
      producto.idcategoria,
      producto.idproveedor,
      producto.preciocompra,
      producto.precioventa,
      producto.stockactual,
      producto.stockminimo,
      producto.fechavencimiento,
      producto.idestado,
      codigo
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Elimina (soft delete) un producto
   */
  async delete(codigo: number): Promise<boolean> {
    const query = `
      UPDATE productos 
      SET idestado = 2
      WHERE codigo = $1
      RETURNING codigo
    `;
    
    const result = await this.db.query(query, [codigo]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Obtiene productos con stock bajo
   */
  async getProductosBajoStock(): Promise<ProductoCompleto[]> {
    const query = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        pr.nombreempresa as proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.idcategoria = c.idcategoria
      LEFT JOIN proveedores pr ON p.idproveedor = pr.idproveedor
      WHERE p.stockactual <= p.stockminimo
      AND p.idestado = 1
      ORDER BY p.stockactual ASC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }
}