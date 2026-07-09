const MovimientoModel = require('../models/movimiento.model');

class MovimientoController {
  static async getAll(req, res) {
    try {
      const filtros = {
        tipo: req.query.tipo,
        producto_id: req.query.producto_id
      };
      
      const movimientos = await MovimientoModel.getAll(filtros);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByProducto(req, res) {
    try {
      const movimientos = await MovimientoModel.getByProducto(req.params.producto_id);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async registrarEntrada(req, res) {
    try {
      const { producto_id, cantidad, referencia, usuario, proveedor_id, descripcion } = req.body;

      // Validaciones
      if (!producto_id || !cantidad) {
        return res.status(400).json({ error: 'Producto y cantidad son requeridos' });
      }

      const resultado = await MovimientoModel.registrarEntrada({
        producto_id,
        cantidad,
        referencia,
        usuario,
        proveedor_id,
        descripcion
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async registrarSalida(req, res) {
    try {
      const { producto_id, cantidad, referencia, usuario, descripcion } = req.body;

      if (!producto_id || !cantidad) {
        return res.status(400).json({ error: 'Producto y cantidad son requeridos' });
      }

      const resultado = await MovimientoModel.registrarSalida({
        producto_id,
        cantidad,
        referencia,
        usuario,
        descripcion
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await MovimientoModel.delete(req.params.id);
      res.json({ success: true, message: 'Movimiento eliminado y stock revertido' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovimientoController;
