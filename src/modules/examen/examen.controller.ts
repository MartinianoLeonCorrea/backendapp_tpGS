import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/mysql'; // <--- Agregado
import examenService from './examen.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

// Definimos un tipo local para que TypeScript no se queje de req.em
interface RequestWithEm extends Request {
  em: EntityManager;
}

// Obtener todos los exámenes
export const getAllExamenes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Castamos req como RequestWithEm
    const examenes = await examenService.getAllExamenes((req as RequestWithEm).em);
    res.status(200).json(
      examenService._successResponse('Exámenes obtenidos exitosamente', examenes)
    );
  } catch (error) {
    next(error);
  }
};

// Obtener un examen por ID
export const getExamenById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const examen = await examenService.getExamenById((req as RequestWithEm).em, id);

    if (!examen) {
      return res.status(404).json(
        examenService._errorResponse('Examen no encontrado', [`No existe un examen con ID ${id}`])
      );
    }

    res.status(200).json(
      examenService._successResponse('Examen encontrado exitosamente', examen)
    );
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo examen
export const createExamen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body) as any;
    const { fecha_examen, temas, dictadoId } = sanitizedData;

    if (!fecha_examen || !temas || !dictadoId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios: fecha_examen, temas o dictadoId',
        errors: ['fecha_examen, temas y dictadoId son requeridos'],
      });
    }

    const newExamen = await examenService.createExamen((req as RequestWithEm).em, sanitizedData);

    res.status(201).json({
      success: true,
      message: 'Examen creado exitosamente.',
      data: newExamen,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un examen
export const updateExamen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const sanitizedData = sanitizeObjectStrings(req.body);

    const updatedExamen = await examenService.updateExamen((req as RequestWithEm).em, id, sanitizedData);

    if (!updatedExamen) {
      return res.status(404).json({
        success: false,
        message: 'Examen no encontrado.',
        errors: ['No existe un examen con ese ID'],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Examen actualizado exitosamente.',
      data: updatedExamen,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un examen
export const deleteExamen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deletedExamen = await examenService.deleteExamen((req as RequestWithEm).em, id);

    if (!deletedExamen) {
      return res.status(404).json({
        success: false,
        message: 'Examen no encontrado',
        errors: ['No existe un examen con ese ID'],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Examen eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// Obtener exámenes por materia
export const getExamenesByMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materiaId = Number(req.params.materiaId);
    const examenes = await examenService.getExamenesByMateria((req as RequestWithEm).em, materiaId);

    res.status(200).json({
      success: true,
      message: 'Exámenes obtenidos por materia exitosamente',
      data: examenes,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener exámenes por dictadoId (Query Param)
export const getExamenesByDictadoId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dictadoId = req.query.dictadoId as string;

    if (!dictadoId) {
      return res.status(400).json({
        success: false,
        message: 'Falta el parámetro dictadoId',
        errors: ['dictadoId es requerido'],
      });
    }

    const examenes = await examenService.getExamenesByDictadoId((req as RequestWithEm).em, Number(dictadoId));

    res.status(200).json({
      success: true,
      message: 'Exámenes obtenidos por dictado exitosamente',
      data: examenes,
    });
  } catch (error) {
    next(error);
  }
};