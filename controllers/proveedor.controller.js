const ProveedorModel = require('../models/proveedor.model');

class ProveedorController {
  static async getAll(req, res) {
    try {
      const proveedores = await ProveedorModel.getAll();
      res.json(proveedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const proveedor = await ProveedorModel.getById(req.params.id);
      if (!proveedor) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nombre, ruc, categoria, ciudad, telefono, email, contacto } = req.body;

      // Validaciones
      if (!nombre || !ruc) {
        return res.status(400).json({ error: 'Nombre y RUC son requeridos' });
      }

      const resultado = await ProveedorModel.create({
        nombre,
        ruc,
        categoria,
        ciudad,
        telefono,
        email,
        contacto
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { nombre, ruc, categoria, ciudad, telefono, email, contacto } = req.body;

      if (!nombre || !ruc) {
        return res.status(400).json({ error: 'Nombre y RUC son requeridos' });
      }

      const resultado = await ProveedorModel.update(req.params.id, {
        nombre,
        ruc,
        categoria,
        ciudad,
        telefono,
        email,
        contacto
      });

      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await ProveedorModel.delete(req.params.id);
      res.json({ success: true, message: 'Proveedor eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await ProveedorModel.getStats(req.params.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProveedorController;
