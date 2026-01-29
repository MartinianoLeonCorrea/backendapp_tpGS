import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/mysql';
import cursoService from './curso.service';
import { idParamSchema, getCursoQuerySchema } from './curso.schema';
import { sanitizeObjectStrings } from '../../utils/sanitize';

interface RequestWithEm extends Request {
  em: EntityManager;
}

// ========================= CREATE =========================
export const createCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body);
    const newCurso = await cursoService.createCurso(
      (req as RequestWithEm).em,
      sanitizedData
    );

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: newCurso,
    });
  } catch (error) {
    next(error);
  }
};

// ========================= READ =========================
export const getAllCursos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursos = await cursoService.getAllCursos(
      (req as RequestWithEm).em
    );

    res.status(200).json({
      success: true,
      message: 'Cursos obtenidos exitosamente',
      data: cursos,
      count: cursos.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getCursoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error: paramError } = idParamSchema.validate(req.params);
    if (paramError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros',
        errors: paramError.details.map(err => err.message),
      });
    }

    const { error: queryError } = getCursoQuerySchema.validate(req.query);
    if (queryError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en query params',
        errors: queryError.details.map(err => err.message),
      });
    }

    const id = Number(req.params.id);
    const options = {
      includeAlumnos: req.query.includeAlumnos === 'true',
      includeDictados: req.query.includeDictados === 'true',
    };

    const curso = await cursoService.getCursoById(
      (req as RequestWithEm).em,
      id,
      options
    );

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Curso obtenido exitosamente',
      data: curso,
    });
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================
export const updateCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error: paramError } = idParamSchema.validate(req.params);
    if (paramError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros',
        errors: paramError.details.map(err => err.message),
      });
    }

    const id = Number(req.params.id);
    const sanitizedData = sanitizeObjectStrings(req.body);

    const updatedCurso = await cursoService.updateCurso(
      (req as RequestWithEm).em,
      id,
      sanitizedData
    );

    if (!updatedCurso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: updatedCurso,
    });
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================
export const deleteCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error: paramError } = idParamSchema.validate(req.params);
    if (paramError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros',
        errors: paramError.details.map(err => err.message),
      });
    }

    const id = Number(req.params.id);
    const deletedCurso = await cursoService.deleteCurso(
      (req as RequestWithEm).em,
      id
    );

    if (!deletedCurso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
