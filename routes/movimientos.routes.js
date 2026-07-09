const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/movimiento.controller');

// GET /api/movimientos - Obtener todos (con filtros opcionales)
router.get('/', MovimientoController.getAll.bind(MovimientoController));

// GET /api/movimientos/producto/:id - Obtener por producto
router.get('/producto/:producto_id', MovimientoController.getByProducto.bind(MovimientoController));

// POST /api/movimientos/entrada - Registrar entrada
router.post('/entrada', MovimientoController.registrarEntrada.bind(MovimientoController));

// POST /api/movimientos/salida - Registrar salida
router.post('/salida', MovimientoController.registrarSalida.bind(MovimientoController));

// DELETE /api/movimientos/:id - Eliminar (revierte stock)
router.delete('/:id', MovimientoController.delete.bind(MovimientoController));

module.exports = router;
