import { Request, Response, NextFunction } from 'express';
import dictadoService from './dictado.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

// ========== CREATE ==========
export const createDictado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body);
    const dictado = await dictadoService.createDictado(sanitizedData);

    res.status(201).json({
      success: true,
      message: 'Dictado creado exitosamente',
      data: dictado,
    });
  } catch (error) {
    next(error);
  }
};

// ========== READ ==========
export const getAllDictados = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dictados = await dictadoService.getAllDictados();

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos exitosamente',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dictado = await dictadoService.getDictadoById(id);

    if (!dictado) {
      return res.status(404).json({
        success: false,
        message: 'Dictado no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dictado obtenido exitosamente',
      data: dictado,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosByCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursoId = Number(req.params.cursoId);
    const dictados = await dictadoService.getDictadosByCurso(cursoId);

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos por curso',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosByPersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docenteId = Number(req.params.personaId);
    const dictados = await dictadoService.getDictadosByPersona(docenteId);

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos por persona',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosActivos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dictados = await dictadoService.getDictadosActivos();

    res.status(200).json({
      success: true,
      message: 'Dictados activos obtenidos',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosActivosByPersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docenteId = Number(req.params.personaId);
    const dictados = await dictadoService.getDictadosActivosByPersona(docenteId);

    res.status(200).json({
      success: true,
      message: 'Dictados activos obtenidos por persona',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosByMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materiaId = Number(req.params.materiaId);
    const dictados = await dictadoService.getDictadosByMateria(materiaId);

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos por materia',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosByCursoAndMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursoId = Number(req.query.cursoId);
    const materiaId = Number(req.query.materiaId);

    if (!cursoId || !materiaId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros cursoId o materiaId',
      });
    }

    const dictados = await dictadoService.getDictadosByCursoAndMateria(cursoId, materiaId);

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos por curso y materia',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

// ========== UPDATE ==========
export const updateDictado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const sanitizedData = sanitizeObjectStrings(req.body);

    const updatedDictado = await dictadoService.updateDictado(id, sanitizedData);

    if (!updatedDictado) {
      return res.status(404).json({
        success: false,
        message: 'Dictado no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dictado actualizado exitosamente',
      data: updatedDictado,
    });
  } catch (error) {
    next(error);
  }
};

// ========== DELETE ==========
export const deleteDictado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deletedDictado = await dictadoService.deleteDictado(id);

    if (!deletedDictado) {
      return res.status(404).json({
        success: false,
        message: 'Dictado no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dictado eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};