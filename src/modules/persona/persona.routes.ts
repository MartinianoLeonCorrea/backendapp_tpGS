import { Router } from 'express';
import * as PersonaController from './persona.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { personaSchema } from './persona.schema';

const router = Router();

// ========================= CREATE =========================

// POST /api/personas/alumnos
router.post(
  '/alumnos', 
  validateRequest(personaSchema), 
  PersonaController.createAlumno
); 

// POST /api/personas/docentes
router.post(
  '/docentes', 
  validateRequest(personaSchema), 
  PersonaController.createDocente
); 

// ========================= READ ===========================

// GET /api/personas
router.get('/', PersonaController.getAllPersonas); 

// GET /api/personas/curso/:cursoId/alumnos
router.get('/curso/:cursoId/alumnos', PersonaController.getAlumnosByCurso); 

// GET /api/personas/:dni
router.get('/:dni', PersonaController.getPersonaByDni); 

// Nota: getMateriasByAlumnoDni se omite temporalmente si no se migró la lógica 
// específica en el controlador, pero puedes descomentarlo si lo necesitas:
// router.get('/:dni/materias', PersonaController.getMateriasByAlumnoDni); 

// ========================= UPDATE =========================

// PUT /api/personas/:dni
router.put(
  '/:dni', 
  validateRequest(personaSchema), 
  PersonaController.updatePersona
); 

// ========================= DELETE =========================

// DELETE /api/personas/:dni
router.delete('/:dni', PersonaController.deletePersona); 

export default router;