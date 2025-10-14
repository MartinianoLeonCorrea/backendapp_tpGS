const express = require('express');
const router = express.Router();
const CursoController = require('./curso.controller');
const { validateRequest } = require('./../../middleware/validateRequest');
const { 
  createCursoSchema, 
  updateCursoSchema 
} = require('./curso.schema');

// ========================= CREATE =========================

router.post('/', validateRequest(createCursoSchema), CursoController.createCurso);

// ========================= READ ===========================

router.get('/', CursoController.getAllCursos);
router.get('/:id', CursoController.getCursoById);

// ========================= UPDATE =========================

router.put('/:id', validateRequest(updateCursoSchema), CursoController.updateCurso);

// ========================= DELETE =========================

router.delete('/:id', CursoController.deleteCurso);

module.exports = router;