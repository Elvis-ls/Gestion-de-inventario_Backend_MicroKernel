import { IPlugin } from './IPlugin';

export interface Proveedor {
  idproveedor?: number;
  nombreempresa: string;
  nombreceo?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  idestado?: number;
}

export interface IProveedoresPlugin extends IPlugin {
  getAll(): Promise<Proveedor[]>;
  getById(id: number): Promise<Proveedor | null>;
  create(proveedor: Proveedor): Promise<Proveedor>;
  update(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor | null>;
  delete(id: number): Promise<boolean>;
}