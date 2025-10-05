const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Persona extends Model {}
Persona.init(
  {
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        isInt: {
          msg: 'El DNI debe ser un número entero.',
        },
        min: {
          args: [1000000],
          msg: 'El DNI debe tener al menos 7 dígitos.',
        },
        max: {
          args: [99999999],
          msg: 'El DNI debe tener máximo 8 dígitos.',
        },
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío.',
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres.',
        },
      },
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El apellido no puede estar vacío.',
        },
        len: {
          args: [2, 100],
          msg: 'El apellido debe tener entre 2 y 100 caracteres.',
        },
      },
    },
    telefono: {
      type: DataTypes.STRING(15), // Cambiado de INTEGER a STRING
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El teléfono no puede estar vacío.',
        },
        is: {
          args: /^[\d\s\-\+\(\)]*$/,
          msg: 'El teléfono contiene caracteres no válidos.',
        },
      },
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La dirección no puede estar vacía.',
        },
        len: {
          args: [5, 255],
          msg: 'La dirección debe tener entre 5 y 255 caracteres.',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      //unique: true, // Agregado para evitar duplicados
      validate: {
        notEmpty: {
          msg: 'El email no puede estar vacío.',
        },
        isEmail: {
          msg: 'El email debe ser válido.',
        },
        len: {
          args: [6, 255],
          msg: 'El email debe tener entre 6 y 255 caracteres',
        },
      },
    },
    tipo: {
      type: DataTypes.ENUM('alumno', 'docente'),
      allowNull: false,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: 'La especialidad debe tener entre 2 y 100 caracteres.',
        },
      },
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
