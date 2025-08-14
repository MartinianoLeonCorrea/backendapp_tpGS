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
}, {
    tableName: 'materias', 
});

module.exports = Materia;