const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Importa la instancia de Sequelize

const Persona = sequelize.define('Persona', {
    dni: {
      type : DataTypes.INTEGER,
      primaryKey: true,},
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío.'
            }
        }},
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El apellido no puede estar vacío.'
            }
        }},
})