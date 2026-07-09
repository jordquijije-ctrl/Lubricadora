const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/factura.controller');

// GET /api/facturas - Obtener todas
router.get('/', FacturaController.getAll.bind(FacturaController));

// GET /api/facturas/proximo - Obtener próximo número (MUST BE BEFORE /:id)
router.get('/proximo', FacturaController.getProximoNumero.bind(FacturaController));

// PUT /api/facturas/:id/estado - Actualizar estado (MORE SPECIFIC, MUST BE BEFORE /:id)
router.put('/:id/estado', FacturaController.updateEstado.bind(FacturaController));

// PUT /api/facturas/:id/anular - Anular factura (MORE SPECIFIC, MUST BE BEFORE /:id)
router.put('/:id/anular', FacturaController.anular.bind(FacturaController));

// GET /api/facturas/:id - Obtener por ID (GENERIC, MUST BE LAST)
router.get('/:id', FacturaController.getById.bind(FacturaController));

// POST /api/facturas - Crear nueva
router.post('/', FacturaController.create.bind(FacturaController));

module.exports = router;
