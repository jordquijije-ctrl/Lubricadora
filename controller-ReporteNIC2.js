const ReporteNIC2Model = require('./models-ReporteNIC2');

class ReporteNIC2Controller {
  static async getBalanceInventario(req, res) {
    try {
      const fecha = req.query.fecha || null;
      const balance = await ReporteNIC2Model.getBalanceInventario(fecha);
      res.json(balance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumenPorCategoria(req, res) {
    try {
      const fecha = req.query.fecha || null;
      const resumen = await ReporteNIC2Model.getResumenPorCategoria(fecha);
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovimientoMercancia(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const movimientos = await ReporteNIC2Model.getMovimientoMercancia(fecha_inicio, fecha_fin);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCostoVentas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const costos = await ReporteNIC2Model.getCostoVentas(fecha_inicio, fecha_fin);
      res.json(costos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFlujoCAja(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const flujo = await ReporteNIC2Model.getFlujoCAja(fecha_inicio, fecha_fin);
      res.json(flujo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReporteNIC2Controller;
