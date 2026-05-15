const express = require('express');
const router = express.Router();
const EstadisticaController = require('./controller-Estadistica');

// GET /api/estadisticas/generales - Estadísticas generales
router.get('/generales', EstadisticaController.getGenerales.bind(EstadisticaController));

// GET /api/estadisticas/top-productos - Top productos vendidos
router.get('/top-productos', EstadisticaController.getTopProductos.bind(EstadisticaController));

// GET /api/estadisticas/ventas - Ventas por período
router.get('/ventas', EstadisticaController.getVentasPorPeriodo.bind(EstadisticaController));

// GET /api/estadisticas/inventario - Estado del inventario
router.get('/inventario', EstadisticaController.getEstadoInventario.bind(EstadisticaController));

// GET /api/estadisticas/movimientos - Resumen de movimientos
router.get('/movimientos', EstadisticaController.getMovimientosResumen.bind(EstadisticaController));

module.exports = router;
