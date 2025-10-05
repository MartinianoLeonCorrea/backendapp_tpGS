// src/modules/db/index.js
const { sequelize } = require('../../config/database');

const Persona = require('../persona/persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('../dictado/dictado.model');
const Materia = require('../materia/materia.model');
const Examen = require('../examen/examen.model');
const Evaluacion = require('../evaluacion/evaluacion.model');

Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

module.exports = {
  sequelize,
  Persona,
  Curso,
  Dictado,
  Materia,
  Examen,
  Evaluacion,
};
