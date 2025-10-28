/**
 * Modelo de Proveedor
 */
export interface Proveedor {
  idproveedor?: number;
  nombreempresa: string;
  nombreceo?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  idestado?: number;
}

export interface ProveedorConEstado extends Proveedor {
  estado_nombre?: string;
}