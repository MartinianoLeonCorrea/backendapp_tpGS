import { Request, Response, NextFunction } from 'express';
import examenService from './examen.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

// Obtener todos los exámenes
export const getAllExamenes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const examenes = await examenService.getAllExamenes();
    res
      .status(200)
      .json(
        examenService._successResponse(
          'Exámenes obtenidos exitosamente',
          examenes
        )
      );
  } catch (error) {
    next(error);
  }
};

// Obtener un examen por ID
export const getExamenById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convertimos el param a número para el servicio
    const id = Number(req.params.id);

    const examen = await examenService.getExamenById(id);

    if (!examen) {
      return res
        .status(404)
        .json(
          examenService._errorResponse('Examen no encontrado', [
            `No existe un examen con ID ${id}`,
          ])
        );
    }

    res
      .status(200)
      .json(
        examenService._successResponse('Examen encontrado exitosamente', examen)
      );
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo examen
export const createExamen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body) as any;
    const { fecha_examen, temas, dictadoId } = sanitizedData;

    // Validar datos requeridos
    if (!fecha_examen || !temas || !dictadoId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios: fecha_examen, temas o dictadoId',
        errors: ['fecha_examen, temas y dictadoId son requeridos'],
      });
    }

    // Validar que dictadoId sea un número válido
    if (isNaN(Number(dictadoId))) {
      return res.status(400).json({
        success: false,
        message: 'El dictadoId debe ser un número válido',
        errors: ['dictadoId debe ser un número'],
      });
    }

    const newExamen = await examenService.createExamen(sanitizedData);

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
export const updateExamen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const sanitizedData = sanitizeObjectStrings(req.body);

    const updatedExamen = await examenService.updateExamen(id, sanitizedData);

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
export const deleteExamen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const deletedExamen = await examenService.deleteExamen(id);

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
export const getExamenesByMateria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Asumiendo que materiaId es numérico en la base de datos
    const materiaId = Number(req.params.materiaId);

    const examenes = await examenService.getExamenesByMateria(materiaId);

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
export const getExamenesByDictadoId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // En Express, query params pueden ser strings, arrays o undefined.
    // Forzamos el cast a string para evitar errores de tipo en TypeScript.
    const dictadoId = req.query.dictadoId as string;

    if (!dictadoId) {
      return res.status(400).json({
        success: false,
        message: 'Falta el parámetro dictadoId',
        errors: ['dictadoId es requerido'],
      });
    }

    if (isNaN(Number(dictadoId))) {
      return res.status(400).json({
        success: false,
        message: 'El dictadoId debe ser un número válido',
        errors: ['dictadoId debe ser numérico'],
      });
    }

    const examenes = await examenService.getExamenesByDictadoId(
      Number(dictadoId)
    );

    res.status(200).json({
      success: true,
      message: 'Exámenes obtenidos por dictado exitosamente',
      data: examenes,
    });
  } catch (error) {
    next(error);
  }
};
