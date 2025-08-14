// Definición de las rutas de la API para la entidad Materia

const express = require('express');
const router = express.Router();
const materiaController = require('./materia.controller'); // Importa el controlador

// Rutas para Materias
router.get('/', materiaController.getAllMaterias); // GET /api/materias
router.get('/:id', materiaController.getMateriaById); // GET /api/materias/:id
router.post('/', materiaController.createMateria); // POST /api/materias
router.put('/:id', materiaController.updateMateria); // PUT /api/materias/:id
router.delete('/:id', materiaController.deleteMateria); // DELETE /api/materias/:id

module.exports = router;