const express = require('express');
const router = express.Router();
const PersonaController = require('./persona.controller');

// ========================= CREATE =========================

router.post('/alumnos', PersonaController.createAlumno); // POST /api/personas/alumnos
router.post('/docentes', PersonaController.createDocente); // POST /api/personas/docentes

// ========================= READ ===========================

router.get('/', PersonaController.getAllPersonas); // GET /api/personas
router.get('/search', PersonaController.searchByName); // GET /api/personas/search?q=nombre
router.get('/alumnos', PersonaController.getAllAlumnos); // GET /api/personas/alumnos
router.get('/docentes', PersonaController.getAllDocentes); // GET /api/personas/docentes
router.get('/estadisticas', PersonaController.getEstadisticas); // GET /api/personas/estadisticas
router.get('/curso/:cursoId/alumnos', PersonaController.getAlumnosByCurso); // GET /api/personas/curso/:cursoId/alumnos
router.get('/dictado/:dictadoId/docentes', PersonaController.getDocentesByDictado); // GET /api/personas/dictado/:dictadoId/docentes
router.get('/:dni', PersonaController.getPersonaByDni); // GET /api/personas/:dni

// ========================= UPDATE =========================

router.put('/:dni', PersonaController.updatePersona); // PUT /api/personas/:dni
router.put('/:dni/curso', PersonaController.asignarCursoAlumno); // PUT /api/personas/:dni/curso
router.put('/:dni/dictados/:dictadoId', PersonaController.asignarDictadoADocente); // PUT /api/personas/:dni/dictados/:dictadoId

// ========================= DELETE =========================

router.delete('/:dni', PersonaController.deletePersona); // DELETE /api/personas/:dni
router.delete('/:dni/curso', PersonaController.removerCursoDeAlumno); // DELETE /api/personas/:dni/curso
router.delete('/:dni/dictados/:dictadoId', PersonaController.removerDictadoDeDocente); // DELETE /api/personas/:dni/dictados/:dictadoId

module.exports = router;