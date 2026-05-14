const express = require('express');
const router = express.Router();
const FacturaController = require('./controller-Factura');

// GET /api/facturas - Obtener todas
router.get('/', FacturaController.getAll.bind(FacturaController));

// GET /api/facturas/proximo - Obtener próximo número
router.get('/proximo', FacturaController.getProximoNumero.bind(FacturaController));

// GET /api/facturas/:id - Obtener por ID
router.get('/:id', FacturaController.getById.bind(FacturaController));

// POST /api/facturas - Crear nueva
router.post('/', FacturaController.create.bind(FacturaController));

// PUT /api/facturas/:id/estado - Actualizar estado
router.put('/:id/estado', FacturaController.updateEstado.bind(FacturaController));

// PUT /api/facturas/:id/anular - Anular factura
router.put('/:id/anular', FacturaController.anular.bind(FacturaController));

module.exports = router;
