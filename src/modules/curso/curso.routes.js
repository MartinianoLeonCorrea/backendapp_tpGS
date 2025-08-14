// Definición de las rutas de la API para la entidad Curso

const express = require('express');
const router = express.Router();
const cursoController = require('./curso.controller'); // Importa el controlador

// Rutas para Cursos
router.get('/', cursoController.getAllCursos); // GET /api/cursos
router.get('/:id', cursoController.getCursoById); // GET /api/cursos/:id
router.post('/', cursoController.createCurso); // POST /api/cursos
router.put('/:id', cursoController.updateCurso); // PUT /api/cursos/:id
router.delete('/:id', cursoController.deleteCurso); // DELETE /api/cursos/:id

module.exports = router;
