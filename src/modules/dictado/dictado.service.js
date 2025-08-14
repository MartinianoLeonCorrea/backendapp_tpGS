//Lógica de negocio para la entidad Dictado

const { models } = require('../db/sequelize');
const Persona = require('../persona/persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('./dictado.model');

// Obtener todas las personas, incluyendo su curso y dictados (si corresponde)
const findAllPersonas = async () => {
  return await Persona.findAll({
    include: [
      { model: Curso, as: 'curso' },
      { model: Dictado, as: 'dictados', through: { attributes: [] } },
    ],
  });
};

// Obtener una persona por ID, incluyendo su curso y dictados
const findPersonaById = async (id) => {
  return await Persona.findByPk(id, {
    include: [
      { model: Curso, as: 'curso' },
      { model: Dictado, as: 'dictados', through: { attributes: [] } },
    ],
  });
};

// Crear una persona (puedes asignar cursoId si es alumno)
const createPersona = async (personaData) => {
  return await Persona.create(personaData);
};

// Asignar un dictado a un profesor (persona)
const addDictadoToProfesor = async (personaId, dictadoId) => {
  const persona = await Persona.findByPk(personaId);
  const dictado = await Dictado.findByPk(dictadoId);
  if (!persona || !dictado) throw new Error('Persona o Dictado no encontrado');
  await persona.addDictado(dictado); // Sequelize crea el método automáticamente
  return true;
};

module.exports = {
  findAllPersonas,
  findPersonaById,
  createPersona,
  addDictadoToProfesor,
};
