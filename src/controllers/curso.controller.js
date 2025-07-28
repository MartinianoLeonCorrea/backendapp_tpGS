// Lógica de los controladores para la entidad Curso

const cursoService = require('../services/curso.service');

// Obtener todos los cursos
const getAllCursos = async (req, res, next) => {
  try {
    const cursos = await cursoService.findAllCursos();
    res.status(200).json(cursos);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores global
  }
};

// Obtener un curso por ID
const getCursoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const curso = await cursoService.findCursoById(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo curso
const createCurso = async (req, res, next) => {
  try {
    const cursoData = req.body;
    const newCurso = await cursoService.createCurso(cursoData);
    res.status(201).json(newCurso);
  } catch (error) {
    next(error);
  }
};

// Actualizar un curso existente
const updateCurso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cursoData = req.body;

    const updatedCurso = await cursoService.updateCurso(id, cursoData);
    if (!updatedCurso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.status(200).json(updatedCurso);
  } catch (error) {
    next(error);
  }
};

// Eliminar un curso
const deleteCurso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCurso = await cursoService.deleteCurso(id);
    if (!deletedCurso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
};
