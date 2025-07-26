// Lógica de los controladores para la entidad Materia

const materiaService = require('../services/materia.service'); // Importa el servicio de Materia

// Obtener todas las materias
const getAllMaterias = async (req, res, next) => {
    try {
        const materias = await materiaService.findAllMaterias();
        res.status(200).json(materias);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores global
    }
};

// Obtener una materia por ID
const getMateriaById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const materia = await materiaService.findMateriaById(id);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        res.status(200).json(materia);
    } catch (error) {
        next(error);
    }
};

// Crear una nueva materia
const createMateria = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        // Aquí podrías añadir validación más robusta antes de llamar al servicio
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre de la materia es requerido.' });
        }
        const newMateria = await materiaService.createMateria({ nombre, descripcion });
        res.status(201).json(newMateria);
    } catch (error) {
        next(error);
    }
};

// Actualizar una materia existente
const updateMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const updatedMateria = await materiaService.updateMateria(id, { nombre, descripcion });
        if (!updatedMateria) {
            return res.status(404).json({ message: 'Materia no encontrada para actualizar' });
        }
        res.status(200).json(updatedMateria);
    } catch (error) {
        next(error);
    }
};

// Eliminar una materia
const deleteMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await materiaService.deleteMateria(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Materia no encontrada para eliminar' });
        }
        res.status(204).send(); // 204 No Content para eliminación exitosa
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMaterias,
    getMateriaById,
    createMateria,
    updateMateria,
    deleteMateria,
};