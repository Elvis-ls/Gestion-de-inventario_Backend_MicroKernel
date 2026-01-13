import { ICategoriasPlugin, Categoria } from '../../../core/interfaces/ICategoriasPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { CategoriasServiceV2 } from './CategoriasServiceV2';
import { CategoriasControllerV2 } from './CategoriasControllerV2';
import { createCategoriasRoutesV2 } from './CategoriasRoutesV2';

export class CategoriasPluginV2 implements ICategoriasPlugin {
  public readonly name = 'categorias';
  public readonly version = '2.0.0';
  
  private service!: CategoriasServiceV2;
  private controller!: CategoriasControllerV2;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [CategoriasV2] Inicializando...');
    
    this.service = new CategoriasServiceV2(this.dbPlugin);
    this.controller = new CategoriasControllerV2(this.service);
    this.router = createCategoriasRoutesV2(this.controller);
    
    console.log(' [CategoriasV2] Inicializado');
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
    console.log(' [CategoriasV2] Cerrando...');
  }
}