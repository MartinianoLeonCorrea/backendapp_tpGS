const express = require('express');
const evaluacionController = require('./evaluacion.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const { evaluacionSchema } = require('./evaluacion.schema');
const Joi = require('joi');

const router = express.Router();

// Obtener todas las evaluaciones con filtros opcionales
router.get('/', evaluacionController.getAllEvaluaciones);

// Obtener una evaluación por ID
router.get('/:id', evaluacionController.getEvaluacionById);

// Obtener evaluaciones por examenId
router.get('/examen/:examenId', evaluacionController.getEvaluacionesByExamen);

// Obtener evaluación por alumnoId y examenId
router.get(
  '/alumno/:alumnoId/examen/:examenId',
  evaluacionController.getEvaluacionByAlumnoAndExamen
);
// Obtener evaluaciones por alumnoId
router.get('/alumno/:alumnoId', evaluacionController.getEvaluacionesByAlumno); //api

// Crear una nueva evaluación
router.post(
  '/',
  validateRequest(evaluacionSchema),
  evaluacionController.createEvaluacion
);

// Crear múltiples evaluaciones en batch
router.post(
  '/batch-create',
  validateRequest(Joi.array().items(evaluacionSchema)),
  evaluacionController.createBatchEvaluaciones
);

// Actualizar una evaluación existente
router.put(
  '/:id',
  validateRequest(evaluacionSchema),
  evaluacionController.updateEvaluacion
);

// Actualizar múltiples evaluaciones en batch
router.put(
  '/batch-update',
  validateRequest(Joi.array().items(evaluacionSchema)),
  evaluacionController.updateBatchEvaluaciones
);

// Eliminar una evaluación por ID
router.delete('/:id', evaluacionController.deleteEvaluacion);

module.exports = router;
