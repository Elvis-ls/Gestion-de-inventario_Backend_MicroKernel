import { IProductosPlugin, Producto } from '../../../core/interfaces/IProductosPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { ProductosServiceV2 } from './ProductosServiceV2';
import { ProductosControllerV2 } from './ProductosControllerV2';
import { createProductosRoutesV2 } from './ProductosRoutesV2';

export class ProductosPluginV2 implements IProductosPlugin {
  public readonly name = 'productos';
  public readonly version = '2.0.0';
  
  private service!: ProductosServiceV2;
  private controller!: ProductosControllerV2;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [ProductosV1] Inicializando...');
    
    this.service = new ProductosServiceV2(this.dbPlugin);
    this.controller = new ProductosControllerV2(this.service);
    this.router = createProductosRoutesV2(this.controller);
    
    console.log(' [ProductosV1] Inicializado');
  }

  async getAll(): Promise<Producto[]> {
    return await this.service.getAll();
  }

  async getById(id: number): Promise<Producto | null> {
    return await this.service.getById(id);
  }

  async create(producto: Producto): Promise<Producto> {
    return await this.service.create(producto);
  }

  async update(id: number, producto: Partial<Producto>): Promise<Producto | null> {
    return await this.service.update(id, producto);
  }

  async delete(id: number): Promise<boolean> {
    return await this.service.delete(id);
  }

  async getBajoStock(): Promise<Producto[]> {
    return await this.service.getProductosBajoStock();
  }

  getRoutes(): Router {
    return this.router;
  }

  dependencies(): string[] {
    return ['database'];
  }

  async shutdown(): Promise<void> {
    console.log(' [ProductosV1] Cerrando...');
  }
}