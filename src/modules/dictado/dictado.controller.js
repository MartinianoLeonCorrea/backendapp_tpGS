// src/controllers/dictado.controller.js
const dictadoService = require('../services/dictado.service');

// ========== CREATE ==========
const createDictadoWithRelations = async (req, res, next) => {
  try {
    const { docentesIds, materiasIds, ...dictadoData } = req.body;
    const newDictado = await dictadoService.createDictadoWithRelations(
      dictadoData,
      docentesIds,
      materiasIds
    );
    res.status(201).json(newDictado);
  } catch (error) {
    next(error);
  }
};

// ========== READ ==========
const getAllDictados = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getAllDictados();
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

const getDictadoById = async (req, res, next) => {
  try {
    const dictado = await dictadoService.getDictadoById(req.params.id);
    if (!dictado) {
      return res.status(404).json({ message: 'Dictado no encontrado' });
    }
    res.status(200).json(dictado);
  } catch (error) {
    next(error);
  }
};

const getDictadosByCurso = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getDictadosByCurso(
      req.params.cursoId
    );
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

const getDictadosByPersona = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getDictadosByPersona(
      req.params.personaId
    );
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

const getDictadosActivosByPersona = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getDictadosActivosByPersona(
      req.params.personaId
    );
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

const getDictadosActivos = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getDictadosActivos();
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

const getDictadosByMateria = async (req, res, next) => {
  try {
    const dictados = await dictadoService.getDictadosByMateria(
      req.params.materiaId
    );
    res.status(200).json(dictados);
  } catch (error) {
    next(error);
  }
};

// ========== UPDATE ==========

const updateDictadoWithRelations = async (req, res, next) => {
  try {
    const { docentesIds, materiasIds, ...updateData } = req.body;
    const updatedDictado = await dictadoService.updateDictadoWithRelations(
      req.params.id,
      updateData,
      docentesIds,
      materiasIds
    );
    if (!updatedDictado) {
      return res.status(404).json({ message: 'Dictado no encontrado' });
    }
    res.status(200).json(updatedDictado);
  } catch (error) {
    next(error);
  }
};

const addDocenteToDictado = async (req, res, next) => {
  try {
    const { dictadoId, docenteId } = req.params;
    const dictado = await dictadoService.addDocenteToDictado(
      dictadoId,
      docenteId
    );
    if (!dictado) {
      return res
        .status(404)
        .json({ message: 'Dictado o Docente no encontrado' });
    }
    res.status(200).json(dictado);
  } catch (error) {
    next(error);
  }
};

const removeDocenteFromDictado = async (req, res, next) => {
  try {
    const { dictadoId, docenteId } = req.params;
    const dictado = await dictadoService.removeDocenteFromDictado(
      dictadoId,
      docenteId
    );
    if (!dictado) {
      return res
        .status(404)
        .json({ message: 'Dictado o Docente no encontrado' });
    }
    res.status(200).json(dictado);
  } catch (error) {
    next(error);
  }
};

const addMateriaToDictado = async (req, res, next) => {
  try {
    const { dictadoId, materiaId } = req.params;
    const dictado = await dictadoService.addMateriaToDictado(
      dictadoId,
      materiaId
    );
    if (!dictado) {
      return res
        .status(404)
        .json({ message: 'Dictado o Materia no encontrada' });
    }
    res.status(200).json(dictado);
  } catch (error) {
    next(error);
  }
};

const removeMateriaFromDictado = async (req, res, next) => {
  try {
    const { dictadoId, materiaId } = req.params;
    const dictado = await dictadoService.removeMateriaFromDictado(
      dictadoId,
      materiaId
    );
    if (!dictado) {
      return res
        .status(404)
        .json({ message: 'Dictado o Materia no encontrada' });
    }
    res.status(200).json(dictado);
  } catch (error) {
    next(error);
  }
};

// ========== DELETE ==========

const deleteDictado = async (req, res, next) => {
  try {
    const deletedDictado = await dictadoService.deleteDictado(req.params.id);
    if (!deletedDictado) {
      return res.status(404).json({ message: 'Dictado no encontrado' });
    }
    res.status(200).json({
      message: 'Dictado eliminado correctamente',
      data: deletedDictado,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDictadoWithRelations,
  getAllDictados,
  getDictadoById,
  getDictadosByCurso,
  getDictadosByPersona,
  getDictadosActivosByPersona,
  getDictadosActivos,
  getDictadosByMateria,
  updateDictadoWithRelations,
  addDocenteToDictado,
  removeDocenteFromDictado,
  addMateriaToDictado,
  removeMateriaFromDictado,
  deleteDictado,
};
