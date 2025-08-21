const express = require('express');
const router = express.Router();
const MateriaController = require('./materia.controller'); 

// ========================= CREATE =========================

router.post('/', MateriaController.createMateria); // POST /api/materias

// ========================= READ ===========================

router.get('/', MateriaController.getAllMaterias); // GET /api/materias?page=1&limit=10&search=nombremateria&include=relations
router.get('/:id', MateriaController.getMateriaById); // GET /api/materias/:id?include=relations

// ========================= UPDATE =========================

router.put('/:id', MateriaController.updateMateria); // PUT /api/materias/:id

// ========================= DELETE =========================

router.delete('/:id', MateriaController.deleteMateria); // DELETE /api/materias/:id

module.exports = router;