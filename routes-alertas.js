const express = require('express');
const router = express.Router();
const AlertaController = require('./controller-Alerta');

// GET /api/alertas - Obtener todas las alertas
router.get('/', AlertaController.getAll.bind(AlertaController));

// GET /api/alertas/summary - Resumen de alertas (MUST BE BEFORE /nivel)
router.get('/summary', AlertaController.getSummary.bind(AlertaController));

// GET /api/alertas/nivel - Obtener alertas por nivel
router.get('/nivel', AlertaController.getByNivel.bind(AlertaController));

module.exports = router;
