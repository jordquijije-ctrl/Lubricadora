const AlertaModel = require('./models-Alerta');

class AlertaController {
  static async getAll(req, res) {
    try {
      const alertas = await AlertaModel.getAll();
      res.json(alertas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByNivel(req, res) {
    try {
      const { nivel } = req.query;
      if (!['critico', 'bajo'].includes(nivel)) {
        return res.status(400).json({ error: 'Nivel debe ser "critico" o "bajo"' });
      }
      const alertas = await AlertaModel.getByNivel(nivel);
      res.json(alertas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSummary(req, res) {
    try {
      const summary = await AlertaModel.getSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AlertaController;
