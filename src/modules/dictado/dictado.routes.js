// src/routes/dictado.routes.js
const express = require('express');
const router = express.Router();
const dictadoController = require('../controllers/dictado.controller');

// Rutas principales de CRUD
router
  .route('/')
  // POST /api/dictados - Crear un nuevo dictado con o sin relaciones
  .post(dictadoController.createDictadoWithRelations)
  // GET /api/dictados - Obtener todos los dictados
  .get(dictadoController.getAllDictados);

// Rutas para acciones específicas sobre un dictado por ID
router
  .route('/:id')
  // GET /api/dictados/:id - Obtener un dictado por ID
  .get(dictadoController.getDictadoById)
  // PUT /api/dictados/:id - Actualizar un dictado (datos o relaciones)
  .put(dictadoController.updateDictadoWithRelations)
  // DELETE /api/dictados/:id - Eliminar un dictado
  .delete(dictadoController.deleteDictado);

// Rutas de búsqueda avanzada
router.get('/curso/:cursoId', dictadoController.getDictadosByCurso);
router.get('/persona/:personaId', dictadoController.getDictadosByPersona);
router.get('/materia/:materiaId', dictadoController.getDictadosByMateria);

// Rutas de búsqueda de dictados activos
router.get('/activos', dictadoController.getDictadosActivos);
router.get(
  '/activos/persona/:personaId',
  dictadoController.getDictadosActivosByPersona
);

// Rutas para modificar relaciones de un dictado
router.post(
  '/add-docente/:dictadoId/:docenteId',
  dictadoController.addDocenteToDictado
);
router.delete(
  '/remove-docente/:dictadoId/:docenteId',
  dictadoController.removeDocenteFromDictado
);
router.post(
  '/add-materia/:dictadoId/:materiaId',
  dictadoController.addMateriaToDictado
);
router.delete(
  '/remove-materia/:dictadoId/:materiaId',
  dictadoController.removeMateriaFromDictado
);

module.exports = router;
