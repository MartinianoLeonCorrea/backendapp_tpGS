// Definición de las rutas de la API para la entidad Persona

const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller'); // Importa el controlador

// Rutas para Personas
router.get('/', personaController.getAllPersonas); // GET /api/personas
router.get('/:id', personaController.getPersonaByDni); // GET /api/personas/:id
router.post('/', personaController.createPersona); // POST /api/personas
router.put('/:id', personaController.updatePersona); // PUT /api/personas/:id
router.delete('/:id', personaController.deletePersona); // DELETE /api/personas/:id

module.exports = router;