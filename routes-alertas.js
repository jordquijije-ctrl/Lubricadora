const { Router } = require('express');
const router = Router();
const AlertaController = require('./controller-Alerta');

router.get('/', AlertaController.getAll);
router.get('/summary', AlertaController.getSummary);

module.exports = router;