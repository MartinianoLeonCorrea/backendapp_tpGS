// Definición del modelo Curso con Sequelize

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Curso = sequelize.define('curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  anio_letra: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El año y letra del curso no pueden estar vacíos.',
      },
    },
  },
  turno: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El turno del curso no puede estar vacío.',
      },
    },
  },
});

module.exports = Curso;
