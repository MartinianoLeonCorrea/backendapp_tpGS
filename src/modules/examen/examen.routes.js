// src/modules/examen/examen.routes.js
const express = require('express');
const router = express.Router();
const examenController = require('../examen/examen.controller');

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
// para evitar conflictos

// Ruta para obtener exámenes de una materia específica
// GET /api/examenes/materia/:materiaId
router.get('/materia/:materiaId', examenController.getExamenesByMateria);

// Ruta para obtener exámenes por dictadoId (query parameter)
// GET /api/examenes?dictadoId=123
// O para obtener todos los exámenes si no hay query
// GET /api/examenes
router.get('/', (req, res, next) => {
  if (req.query.dictadoId) {
    return examenController.getExamenesByDictadoId(req, res, next);
  }
  return examenController.getAllExamenes(req, res, next);
});

// Ruta para crear un nuevo examen
// POST /api/examenes
router.post('/', examenController.createExamen);

// Rutas de búsqueda y manipulación por ID (DEBEN IR AL FINAL)
// GET /api/examenes/:id
router.get('/:id', examenController.getExamenById);

// PUT /api/examenes/:id
router.put('/:id', examenController.updateExamen);

// DELETE /api/examenes/:id
router.delete('/:id', examenController.deleteExamen);

module.exports = router;