// Definición del modelo Dictado
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Dictado extends Model {}

Dictado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dias_cursado: {
      type: DataTypes.STRING(100), // Por ejemplo, "Lunes, Miércoles, Viernes"
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
  },
  {
    sequelize,
    modelName: 'Dictado',
    tableName: 'dictados',
    underscored: true,
  }
);

// Definimos las relaciones con las otras tablas
Dictado.associate = (models) => {
  Dictado.belongsTo(models.Curso, {
    foreignKey: 'cursoId',
    as: 'curso',
  });

  // Relación One-to-Many: en un Dictado se dicta una sola materia
  Dictado.belongsTo(models.Materia, {
    foreignKey: 'materiaId',
    as: 'materia',
  });

  // Relación: Uno a Muchos entre Dictado y Persona (Docente)
  Dictado.belongsTo(models.Persona, {
    foreignKey: 'docenteId',
    as: 'docente',
  });
  Dictado.hasMany(models.Examen, {
    foreignKey: 'dictadoId',
    as: 'examenes',
  });
};
module.exports = Dictado;
