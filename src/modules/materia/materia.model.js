const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); 

const Materia = sequelize.define('Materia', {
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
                msg: 'El nombre de la materia no puede estar vacío.'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres.'
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000], // Límite opcional para descripción
                msg: 'La descripción no puede exceder los 1000 caracteres.'
            }
        }
    },

    // Campos de auditoría automáticos (timestamps)

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
    }
}, {
    tableName: 'materias',
    timestamps: true, // Habilita createdAt y updatedAt
    underscored: true, // Usa snake_case para campos automáticos
    paranoid: false, // Cambia a true si quieres soft delete
});

// Definir relaciones

Materia.associate = (models) => {

    // Relación: Una materia puede tener múltiples exámenes

    Materia.hasMany(models.Examen, {
        foreignKey: 'materiaId',
        as: 'examenes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // Relación: Una materia puede estar en múltiples dictados

    Materia.belongsToMany(models.Dictado, {
        through: 'Dictado_Materia', // Tabla intermedia
        foreignKey: 'materiaId',
        otherKey: 'dictadoId',
        as: 'dictados',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

// Método estático para inicializar asociaciones

Materia.initAssociations = () => {
    const Dictado = require('./dictado.model');
    const Examen = require('./examen.model');
    
    // Definir asociaciones directamente
    
    Materia.hasMany(Examen, {
        foreignKey: 'materiaId',
        as: 'examenes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Materia.belongsToMany(Dictado, {
        through: 'Dictado_Materia',
        foreignKey: 'materiaId',
        otherKey: 'dictadoId',
        as: 'dictados',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = Materia;