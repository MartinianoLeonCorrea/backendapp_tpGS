const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Persona extends Model {}
Persona.init(
  {
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(15), // Cambiado de INTEGER a STRING
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      //unique: true, // Agregado para evitar duplicados
    },
    tipo: {
      type: DataTypes.ENUM('alumno', 'docente'),
      allowNull: false,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Solo para alumnos
      references: { model: 'cursos', key: 'id' },
      onDelete: 'SET NULL', // Si borras curso, null en alumno
    },
  },
  {
    sequelize,
    modelName: 'Persona',
    tableName: 'personas',
    timestamps: true,
    underscored: true,
  }
);
Persona.associate = (models) => {
  Persona.belongsTo(models.Curso, {
    foreignKey: 'cursoId',
    as: 'curso',
  });

  Persona.hasMany(models.Dictado, {
    foreignKey: 'docenteId',
    as: 'dictados',
  });

  // Relación con Evaluaciones: un Alumno puede tener muchas Evaluaciones
  Persona.hasMany(models.Evaluacion, {
    foreignKey: 'alumnoId',
    as: 'evaluaciones',
  });
};

module.exports = Persona;
