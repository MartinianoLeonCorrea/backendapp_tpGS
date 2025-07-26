// Lógica de negocio para la entidad Materia

const Materia = require('../models/materia.model'); // Importa el modelo Materia

// Encontrar todas las materias
const findAllMaterias = async () => {
    try {
        const materias = await Materia.findAll();
        return materias;
    } catch (error) {
        throw new Error('Error al obtener todas las materias: ' + error.message);
    }
};

// Encontrar una materia por ID
const findMateriaById = async (id) => {
    try {
        const materia = await Materia.findByPk(id);
        return materia;
    } catch (error) {
        throw new Error('Error al obtener materia por ID: ' + error.message);
    }
};

// Crear una nueva materia
const createMateria = async (materiaData) => {
    try {
        const newMateria = await Materia.create(materiaData);
        return newMateria;
    } catch (error) {
        // Manejo de errores específicos de Sequelize, por ejemplo, validación
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una materia con ese nombre.');
        }
        if (error.name === 'SequelizeValidationError') {
            throw new Error('Error de validación: ' + error.errors.map(e => e.message).join(', '));
        }
        throw new Error('Error al crear materia: ' + error.message);
    }
};

// Actualizar una materia
const updateMateria = async (id, materiaData) => {
    try {
        const [updatedRows] = await Materia.update(materiaData, {
            where: { id: id }
        });
        if (updatedRows > 0) {
            return Materia.findByPk(id); // Retorna la materia actualizada
        }
        return null; // Si no se encontró la materia
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una materia con ese nombre.');
        }
        if (error.name === 'SequelizeValidationError') {
            throw new Error('Error de validación: ' + error.errors.map(e => e.message).join(', '));
        }
        throw new Error('Error al actualizar materia: ' + error.message);
    }
};

// Eliminar una materia
const deleteMateria = async (id) => {
    try {
        const deletedRows = await Materia.destroy({
            where: { id: id }
        });
        return deletedRows > 0; // Retorna true si se eliminó, false si no se encontró
    } catch (error) {
        throw new Error('Error al eliminar materia: ' + error.message);
    }
};

module.exports = {
    findAllMaterias,
    findMateriaById,
    createMateria,
    updateMateria,
    deleteMateria,
};