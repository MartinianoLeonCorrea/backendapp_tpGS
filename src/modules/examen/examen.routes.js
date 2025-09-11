// src/routes/examen.routes.js
const express = require('express');
const router = express.Router();
const examenController = require('../examen/examen.controller');

router.get('/', examenController.getExamenesByDictadoId);
// Rutas de CRUD
router
  .route('/')
  .get(examenController.getAllExamenes)
  .post(examenController.createExamen);

// Rutas de búsqueda y manipulación por ID
router
  .route('/:id')
  .get(examenController.getExamenById)
  .put(examenController.updateExamen)
  .delete(examenController.deleteExamen);

// Ruta para obtener exámenes de una materia específica
router.get('/materia/:materiaId', examenController.getExamenesByMateria);

module.exports = router;
