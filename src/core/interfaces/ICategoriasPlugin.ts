import { IPlugin } from './IPlugin';

export interface Categoria {
  idcategoria?: number;
  nombre: string;
  descripcion?: string;
  idestado?: number;
}

export interface ICategoriasPlugin extends IPlugin {
  getAll(): Promise<Categoria[]>;
  getById(id: number): Promise<Categoria | null>;
  create(categoria: Categoria): Promise<Categoria>;
  update(id: number, categoria: Partial<Categoria>): Promise<Categoria | null>;
  delete(id: number): Promise<boolean>;
}