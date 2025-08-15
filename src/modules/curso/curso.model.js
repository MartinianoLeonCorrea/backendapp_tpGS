const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Curso = sequelize.define('curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  anio_letra: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true, // Agregado para evitar duplicados
    validate: {
      notEmpty: {
        msg: 'El año y letra del curso no pueden estar vacíos.',
      },
      len: {
        args: [1, 3],
        msg: 'El año y letra debe tener entre 1 y 3 caracteres.',
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
      isIn: {
        args: [['MAÑANA', 'TARDE', 'NOCHE']],
        msg: 'El turno debe ser MAÑANA, TARDE o NOCHE.',
      },
    },
  },
}, {
  tableName: 'cursos',
  timestamps: true, // Agregado createdAt y updatedAt
});

// Definir relaciones

Curso.associate = (models) => {

  // Relación: Un curso puede tener muchos alumnos

  Curso.hasMany(models.Persona, {
    foreignKey: 'cursoId',
    as: 'alumnos',
    scope: {
      tipoCodigo: 'Alumno'
    }
  });

  // Relación: Un curso tiene únicamente un dictado

  Curso.hasOne(models.Dictado, {
    foreignKey: 'cursoId',
    as: 'dictado',
  });
};

module.exports = Curso;