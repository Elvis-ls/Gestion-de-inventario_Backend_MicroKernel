import { Request, Response } from 'express';
import { ProductosService } from './productos.service';

/**
 * Controlador de Productos
 */
export class ProductosController {
  constructor(private service: ProductosService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const productos = await this.service.getAll();
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      console.error('[ProductosController] Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo productos'
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigo = parseInt(req.params.id);
      const producto = await this.service.getById(codigo);
      
      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('[ProductosController] Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo producto'
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const producto = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error('[ProductosController] Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando producto'
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigo = parseInt(req.params.id);
      const producto = await this.service.update(codigo, req.body);
      
      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: producto,
        message: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('[ProductosController] Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando producto'
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigo = parseInt(req.params.id);
      const deleted = await this.service.delete(codigo);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('[ProductosController] Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando producto'
      });
    }
  };

  getBajoStock = async (_req: Request, res: Response): Promise<void> => {
    try {
      const productos = await this.service.getProductosBajoStock();
      res.json({
        success: true,
        data: productos,
        count: productos.length
      });
    } catch (error) {
      console.error('[ProductosController] Error en getBajoStock:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo productos con stock bajo'
      });
    }
  };
}