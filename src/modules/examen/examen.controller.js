// src/controllers/examen.controller.js
const examenService = require('../services/examen.service');

// Obtener todos los exámenes
const getAllExamenes = async (req, res, next) => {
  try {
    const examenes = await examenService.getAllExamenes();
    res.status(200).json(examenes);
  } catch (error) {
    next(error);
  }
};

// Obtener un examen por ID
const getExamenById = async (req, res, next) => {
  try {
    const examen = await examenService.getExamenById(req.params.id);
    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }
    res.status(200).json(examen);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo examen
const createExamen = async (req, res, next) => {
  try {
    const newExamen = await examenService.createExamen(req.body);
    res.status(201).json(newExamen);
  } catch (error) {
    next(error);
  }
};

// Actualizar un examen
const updateExamen = async (req, res, next) => {
  try {
    const updatedExamen = await examenService.updateExamen(
      req.params.id,
      req.body
    );
    if (!updatedExamen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }
    res.status(200).json(updatedExamen);
  } catch (error) {
    next(error);
  }
};

// Eliminar un examen
const deleteExamen = async (req, res, next) => {
  try {
    const deletedExamen = await examenService.deleteExamen(req.params.id);
    if (!deletedExamen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }
    res.status(200).json({ message: 'Examen eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// Obtener exámenes por materia
const getExamenesByMateria = async (req, res, next) => {
  try {
    const examenes = await examenService.getExamenesByMateria(
      req.params.materiaId
    );
    res.status(200).json(examenes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExamenes,
  getExamenById,
  createExamen,
  updateExamen,
  deleteExamen,
  getExamenesByMateria,
};
