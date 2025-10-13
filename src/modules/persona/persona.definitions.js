// src/modules/persona/persona.definitions.js
const DNI = {
  min: 1000000,
  max: 99999999,
  minLength: 7,
  maxLength: 8,
};

const NOMBRE = { min: 2, max: 50 };
const APELLIDO = { min: 2, max: 50 };

const DIRECCION = { min: 5, max: 100 };

const TELEFONO = {
  min: 7,
  max: 20,
  regex: /^[\d\s\-+()]*$/,
};

const EMAIL = {
  max: 254,
  // usamos validación de Joi/Sequelize, no regex compleja aquí
};

const TIPOS = ['alumno', 'docente', 'administrativo'];

module.exports = {
  DNI,
  NOMBRE,
  APELLIDO,
  DIRECCION,
  TELEFONO,
  EMAIL,
  TIPOS,
};
