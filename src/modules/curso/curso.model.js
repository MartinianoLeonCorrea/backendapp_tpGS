const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Curso extends Model {}

Curso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nro_letra: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: false,
      validate: {
        notEmpty: {
          msg: 'El nro y letra del curso no pueden estar vacíos.',
        },
        len: {
          args: [1, 3],
          msg: 'El nro y letra debe tener entre 1 y 3 caracteres.',
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
  },
  {
    sequelize,
    tableName: 'cursos',
    timestamps: true,
    underscored: true,
    modelName: 'Curso',
  }
);

// Definir relaciones

Curso.associate = (models) => {
  // Relación: Un curso puede tener muchos alumnos
  Curso.hasMany(models.Persona, {
    foreignKey: 'cursoId',
    as: 'alumnos',
  });

  // Relación: Un curso tiene muchos dictados

  Curso.hasMany(models.Dictado, {
    foreignKey: 'cursoId',
    as: 'dictados',
  });
};

module.exports = Curso;
