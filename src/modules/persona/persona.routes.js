const express = require('express');
const router = express.Router();
const PersonaController = require('./persona.controller');

// ========================= CREATE =========================

router.post('/alumnos', PersonaController.createAlumno); // POST /api/personas/alumnos
router.post('/docentes', PersonaController.createDocente); // POST /api/personas/docentes

// ========================= READ ===========================

router.get('/', PersonaController.getAllPersonas); // GET /api/personas
router.get('/alumnos', PersonaController.getAllAlumnos); // GET /api/personas/alumnos
router.get('/docentes', PersonaController.getAllDocentes); // GET /api/personas/docentes
router.get('/curso/:cursoId/alumnos', PersonaController.getAlumnosByCurso); // GET /api/personas/curso/:cursoId/alumnos
router.get('/:dni', PersonaController.getPersonaByDni); // GET /api/personas/:dni

// ========================= UPDATE =========================

router.put('/:dni', PersonaController.updatePersona); // PUT /api/personas/:dni

// ========================= DELETE =========================

router.delete('/:dni', PersonaController.deletePersona); // DELETE /api/personas/:dni

module.exports = router;
