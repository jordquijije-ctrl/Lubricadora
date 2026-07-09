const { Router } = require('express');
const router = Router();
const AlertaController = require('../controllers/alerta.controller');

router.get('/', AlertaController.getAll);
router.get('/summary', AlertaController.getSummary);

module.exports = router;