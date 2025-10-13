const express = require('express');
const router = express.Router();
const PersonaController = require('./persona.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const { personaSchema } = require('./persona.schema');
// ========================= CREATE =========================

router.post('/alumnos', validateRequest(personaSchema), PersonaController.createAlumno); // POST /api/personas/alumnos
router.post('/docentes', validateRequest(personaSchema), PersonaController.createDocente); // POST /api/personas/docentes

// ========================= READ ===========================

router.get('/', PersonaController.getAllPersonas); // GET /api/personas
router.get('/curso/:cursoId/alumnos', PersonaController.getAlumnosByCurso); // GET /api/personas/curso/:cursoId/alumnos
router.get('/:dni', PersonaController.getPersonaByDni); // GET /api/personas/:dni
router.get('/:dni/materias', PersonaController.getMateriasByAlumnoDni); // GET /api/personas/:dni/materias

// ========================= UPDATE =========================

router.put('/:dni', PersonaController.updatePersona); // PUT /api/personas/:dni

// ========================= DELETE =========================

router.delete('/:dni', PersonaController.deletePersona); // DELETE /api/personas/:dni

module.exports = router;
