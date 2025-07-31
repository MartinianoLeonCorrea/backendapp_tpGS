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
    telefono: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El teléfono no puede estar vacío.'
            },
            isNumeric: {
                msg: 'El teléfono debe ser un número.'
            }
        }},
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección no puede estar vacía.'
            }
        }},
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El email no puede estar vacío.'
            },
            isEmail: {
                msg: 'El email debe ser válido.'
            }
        }},
    tipoCodigo: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El tipo de código no puede estar vacío.'
            },
        isIn: {
                args: [['P', 'A', 'D']],
                msg: 'El tipo de código debe ser "P"(personal),"A"(Alumno) o "D"(Docente).'
        }},
    }})