const AlertaModel = require('./models-Alerta');

class AlertaController {
  static async getAll(req, res) {
    try {
      const alertas = await AlertaModel.getAll();
      res.json(alertas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista de alertas' });
    }
  }

  static async getSummary(req, res) {
    try {
      const summary = await AlertaModel.getSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: 'Error al generar el resumen de inventario' });
    }
  }
}

module.exports = AlertaController;