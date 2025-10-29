import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { createProveedoresRoutes } from './proveedores.routes';

/**
 * Plugin de Proveedores
 */
export class ProveedoresPlugin implements Plugin {
  public name = 'proveedores';
  public version = '1.0.0';
  
  private service!: ProveedoresService;
  private controller!: ProveedoresController;
  private router!: Router;

  dependencies(): string[] {
    return ['database'];
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log('🔌 [ProveedoresPlugin] Inicializando...');

    const dbService = DatabaseService.getInstance();

    this.service = new ProveedoresService(dbService);
    this.controller = new ProveedoresController(this.service);
    this.router = createProveedoresRoutes(this.controller);

    eventBus.on('proveedor:created', (data) => {
      console.log(' [ProveedoresPlugin] Nuevo proveedor creado:', data);
    });

    console.log(' [ProveedoresPlugin] Inicializado correctamente');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log(' [ProveedoresPlugin] Cerrando...');
  }
}