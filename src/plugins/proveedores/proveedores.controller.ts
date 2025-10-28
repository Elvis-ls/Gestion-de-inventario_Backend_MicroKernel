import { Request, Response } from 'express';
import { ProveedoresService } from './proveedores.service';

/**
 * Controlador de Proveedores
 */
export class ProveedoresController {
  constructor(private service: ProveedoresService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const proveedores = await this.service.getAll();
      res.json({
        success: true,
        data: proveedores
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo proveedores'
      });
    }
  };

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
      console.error('[ProveedoresController] Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo proveedor'
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const proveedor = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        data: proveedor,
        message: 'Proveedor creado exitosamente'
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando proveedor'
      });
    }
  };

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
      console.error('[ProveedoresController] Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando proveedor'
      });
    }
  };

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
      console.error('[ProveedoresController] Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando proveedor'
      });
    }
  };

  getEstadisticas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const estadisticas = await this.service.getEstadisticas();
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en getEstadisticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo estadísticas'
      });
    }
  };

  /**
   * 📊 GET /api/proveedores/dashboard/con-mas-productos
   */
  getProveedoresConMasProductos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const proveedores = await this.service.getProveedoresConMasProductos();
      res.json({
        success: true,
        data: proveedores
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en getProveedoresConMasProductos:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo proveedores'
      });
    }
  };

  /**
   * 📊 GET /api/proveedores/dashboard/top-valor
   */
  getTopProveedoresPorValor = async (_req: Request, res: Response): Promise<void> => {
    try {
      const top = await this.service.getTopProveedoresPorValor();
      res.json({
        success: true,
        data: top
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en getTopProveedoresPorValor:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo top proveedores'
      });
    }
  };

  /**
   * 📊 GET /api/proveedores/:id/productos
   */
  getProductosPorProveedor = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const productos = await this.service.getProductosPorProveedor(id);
      res.json({
        success: true,
        data: productos,
        count: productos.length
      });
    } catch (error) {
      console.error('[ProveedoresController] Error en getProductosPorProveedor:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo productos del proveedor'
      });
    }
  };
}