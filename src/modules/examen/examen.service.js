// src/services/examen.service.js
const Persona = require('../persona/persona.model');
const Examen = require('../examen/examen.model');
const Materia = require('../materia/materia.model');
const Dictado = require('../dictado/dictado.model');

// Función para obtener todos los exámenes con sus relaciones
const getAllExamenes = async () => {
  return await Examen.findAll({
    include: [
      { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
      { model: Dictado, as: 'dictado', attributes: ['id', 'dias_cursado'] },
      {
        model: Persona,
        as: 'docente',
        attributes: ['id', 'nombre', 'apellido'],
      },
    ],
  });
};

// Función para obtener un examen por ID
const getExamenById = async (id) => {
  return await Examen.findByPk(id, {
    include: [
      { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
      { model: Dictado, as: 'dictado', attributes: ['id', 'dias_cursado'] },
      {
        model: Persona,
        as: 'docente',
        attributes: ['id', 'nombre', 'apellido'],
      },
    ],
  });
};

// Función para crear un nuevo examen
const createExamen = async (examenData) => {
  const newExamen = await Examen.create(examenData);
  return getExamenById(newExamen.id);
};

// Función para actualizar un examen
const updateExamen = async (id, updateData) => {
  const examen = await Examen.findByPk(id);
  if (!examen) return null;
  await examen.update(updateData);
  return getExamenById(id);
};

// Función para eliminar un examen
const deleteExamen = async (id) => {
  const examen = await Examen.findByPk(id);
  if (!examen) return null;
  await examen.destroy();
  return examen;
};

// Funciones para búsquedas por relaciones
const getExamenesByMateria = async (materiaId) => {
  return await Examen.findAll({
    where: { materiaId: materiaId },
    include: [
      { model: Dictado, as: 'dictado', attributes: ['id', 'dias_cursado'] },
      {
        model: Persona,
        as: 'docente',
        attributes: ['id', 'nombre', 'apellido'],
      },
    ],
  });
};

module.exports = {
  getAllExamenes,
  getExamenById,
  createExamen,
  updateExamen,
  deleteExamen,
  getExamenesByMateria,
};
