const express = require('express');
const router = express.Router();
const ReporteNIC2Controller = require('./controller-ReporteNIC2');

// GET /api/reportes/balance - Balance de inventario (NIC 2)
router.get('/balance', ReporteNIC2Controller.getBalanceInventario.bind(ReporteNIC2Controller));

// GET /api/reportes/categoria - Resumen por categoría
router.get('/categoria', ReporteNIC2Controller.getResumenPorCategoria.bind(ReporteNIC2Controller));

// GET /api/reportes/movimientos - Movimiento de mercancía
router.get('/movimientos', ReporteNIC2Controller.getMovimientoMercancia.bind(ReporteNIC2Controller));

// GET /api/reportes/costo-ventas - Costo de ventas
router.get('/costo-ventas', ReporteNIC2Controller.getCostoVentas.bind(ReporteNIC2Controller));

// GET /api/reportes/flujo-caja - Flujo de caja
router.get('/flujo-caja', ReporteNIC2Controller.getFlujoCAja.bind(ReporteNIC2Controller));

module.exports = router;
