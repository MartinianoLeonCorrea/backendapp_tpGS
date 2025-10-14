const express = require('express');
const router = express.Router();
const materiaController = require('./materia.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const {
  createMateriaSchema,
  updateMateriaSchema,
  idParamSchema,
  queryMateriaSchema,
} = require('./materia.schema');

// ========================= CREATE =========================

router.post(
  '/',
  validateRequest(createMateriaSchema, 'body'),
  materiaController.createMateria
);

// ========================= READ ===========================

router.get(
  '/',
  validateRequest(queryMateriaSchema, 'query'),
  materiaController.getAllMaterias
);

router.get(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(queryMateriaSchema, 'query'),
  materiaController.getMateriaById
);

// ========================= UPDATE =========================

router.put(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateMateriaSchema, 'body'),
  materiaController.updateMateria
);

// ========================= DELETE =========================

router.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  materiaController.deleteMateria
);

module.exports = router;