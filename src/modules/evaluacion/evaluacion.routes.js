const express = require('express');
const evaluacionController = require('./evaluacion.controller');

const router = express.Router();

// Obtener todas las evaluaciones con filtros opcionales
router.get('/', evaluacionController.getAllEvaluaciones);

// Obtener una evaluación por ID
router.get('/:id', evaluacionController.getEvaluacionById);

// Crear una nueva evaluación
router.post('/', evaluacionController.createEvaluacion);

// Actualizar una evaluación existente
router.put('/:id', evaluacionController.updateEvaluacion);

// Eliminar una evaluación por ID
router.delete('/:id', evaluacionController.deleteEvaluacion);

module.exports = router;
