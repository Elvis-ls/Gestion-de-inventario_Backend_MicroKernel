import { IPlugin } from './IPlugin';

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

export interface IProductosPlugin extends IPlugin {
  getAll(): Promise<Producto[]>;
  getById(id: number): Promise<Producto | null>;
  create(producto: Producto): Promise<Producto>;
  update(id: number, producto: Partial<Producto>): Promise<Producto | null>;
  delete(id: number): Promise<boolean>;
  getBajoStock(): Promise<Producto[]>;
}