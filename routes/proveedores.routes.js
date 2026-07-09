const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedor.controller');

// GET /api/proveedores - Obtener todos
router.get('/', ProveedorController.getAll.bind(ProveedorController));

// GET /api/proveedores/:id/stats - Estadísticas (MORE SPECIFIC, MUST BE BEFORE /:id)
router.get('/:id/stats', ProveedorController.getStats.bind(ProveedorController));

// GET /api/proveedores/:id - Obtener por ID (GENERIC, MUST BE LAST)
router.get('/:id', ProveedorController.getById.bind(ProveedorController));

// POST /api/proveedores - Crear nuevo
router.post('/', ProveedorController.create.bind(ProveedorController));

// PUT /api/proveedores/:id - Actualizar
router.put('/:id', ProveedorController.update.bind(ProveedorController));

// DELETE /api/proveedores/:id - Eliminar
router.delete('/:id', ProveedorController.delete.bind(ProveedorController));

module.exports = router;
