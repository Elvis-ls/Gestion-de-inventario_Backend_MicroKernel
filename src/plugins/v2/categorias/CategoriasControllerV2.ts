import { Request, Response } from 'express';
import { CategoriasServiceV2 } from './CategoriasServiceV2';

export class CategoriasControllerV2 {
  constructor(private service: CategoriasServiceV2) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.service.getAll();
      res.json({ success: true, data: categorias });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error obteniendo categorías' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoria = await this.service.getById(id);
      
      if (!categoria) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.json({ success: true, data: categoria });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error obteniendo categoría' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.create(req.body);
      res.status(201).json({ success: true, data: categoria, message: 'Categoría creada' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creando categoría' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoria = await this.service.update(id, req.body);
      
      if (!categoria) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.json({ success: true, data: categoria, message: 'Categoría actualizada' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error actualizando categoría' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.service.delete(id);
      
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.json({ success: true, message: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error eliminando categoría' });
    }
  };
}