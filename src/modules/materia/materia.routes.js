const express = require('express');
const router = express.Router();
const MateriaController = require('./materia.controller');
const materiaController = new MateriaController();

// ========================= CREATE =========================

router.post('/', materiaController.createMateria); // POST /api/materias

// ========================= READ ===========================

router.get('/', materiaController.getAllMaterias); // GET /api/materias?page=1&limit=10&search=nombremateria&include=relations
router.get('/:id', materiaController.getMateriaById); // GET /api/materias/:id?include=relations

// ========================= UPDATE =========================

router.put('/:id', materiaController.updateMateria); // PUT /api/materias/:id

// ========================= DELETE =========================

router.delete('/:id', materiaController.deleteMateria); // DELETE /api/materias/:id

module.exports = router;
