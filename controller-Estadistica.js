const EstadisticaModel = require('./models-Estadistica');

class EstadisticaController {
  static async getGenerales(req, res) {
    try {
      const stats = await EstadisticaModel.getGenerales();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas generales' });
    }
  }

  static async getTopProductos(req, res) {
    try {
      const productos = await EstadisticaModel.getTopProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el top de productos' });
    }
  }

  static async getEstadoInventario(req, res) {
    try {
      const estado = await EstadisticaModel.getEstadoInventario();
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado del inventario' });
    }
  }

  static async getDashboard(req, res) {
    try {
      const data = await EstadisticaModel.getDashboard();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al cargar dashboard' });
    }
  }
}

module.exports = EstadisticaController;