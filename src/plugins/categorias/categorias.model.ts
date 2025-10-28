/**
 * Modelo de Categoría
 */
export interface Categoria {
  idcategoria?: number;
  nombre: string;
  descripcion?: string;
  idestado?: number;
}

export interface CategoriaConEstado extends Categoria {
  estado_nombre?: string;
}