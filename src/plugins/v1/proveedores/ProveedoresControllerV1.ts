import { Request, Response } from 'express';
import { ProveedoresServiceV1 } from './ProveedoresServiceV1';

/**
 * Controlador de Proveedores V1
 * Maneja las peticiones HTTP
 */
export class ProveedoresControllerV1 {
  constructor(private service: ProveedoresServiceV1) {}

  /**
   * GET /api/proveedores
   */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const proveedores = await this.service.getAll();
      res.json({
        success: true,
        data: proveedores
      });
    } catch (error) {
      console.error('[ProveedoresControllerV1] Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo proveedores'
      });
    }
  };

  /**
   * GET /api/proveedores/:id
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const proveedor = await this.service.getById(id);
      
      if (!proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: proveedor
      });
    } catch (error) {
      console.error('[ProveedoresControllerV1] Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo proveedor'
      });
    }
  };

  /**
   * POST /api/proveedores
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const proveedor = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        data: proveedor,
        message: 'Proveedor creado exitosamente'
      });
    } catch (error) {
      console.error('[ProveedoresControllerV1] Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando proveedor'
      });
    }
  };

  /**
   * PUT /api/proveedores/:id
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const proveedor = await this.service.update(id, req.body);
      
      if (!proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: proveedor,
        message: 'Proveedor actualizado exitosamente'
      });
    } catch (error) {
      console.error('[ProveedoresControllerV1] Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando proveedor'
      });
    }
  };

  /**
   * DELETE /api/proveedores/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.service.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Proveedor eliminado exitosamente'
      });
    } catch (error) {
      console.error('[ProveedoresControllerV1] Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando proveedor'
      });
    }
  };
}