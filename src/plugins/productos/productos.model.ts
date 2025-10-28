/**
 * Modelo de Producto
 */
export interface Producto {
  codigo?: number;
  nombre: string;
  descripcion?: string;
  idcategoria?: number;
  idproveedor?: number;
  preciocompra: number;
  precioventa: number;
  stockactual?: number;
  stockminimo?: number;
  fechavencimiento?: Date | string;
  idestado?: number;
}

export interface ProductoCompleto extends Producto {
  categoria_nombre?: string;
  proveedor_nombre?: string;
  estado_nombre?: string;
}