const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Persona = sequelize.define('Persona', {
    dni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
            isInt: {
                msg: 'El DNI debe ser un número entero.'
            },
            min: {
                args: [1000000],
                msg: 'El DNI debe tener al menos 7 dígitos.'
            },
            max: {
                args: [99999999],
                msg: 'El DNI debe tener máximo 8 dígitos.'
            }
        }
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío.'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres.'
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El apellido no puede estar vacío.'
            },
            len: {
                args: [2, 100],
                msg: 'El apellido debe tener entre 2 y 100 caracteres.'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(15), // Cambiado de INTEGER a STRING
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El teléfono no puede estar vacío.'
            },
            is: {
                args: /^[\d\s\-\+\(\)]*$/,
                msg: 'El teléfono contiene caracteres no válidos.'
            }
        }
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección no puede estar vacía.'
            },
            len: {
                args: [5, 255],
                msg: 'La dirección debe tener entre 5 y 255 caracteres.'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Agregado para evitar duplicados
        validate: {
            notEmpty: {
                msg: 'El email no puede estar vacío.'
            },
            isEmail: {
                msg: 'El email debe ser válido.'
            }
        }
    },
    tipoCodigo: {
        type: DataTypes.ENUM('Alumno', 'Docente'), // ENUM más restrictivo
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El tipo debe ser Alumno o Docente.'
            }
        },
    },
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: 'La especialidad no puede tener más de 100 caracteres.'
            }
        }
    },

    // Campo para relacionar alumnos con cursos

    cursoId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Solo para alumnos
        references: {
            model: 'cursos',
            key: 'id'
        }
    }
}, {
    tableName: 'personas',
    timestamps: true,

    // Hook para validar docentes con sus reglas específicas

    hooks: {
        beforeValidate: (persona) => {

            // SOLO docentes NO pueden tener curso

            if (persona.tipoCodigo === 'Docente' && persona.cursoId) {
                throw new Error('Los docentes no pueden tener curso asignado.');
            }

        }
    }
});

// Definir relaciones

Persona.associate = (models) => {

    // Relación: Alumno pertenece a un curso

    Persona.belongsTo(models.Curso, {
        foreignKey: 'cursoId',
        as: 'curso',
        scope: {
            tipoCodigo: 'Alumno'
        }
    });

    // Relación: Docente puede estar en muchos dictados

    Persona.belongsToMany(models.Dictado, {
        through: 'Dictado_Persona',
        foreignKey: 'personaId',
        otherKey: 'dictadoId',
        as: 'dictados',
        scope: {
            tipoCodigo: 'Docente'
        }
    });
};

module.exports = Persona;