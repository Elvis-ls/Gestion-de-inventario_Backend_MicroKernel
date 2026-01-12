import { Plugin } from '../../core/types';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { ProductosService } from './ProductosServiceV2';
import { ProductosController } from './ProductosControllerV2';
import { createProductosRoutes } from './ProductosRoutesV2';

/**
 * Plugin de Productos
 */
export class ProductosPlugin implements Plugin {
  public name = 'productos';
  public version = '1.0.0';
  
  private service!: ProductosService;
  private controller!: ProductosController;
  private router!: Router;

  dependencies(): string[] {
    return ['database'];
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [ProductosPlugin] Inicializando...');

    const dbService = DatabaseService.getInstance();

    this.service = new ProductosService(dbService);
    this.controller = new ProductosController(this.service);
    this.router = createProductosRoutes(this.controller);

    eventBus.on('producto:created', (data) => {
      console.log(' [ProductosPlugin] Nuevo producto creado:', data);
    });

    console.log(' [ProductosPlugin] Inicializado correctamente');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log(' [ProductosPlugin] Cerrando...');
  }
}