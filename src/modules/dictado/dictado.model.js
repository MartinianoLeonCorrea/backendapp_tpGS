// Definición del modelo Dictado con
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Dictado = sequelize.define('Dictado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha_desde: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_hasta: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dias_cursado: {
    type: DataTypes.STRING(50), // Por ejemplo, "Lunes, Miércoles, Viernes"
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Los días de cursado no pueden estar vacíos.',
      },
    },
  },
  notas_alumnos: {
    type: DataTypes.TEXT, // Para almacenar notas numéricas o alfanuméricas
    allowNull: true,
  },
  asistencias_alumnos: {
    type: DataTypes.TEXT, // Para almacenar presente/ausente
    allowNull: true,
  },
});

// Definimos las relaciones con las otras tablas
Dictado.associate = (models) => {
  Dictado.belongsTo(models.Curso, {
    foreignKey: 'cursoId',
    as: 'curso',
  });

  // Relación: Muchos a Muchos entre Dictado y Materia
  Dictado.belongsToMany(models.Materia, {
    through: 'Dictado_Materia', // Nombre de la tabla de unión
    foreignKey: 'dictadoId',
    otherKey: 'materiaId',
    as: 'materias',
  });

  // Relación: Muchos a Muchos entre Dictado y Persona (Docente)
  Dictado.belongsToMany(models.Persona, {
    through: 'Dictado_Persona', // Nombre de la tabla de unión
    foreignKey: 'dictadoId',
    otherKey: 'personaId',
    as: 'docentes',
  });

  return Dictado;
};
