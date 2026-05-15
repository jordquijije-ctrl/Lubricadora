const EstadisticaModel = require('./models-Estadistica');

class EstadisticaController {
  static async getGenerales(req, res) {
    try {
      const stats = await EstadisticaModel.getGenerales();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopProductos(req, res) {
    try {
      const limite = req.query.limite || 10;
      const productos = await EstadisticaModel.getTopProductos(parseInt(limite));
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVentasPorPeriodo(req, res) {
    try {
      const periodo = req.query.periodo || 'mes';
      if (!['dia', 'semana', 'mes'].includes(periodo)) {
        return res.status(400).json({ error: 'Período debe ser "dia", "semana" o "mes"' });
      }
      const ventas = await EstadisticaModel.getVentasPorPeriodo(periodo);
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEstadoInventario(req, res) {
    try {
      const estado = await EstadisticaModel.getEstadoInventario();
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovimientosResumen(req, res) {
    try {
      const periodo = req.query.periodo || 'mes';
      if (!['dia', 'semana', 'mes'].includes(periodo)) {
        return res.status(400).json({ error: 'Período debe ser "dia", "semana" o "mes"' });
      }
      const resumen = await EstadisticaModel.getMovimientosResumen(periodo);
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EstadisticaController;
