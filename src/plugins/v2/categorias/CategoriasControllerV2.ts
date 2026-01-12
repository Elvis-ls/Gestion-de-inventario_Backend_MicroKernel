import { Request, Response } from 'express';
import { CategoriasService } from './CategoriasServiceV2';

export class CategoriasController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await CategoriasService.getAll();

      res.json({
        success: true,
        data: categorias,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener categorías',
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await CategoriasService.getById(Number(id));

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.json({
        success: true,
        data: categoria,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener categoría',
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        res.status(400).json({
          success: false,
          message: 'El nombre es requerido',
        });
        return;
      }

      const categoria = await CategoriasService.create(nombre);

      res.status(201).json({
        success: true,
        data: categoria,
        message: 'Categoría creada con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear categoría',
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      if (!nombre) {
        res.status(400).json({
          success: false,
          message: 'El nombre es requerido',
        });
        return;
      }

      const categoria = await CategoriasService.update(Number(id), nombre);

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.json({
        success: true,
        data: categoria,
        message: 'Categoría actualizada con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar categoría',
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await CategoriasService.delete(Number(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoría eliminada con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al eliminar categoría',
      });
    }
  }

  // V2: Nuevo endpoint para obtener categorías con conteo de productos
  static async getWithProductCount(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await CategoriasService.getWithProductCount();

      res.json({
        success: true,
        data: categorias,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener categorías',
      });
    }
  }
}