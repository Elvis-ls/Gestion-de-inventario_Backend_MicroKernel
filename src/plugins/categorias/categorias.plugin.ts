import { Plugin } from '../../core/types';
import { EventBus } from '../../core/EventBus';
import { Router } from 'express';
import { DatabaseService } from '../database/database.service';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { createCategoriasRoutes } from './categorias.routes';

/**
 * Plugin de Categorías
 */
export class CategoriasPlugin implements Plugin {
  public name = 'categorias';
  public version = '1.0.0';
  
  private service!: CategoriasService;
  private controller!: CategoriasController;
  private router!: Router;

  dependencies(): string[] {
    return ['database']; // Depende del plugin de database
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log('🔌 [CategoriasPlugin] Inicializando...');

    // Obtener servicio de base de datos
    const dbService = DatabaseService.getInstance();

    // Inicializar capas
    this.service = new CategoriasService(dbService);
    this.controller = new CategoriasController(this.service);
    this.router = createCategoriasRoutes(this.controller);

    // Escuchar eventos (ejemplo)
    eventBus.on('categoria:created', (data) => {
      console.log('📢 [CategoriasPlugin] Nueva categoría creada:', data);
    });

    console.log('✅ [CategoriasPlugin] Inicializado correctamente');
  }

  getRoutes(): Router {
    return this.router;
  }

  async shutdown(): Promise<void> {
    console.log('🔌 [CategoriasPlugin] Cerrando...');
  }
}