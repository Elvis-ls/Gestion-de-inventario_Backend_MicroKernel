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

  /**
 * DELETE /api/productos/:id/permanente
 * Elimina FÍSICAMENTE el producto de la base de datos
 */
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
      message: 'Producto eliminado'
    });
  } catch (error) {
    console.error('[ProductosController] Error en deletePermanente:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando producto permanentemente'
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

  /**
 * GET /api/productos/dashboard/estadisticas
 */
getEstadisticas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const estadisticas = await this.service.getEstadisticas();
    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('[ProductosController] Error en getEstadisticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas de productos'
    });
  }
};

/**
 * GET /api/productos/dashboard/mas-movidos
 */
getProductosMasMovidos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const productos = await this.service.getProductosMasMovidos();
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('[ProductosController] Error en getProductosMasMovidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos más movidos'
    });
  }
};

/**
 * GET /api/productos/dashboard/proximos-vencer?dias=30
 */
getProductosProximosVencer = async (req: Request, res: Response): Promise<void> => {
  try {
    const dias = parseInt(req.query.dias as string) || 30;
    const productos = await this.service.getProductosProximosVencer(dias);
    res.json({
      success: true,
      data: productos,
      count: productos.length
    });
  } catch (error) {
    console.error('[ProductosController] Error en getProductosProximosVencer:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos próximos a vencer'
    });
  }
};

/**
 * GET /api/productos/dashboard/top-valor
 */
getTopProductosPorValor = async (_req: Request, res: Response): Promise<void> => {
  try {
    const productos = await this.service.getTopProductosPorValor();
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('[ProductosController] Error en getTopProductosPorValor:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo top productos por valor'
    });
  }
};

/**
 * GET /api/productos/dashboard/resumen-categoria
 */
getResumenPorCategoria = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resumen = await this.service.getResumenPorCategoria();
    res.json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error('[ProductosController] Error en getResumenPorCategoria:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo resumen por categoría'
    });
  }
};
}