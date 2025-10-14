const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Evaluacion extends Model {}

Evaluacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nota: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    examenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'examenes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    alumnoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personas',
        key: 'dni',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Evaluacion',
    tableName: 'evaluaciones',
    underscored: true,
    timestamps: true,
  }
);

Evaluacion.associate = (models) => {
  // Relación con Examen: Una evaluación pertenece a un examen
  Evaluacion.belongsTo(models.Examen, {
    foreignKey: 'examenId',
    as: 'examen',
  });

  // Relación con Persona: Una evaluación pertenece a un alumno
  Evaluacion.belongsTo(models.Persona, {
    foreignKey: 'alumnoId',
    as: 'alumno',
  });
};

module.exports = Evaluacion;
