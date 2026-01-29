import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/mysql';
import dictadoService from './dictado.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

interface RequestWithEm extends Request {
  em: EntityManager;
}

// ========== CREATE ==========
export const createDictado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body);
    const dictado = await dictadoService.createDictado(
      (req as RequestWithEm).em,
      sanitizedData
    );

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
    const dictados = await dictadoService.getAllDictados(
      (req as RequestWithEm).em
    );

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
    const dictado = await dictadoService.getDictadoById(
      (req as RequestWithEm).em,
      id
    );

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
    const dictados = await dictadoService.getDictadosByCurso(
      (req as RequestWithEm).em,
      cursoId
    );

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
    const personaId = Number(req.params.personaId);

    if (!personaId) {
      return res.status(400).json({
        success: false,
        message: 'Falta personaId en la ruta',
      });
    }

    const dictados = await dictadoService.getDictadosByPersona(
      (req as RequestWithEm).em,
      personaId
    );

    res.status(200).json({
      success: true,
      message: 'Dictados obtenidos por persona',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosActivosByPersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personaId = Number(req.params.personaId);
    const dictados = await dictadoService.getDictadosActivosByPersona(
      (req as RequestWithEm).em,
      personaId
    );

    res.status(200).json({
      success: true,
      message: 'Dictados activos obtenidos por persona',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosActivos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dictados = await dictadoService.getDictadosActivos(
      (req as RequestWithEm).em
    );

    res.status(200).json({
      success: true,
      message: 'Dictados activos obtenidos',
      data: dictados,
    });
  } catch (error) {
    next(error);
  }
};

export const getDictadosByMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materiaId = Number(req.params.materiaId);
    const dictados = await dictadoService.getDictadosByMateria(
      (req as RequestWithEm).em,
      materiaId
    );

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

    const dictados = await dictadoService.getDictadosByCursoAndMateria(
      (req as RequestWithEm).em,
      cursoId,
      materiaId
    );

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
    const updateData = req.body;


    const sanitizedData = sanitizeObjectStrings(updateData);

    const updatedDictado = await dictadoService.updateDictado(
      (req as RequestWithEm).em,
      id,
      sanitizedData
    );

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
    const deletedDictado = await dictadoService.deleteDictado(
      (req as RequestWithEm).em,
      id
    );

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
