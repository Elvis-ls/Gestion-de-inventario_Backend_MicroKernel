import { IProveedoresPlugin, Proveedor } from '../../../core/interfaces/IProveedoresPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { ProveedoresServiceV1 } from './ProveedoresServiceV1';
import { ProveedoresControllerV1 } from './ProveedoresControllerV1';
import { createProveedoresRoutesV1 } from './ProveedoresRoutesV1';

export class ProveedoresPluginV1 implements IProveedoresPlugin {
  public readonly name = 'proveedores';
  public readonly version = '1.0.0';

  private service!: ProveedoresServiceV1;
  private controller!: ProveedoresControllerV1;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [ProveedoresV1] Inicializando...');

    this.service = new ProveedoresServiceV1(this.dbPlugin);
    this.controller = new ProveedoresControllerV1(this.service);
    this.router = createProveedoresRoutesV1(this.controller);

    console.log(' [ProveedoresV1] Inicializado');
  }

  async getAll(): Promise<Proveedor[]> {
    return await this.service.getAll();
  }

  async getById(id: number): Promise<Proveedor | null> {
    return await this.service.getById(id);
  }

  async create(proveedor: Proveedor): Promise<Proveedor> {
    return await this.service.create(proveedor);
  }

  async update(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor | null> {
    return await this.service.update(id, proveedor);
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
    console.log(' [ProveedoresV1] Cerrando...');
  }
}
