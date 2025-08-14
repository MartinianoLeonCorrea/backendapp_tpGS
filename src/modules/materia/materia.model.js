// Definición del modelo Materia con Sequelize

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // Importa la instancia de Sequelize

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
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // Sequelize automáticamente añade `createdAt` y `updatedAt` si `timestamps` es true en la configuración
}, {
    tableName: 'materias', // Nombre de la tabla en la base de datos
    // Puedes añadir más opciones aquí, como índices, etc.
});

module.exports = Materia;