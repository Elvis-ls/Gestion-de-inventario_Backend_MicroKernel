import { Request, Response } from 'express';
import { ProveedoresService } from './ProveedoresServiceV2';

export class ProveedoresController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const proveedores = await ProveedoresService.getAll();

      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener proveedores',
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const proveedor = await ProveedoresService.getById(Number(id));

      if (!proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: proveedor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener proveedor',
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, contacto } = req.body;

      if (!nombre || !contacto) {
        res.status(400).json({
          success: false,
          message: 'Nombre y contacto son requeridos',
        });
        return;
      }

      const proveedor = await ProveedoresService.create({ nombre, contacto });

      res.status(201).json({
        success: true,
        data: proveedor,
        message: 'Proveedor creado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear proveedor',
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, contacto } = req.body;

      if (!nombre || !contacto) {
        res.status(400).json({
          success: false,
          message: 'Nombre y contacto son requeridos',
        });
        return;
      }

      const proveedor = await ProveedoresService.update(Number(id), { nombre, contacto });

      if (!proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: proveedor,
        message: 'Proveedor actualizado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar proveedor',
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ProveedoresService.delete(Number(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Proveedor eliminado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al eliminar proveedor',
      });
    }
  }

  // V2: Nuevo endpoint para buscar proveedores
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'El parámetro q es requerido',
        });
        return;
      }

      const proveedores = await ProveedoresService.search(q as string);

      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al buscar proveedores',
      });
    }
  }

  // V2: Nuevo endpoint para obtener el conteo total
  static async getCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await ProveedoresService.getCount();

      res.json({
        success: true,
        data: { total: count },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al contar proveedores',
      });
    }
  }
}