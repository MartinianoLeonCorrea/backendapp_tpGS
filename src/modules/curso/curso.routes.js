const express = require('express');
const router = express.Router();
const CursoController = require('./curso.controller');

// ========================= CREATE =========================

router.post('/', CursoController.createCurso); // POST /api/cursos

// ========================= READ ===========================

router.get('/', CursoController.getAllCursos); // GET /api/cursos
router.get('/turno/:turno', CursoController.getCursosByTurno); // GET /api/cursos/turno/:turno
router.get('/:id', CursoController.getCursoById); // GET /api/cursos/:id
router.get('/:id/stats', CursoController.getCursoStats); // GET /api/cursos/:id/stats

// ========================= UPDATE =========================

router.put('/:id', CursoController.updateCurso); // PUT /api/cursos/:id

// ========================= DELETE =========================

router.delete('/:id', CursoController.deleteCurso); // DELETE /api/cursos/:id
router.delete('/:id/force', CursoController.forceDeleteCurso); // DELETE /api/cursos/:id/force

module.exports = router;