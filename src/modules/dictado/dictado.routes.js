const express = require('express');
const router = express.Router();
const dictadoController = require('./dictado.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const {
  createDictadoSchema,
  updateDictadoSchema,
  idParamSchema,
  cursoIdParamSchema,
  personaIdParamSchema,
  materiaIdParamSchema,
  dictadoDocenteParamSchema,
  dictadoMateriaParamSchema,
  queryCursoMateriaSchema,
} = require('./dictado.schema');

// ========================= BÚSQUEDAS ESPECÍFICAS =========================

// GET /api/dictados/by-curso-materia?cursoId=1&materiaId=2
router.get(
  '/by-curso-materia',
  validateRequest(queryCursoMateriaSchema, 'query'),
  dictadoController.getDictadosByCursoAndMateria
);

// GET /api/dictados/activos
router.get('/activos', dictadoController.getDictadosActivos);

// GET /api/dictados/activos/persona/:personaId
router.get(
  '/activos/persona/:personaId',
  validateRequest(personaIdParamSchema, 'params'),
  dictadoController.getDictadosActivosByPersona
);

// GET /api/dictados/curso/:cursoId
router.get(
  '/curso/:cursoId',
  validateRequest(cursoIdParamSchema, 'params'),
  dictadoController.getDictadosByCurso
);

// GET /api/dictados/persona/:personaId
router.get(
  '/persona/:personaId',
  validateRequest(personaIdParamSchema, 'params'),
  dictadoController.getDictadosByPersona
);

// GET /api/dictados/materia/:materiaId
router.get(
  '/materia/:materiaId',
  validateRequest(materiaIdParamSchema, 'params'),
  dictadoController.getDictadosByMateria
);

// ========================= CRUD PRINCIPAL =========================

// POST /api/dictados - Crear un nuevo dictado
router.post(
  '/',
  validateRequest(createDictadoSchema, 'body'),
  dictadoController.createDictado
);

// GET /api/dictados - Obtener todos los dictados
router.get('/', dictadoController.getAllDictados);

// GET /api/dictados/:id - Obtener un dictado por ID
router.get(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  dictadoController.getDictadoById
);

// PUT /api/dictados/:id - Actualizar un dictado
router.put(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateDictadoSchema, 'body'),
  dictadoController.updateDictado
);

// DELETE /api/dictados/:id - Eliminar un dictado
router.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  dictadoController.deleteDictado
);

// ========================= GESTIÓN DE RELACIONES =========================

// POST /api/dictados/add-docente/:dictadoId/:docenteId
router.post(
  '/add-docente/:dictadoId/:docenteId',
  validateRequest(dictadoDocenteParamSchema, 'params'),
  dictadoController.addDocenteToDictado
);

// DELETE /api/dictados/remove-docente/:dictadoId/:docenteId
router.delete(
  '/remove-docente/:dictadoId/:docenteId',
  validateRequest(dictadoDocenteParamSchema, 'params'),
  dictadoController.removeDocenteFromDictado
);

// POST /api/dictados/add-materia/:dictadoId/:materiaId
router.post(
  '/add-materia/:dictadoId/:materiaId',
  validateRequest(dictadoMateriaParamSchema, 'params'),
  dictadoController.addMateriaToDictado
);

// DELETE /api/dictados/remove-materia/:dictadoId/:materiaId
router.delete(
  '/remove-materia/:dictadoId/:materiaId',
  validateRequest(dictadoMateriaParamSchema, 'params'),
  dictadoController.removeMateriaFromDictado
);

module.exports = router;