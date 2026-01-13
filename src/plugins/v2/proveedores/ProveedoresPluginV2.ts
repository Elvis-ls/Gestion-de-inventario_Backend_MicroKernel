import { IProveedoresPlugin, Proveedor } from '../../../core/interfaces/IProveedoresPlugin';
import { EventBus } from '../../../core/EventBus';
import { Router } from 'express';
import { IDatabasePlugin } from '../../../core/interfaces/IDatabasePlugin';
import { ProveedoresServiceV2 } from './ProveedoresServiceV2';
import { ProveedoresControllerV2 } from './ProveedoresControllerV2';
import { createProveedoresRoutesV2 } from './ProveedoresRoutesV2';

export class ProveedoresPluginV2 implements IProveedoresPlugin {
  public readonly name = 'proveedores';
  public readonly version = '2.0.0';

  private service!: ProveedoresServiceV2;
  private controller!: ProveedoresControllerV2;
  private router!: Router;
  private dbPlugin: IDatabasePlugin;

  constructor(databasePlugin: IDatabasePlugin) {
    this.dbPlugin = databasePlugin;
  }

  async initialize(eventBus: EventBus): Promise<void> {
    console.log(' [ProveedoresV2] Inicializando...');

    this.service = new ProveedoresServiceV2(this.dbPlugin);
    this.controller = new ProveedoresControllerV2(this.service);
    this.router = createProveedoresRoutesV2(this.controller);

    console.log(' [ProveedoresV2] Inicializado');
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
