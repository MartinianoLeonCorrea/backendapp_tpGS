// src/models/examen.model.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Examen extends Model {}

Examen.init(
  {
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
    dictadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dictados',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Examen',
    tableName: 'examenes',
    underscored: true,
  }
);

Examen.associate = (models) => {
  // Relación con Dictado (uno a muchos): un Examen pertenece a un Dictado.
  Examen.belongsTo(models.Dictado, {
    foreignKey: 'dictadoId',
    as: 'dictado',
  });

  // Relación con Evaluaciones: un Examen puede tener muchas Evaluaciones
  Examen.hasMany(models.Evaluacion, {
    foreignKey: 'examenId',
    as: 'evaluaciones',
  });
};

module.exports = Examen;
