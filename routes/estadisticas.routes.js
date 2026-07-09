const { Router } = require('express');
const router = Router();
const EstadisticaController = require('../controllers/estadistica.controller');

// ASEGÚRATE DE QUE LOS NOMBRES COINCIDAN CON EL CONTROLADOR
router.get('/dashboard', EstadisticaController.getDashboard);
router.get('/generales', EstadisticaController.getGenerales);
router.get('/top-productos', EstadisticaController.getTopProductos);
router.get('/inventario', EstadisticaController.getEstadoInventario);

module.exports = router;