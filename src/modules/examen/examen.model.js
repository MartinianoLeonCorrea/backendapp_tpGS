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
  //Con esta relación ya puedo obtener el docente y la materia del examen
  //ya que el dictado también tiene esas relaciones.
};

module.exports = Examen;
