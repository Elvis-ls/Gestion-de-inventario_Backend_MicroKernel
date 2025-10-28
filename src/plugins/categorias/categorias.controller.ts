import { Request, Response } from 'express';
import { CategoriasService } from './categorias.service';

/**
 * Controlador de Categorías
 * Maneja las peticiones HTTP
 */
export class CategoriasController {
  constructor(private service: CategoriasService) {}

  /**
   * GET /api/categorias
   */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.service.getAll();
      res.json({
        success: true,
        data: categorias
      });
    } catch (error) {
      console.error('[CategoriasController] Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo categorías'
      });
    }
  };

  /**
   * GET /api/categorias/:id
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoria = await this.service.getById(id);
      
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      console.error('[CategoriasController] Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo categoría'
      });
    }
  };

  /**
   * POST /api/categorias
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        data: categoria,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('[CategoriasController] Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando categoría'
      });
    }
  };

  /**
   * PUT /api/categorias/:id
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoria = await this.service.update(id, req.body);
      
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: categoria,
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      console.error('[CategoriasController] Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando categoría'
      });
    }
  };

  /**
   * DELETE /api/categorias/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.service.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('[CategoriasController] Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando categoría'
      });
    }
  };
}