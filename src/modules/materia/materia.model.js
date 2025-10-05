const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Materia = sequelize.define(
  'Materia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre de la materia no puede estar vacío.',
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres.',
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000], // Límite opcional para descripción
          msg: 'La descripción no puede exceder los 1000 caracteres.',
        },
      },
    },
  },
  {
    tableName: 'materias',
    timestamps: true, // Habilita createdAt y updatedAt
    underscored: true, // Usa snake_case para campos automáticos
    paranoid: false, // Cambia a true si quieres soft delete
  }
);

// Método estático para inicializar asociaciones

Materia.associate = (models) => {
  //Relación One-to-Many: Una materia se dicta en muchos dictados
  Materia.hasMany(models.Dictado, {
    foreignKey: 'materiaId',
    as: 'dictados',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = Materia;
