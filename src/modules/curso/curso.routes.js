const express = require('express');
const router = express.Router();
const CursoController = require('./curso.controller');

// ========================= CREATE =========================

router.post('/', CursoController.createCurso); // POST /api/cursos

// ========================= READ ===========================

router.get('/', CursoController.getAllCursos); // GET /api/cursos
router.get('/:id', CursoController.getCursoById); // GET /api/cursos/:id

// ========================= UPDATE =========================

router.put('/:id', CursoController.updateCurso); // PUT /api/cursos/:id

// ========================= DELETE =========================

router.delete('/:id', CursoController.deleteCurso); // DELETE /api/cursos/:id

module.exports = router;