const FacturaModel = require('./models-Factura');

class FacturaController {
  static async getAll(req, res) {
    try {
      const facturas = await FacturaModel.getAll();
      res.json(facturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const factura = await FacturaModel.getById(req.params.id);
      if (!factura) {
        return res.status(404).json({ error: 'Factura no encontrada' });
      }
      res.json(factura);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProximoNumero(req, res) {
    try {
      const numero = await FacturaModel.getProximoNumero();
      res.json({ numero_factura: numero });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { cliente, ruc_cliente, total, estado, usuario, notas, detalles } = req.body;

      // Validaciones
      if (!cliente) {
        return res.status(400).json({ error: 'Cliente es requerido' });
      }

      const resultado = await FacturaModel.create({
        cliente,
        ruc_cliente,
        total,
        estado,
        usuario,
        notas,
        detalles
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEstado(req, res) {
    try {
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({ error: 'Estado es requerido' });
      }

      const resultado = await FacturaModel.updateEstado(req.params.id, estado);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async anular(req, res) {
    try {
      const resultado = await FacturaModel.anular(req.params.id);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FacturaController;
