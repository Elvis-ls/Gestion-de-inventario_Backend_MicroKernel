import { ICategoriasPlugin, Categoria } from '../../../core/interfaces/ICategoriasPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { CategoriasServiceV1 } from './CategoriasServiceV1';
import { CategoriasControllerV1 } from './CategoriasControllerV1';
import { createCategoriasRoutesV1 } from './CategoriasRoutesV1';

export class CategoriasPluginV1 implements ICategoriasPlugin {
  public readonly name = 'categorias';
  public readonly version = '1.0.0';
  
  private service!: CategoriasServiceV1;
  private controller!: CategoriasControllerV1;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [CategoriasV1] Inicializando...');
    
    this.service = new CategoriasServiceV1(this.dbPlugin);
    this.controller = new CategoriasControllerV1(this.service);
    this.router = createCategoriasRoutesV1(this.controller);
    
    console.log(' [CategoriasV1] Inicializado');
  }

  async getAll(): Promise<Categoria[]> {
    return await this.service.getAll();
  }

  async getById(id: number): Promise<Categoria | null> {
    return await this.service.getById(id);
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return await this.service.create(categoria);
  }

  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria | null> {
    return await this.service.update(id, categoria);
  }

  async delete(id: number): Promise<boolean> {
    return await this.service.delete(id);
  }

  getRoutes(): Router {
    return this.router;
  }

  dependencies(): string[] {
    return ['database'];
  }

  async shutdown(): Promise<void> {
    console.log(' [CategoriasV1] Cerrando...');
  }
}