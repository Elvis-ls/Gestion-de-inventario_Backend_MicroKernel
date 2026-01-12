import { Request, Response } from 'express';
import { ProductosService } from './ProductosServiceV2';

export class ProductosController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductosService.getAll();

      res.json({
        success: true,
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener productos',
      });
    }
  }

  static async getBajoStock(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductosService.getBajoStock();

      res.json({
        success: true,
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener productos',
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const producto = await ProductosService.getById(Number(id));

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: producto,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener producto',
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, precio, cantidad, categoria_id } = req.body;

      if (!nombre || !precio || !cantidad || !categoria_id) {
        res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos',
        });
        return;
      }

      const producto = await ProductosService.create({
        nombre,
        precio,
        cantidad,
        categoria_id,
      });

      res.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear producto',
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, precio, cantidad, categoria_id } = req.body;

      if (!nombre || !precio || !cantidad || !categoria_id) {
        res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos',
        });
        return;
      }

      const producto = await ProductosService.update(Number(id), {
        nombre,
        precio,
        cantidad,
        categoria_id,
      });

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: producto,
        message: 'Producto actualizado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar producto',
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ProductosService.delete(Number(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Producto eliminado con éxito',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al eliminar producto',
      });
    }
  }

  // V2: Nuevo endpoint para buscar productos por nombre
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.query;

      if (!nombre) {
        res.status(400).json({
          success: false,
          message: 'El parámetro nombre es requerido',
        });
        return;
      }

      const productos = await ProductosService.searchByName(nombre as string);

      res.json({
        success: true,
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al buscar productos',
      });
    }
  }
}