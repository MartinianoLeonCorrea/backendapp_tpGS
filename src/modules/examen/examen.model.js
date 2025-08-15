// src/models/examen.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Examen = sequelize.define('Examen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha_examen: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  temas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  copias: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

Examen.associate = (models) => {
  // Relación con Materia (uno a muchos): un Examen pertenece a una Materia.
  // Sequelize creará una columna 'materiaId' en la tabla de Examen.
  Examen.belongsTo(models.Materia, {
    foreignKey: 'materiaId',
    as: 'materia',
  });

  // Relación con Dictado (uno a muchos): un Examen pertenece a un Dictado.
  // Sequelize creará una columna 'dictadoId' en la tabla de Examen.
  Examen.belongsTo(models.Dictado, {
    foreignKey: 'dictadoId',
    as: 'dictado',
  });

  // Relación con Persona (Docente): un Examen pertenece a un Docente.
  // Sequelize creará una columna 'docenteId' en la tabla de Examen.
  Examen.belongsTo(models.Persona, {
    foreignKey: 'docenteId',
    as: 'docente',
  });
};

module.exports = Examen;
