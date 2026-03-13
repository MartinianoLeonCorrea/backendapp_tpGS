import evaluacionService from './evaluacion.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';
import { Request, Response, NextFunction } from 'express';

const getFirstString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
};

const parseOptionalInt = (value: unknown): number | undefined => {
  const text = getFirstString(value);
  if (text === undefined) return undefined;
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseIntOrNaN = (value: unknown): number => {
  const parsed = parseOptionalInt(value);
  return parsed === undefined ? NaN : parsed;
};

// Obtener todas las evaluaciones (para admin; con filtros opcionales)
export const getAllEvaluaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as Record<string, unknown>;
    const idNum = parseOptionalInt(query.examenId);
    const dniNum = parseOptionalInt(query.alumnoDni);
    const dictadoNum = parseOptionalInt(query.dictadoId);
    const pageNum = parseOptionalInt(query.page) ?? 1;
    const limitNum = parseOptionalInt(query.limit) ?? 10;

    if (
      (query.examenId !== undefined && idNum === undefined) ||
      (query.alumnoDni !== undefined && dniNum === undefined) ||
      (query.dictadoId !== undefined && dictadoNum === undefined)
    ) {
      return res.status(400).json({ message: 'IDs o DNI inválidos' });
    }

    const options = {
      examenId: idNum,
      alumnoDni: dniNum,
      dictadoId: dictadoNum,
      page: pageNum,
      limit: limitNum,
    };

    const evaluaciones = await evaluacionService.findAllEvaluaciones(options);
    const total = await evaluacionService.countEvaluaciones(options);

    res.status(200).json({
      message: 'Evaluaciones obtenidas exitosamente',
      data: evaluaciones,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        count: evaluaciones.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una evaluación por ID
export const getEvaluacionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idNum = parseIntOrNaN(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const evaluacion = await evaluacionService.findEvaluacionById(idNum, {
      includeExamen: true,
      includeAlumno: true,
    });
    if (!evaluacion) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.status(200).json({
      message: 'Evaluación obtenida exitosamente',
      data: evaluacion,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener evaluaciones por examenId
export const getEvaluacionesByExamen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idNum = parseIntOrNaN(req.params.examenId);

    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID de examen inválido' });
    }

    const evaluaciones = await evaluacionService.findEvaluacionesByExamen(
      idNum
    );

    res.status(200).json({
      message: 'Evaluaciones obtenidas exitosamente',
      data: evaluaciones,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener evaluación por alumnoId y examenId
export const getEvaluacionByAlumnoAndExamen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alumnoNum = parseIntOrNaN(req.params.alumnoId);
    const examenNum = parseIntOrNaN(req.params.examenId);

    if (isNaN(alumnoNum) || isNaN(examenNum)) {
      return res
        .status(400)
        .json({ message: 'ID de alumno o examen inválido' });
    }

    const evaluacion = await evaluacionService.findEvaluacionByExamenAndAlumno(
      examenNum,
      alumnoNum
    );

    if (!evaluacion) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.status(200).json({
      message: 'Evaluación obtenida exitosamente',
      data: evaluacion,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvaluacionesByAlumno = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alumnoNum = parseIntOrNaN(req.params.alumnoId);

    if (isNaN(alumnoNum)) {
      return res.status(400).json({ message: 'ID de alumno inválido' });
    }

    const evaluaciones = await evaluacionService.findEvaluacionesByAlumno(
      alumnoNum
    );

    res.status(200).json({
      message: 'Evaluaciones obtenidas exitosamente',
      data: evaluaciones,
    });
  } catch (error) {
    next(error);
  }
};

// Crear una evaluación (subir nota para un alumno en un examen)
export const createEvaluacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body) as any;
    const { nota, observacion, examenId, alumnoDni } = sanitizedData;

    console.log('Datos recibidos en createEvaluacion:', {
      nota,
      observacion,
      examenId,
      alumnoDni,
    });

    // Validaciones
    if (nota === undefined || nota < 0 || nota > 10) {
      console.error(
        'Error de validación: La nota debe ser un número entre 0 y 10'
      );
      return res
        .status(400)
        .json({ message: 'La nota debe ser un número entre 0 y 10' });
    }
    if (!examenId || !alumnoDni) {
      console.error(
        'Error de validación: Faltan examenId o alumnoDni obligatorios'
      );
      return res
        .status(400)
        .json({ message: 'Faltan examenId o alumnoDni obligatorios' });
    }
    const examenNum = parseInt(examenId);
    const dniNum = parseInt(alumnoDni);
    if (isNaN(examenNum) || isNaN(dniNum)) {
      console.error('Error de validación: examenId o alumnoDni inválidos');
      return res
        .status(400)
        .json({ message: 'examenId o alumnoDni inválidos' });
    }

    // Verificar unique (no duplicar nota por examen/alumno)
    const existing = await evaluacionService.findEvaluacionByExamenAndAlumno(
      examenNum,
      dniNum
    );
    if (existing) {
      console.error(
        'Error: Ya existe una evaluación para este alumno y examen'
      );
      return res.status(400).json({
        message: 'Ya existe una evaluación para este alumno y examen',
      });
    }

    // Verificar que alumno esté en el curso del examen (via dictado → curso)
    const examen = await evaluacionService.getExamenById(examenNum);
    if (!examen || !examen.dictado || !examen.dictado.curso) {
      console.error('Error: Examen o dictado no encontrado');
      return res
        .status(404)
        .json({ message: 'Examen o dictado no encontrado' });
    }
    const alumno = await evaluacionService.getPersonaByDni(dniNum);
    if (!alumno || alumno.curso?.id !== examen.dictado.curso?.id) {
      console.error('Error: El alumno no pertenece al curso del examen');
      return res
        .status(400)
        .json({ message: 'El alumno no pertenece al curso del examen' });
    }

    console.log('Creando evaluación con datos validados:', {
      nota,
      observacion,
      examenId: examenNum,
      alumnoId: dniNum,
    });

    const newEvaluacion = await evaluacionService.createEvaluacion({
      nota,
      observacion,
      examenId: examenNum,
      alumnoId: dniNum,
    });

    console.log('Evaluación creada exitosamente:', newEvaluacion);

    res.status(201).json({
      message: 'Evaluación creada exitosamente',
      data: newEvaluacion,
    });
  } catch (error) {
    console.error('Error en createEvaluacion:', error);
    next(error);
  }
};

// ========================= BATCH OPERATIONS =========================

// Crear múltiples evaluaciones en batch
export const createBatchEvaluaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { evaluaciones } = req.body;
    console.log('Datos recibidos en batch-create:', { evaluaciones });

    if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debe proporcionar un array de evaluaciones' });
    }

    const validEvaluaciones = [];
    const errors = [];

    for (const evalData of evaluaciones) {
      // Sanitizar cada objeto individual
      const sanitizedEval = sanitizeObjectStrings(evalData) as any;
      const { nota, observacion, examenId, alumnoId } = sanitizedEval;

      // Validación nota
      if (nota !== undefined && (nota < 0 || nota > 10 || isNaN(nota))) {
        errors.push(`Nota inválida para alumno ${alumnoId}`);
        continue;
      }

      // Validación IDs
      const examenNum = parseInt(examenId);
      const alumnoNum = parseInt(alumnoId);

      if (isNaN(examenNum) || isNaN(alumnoNum)) {
        errors.push(`IDs inválidos para alumno ${alumnoId}`);
        continue;
      }

      validEvaluaciones.push({
        nota,
        observacion,
        examenId: examenNum,
        alumnoId: alumnoNum,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Algunos datos son inválidos',
        errors,
        validCount: validEvaluaciones.length,
      });
    }

    if (validEvaluaciones.length === 0) {
      return res
        .status(400)
        .json({ message: 'No hay datos válidos para crear' });
    }

    // Crear batch
    const createdEvaluaciones = await evaluacionService.createBatchEvaluaciones(
      validEvaluaciones
    );
    console.log('Evaluaciones batch creadas:', createdEvaluaciones);

    res.status(201).json({
      message: 'Evaluaciones creadas exitosamente',
      data: createdEvaluaciones,
      createdCount: createdEvaluaciones.length,
    });
  } catch (error) {
    console.error('Error en createBatchEvaluaciones:', error);
    next(error);
  }
};

// Actualizar múltiples evaluaciones en batch
export const updateBatchEvaluaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { evaluaciones } = req.body;

    if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debe proporcionar un array de evaluaciones' });
    }

    // Sanitizar y validar cada evaluación para garantizar id numérico
    const sanitizedEvaluaciones: Array<{ id: number; nota?: number; observacion?: string; examenId?: number; alumnoId?: number }> = [];

    for (const evalData of evaluaciones) {
      const sanitizedEval = sanitizeObjectStrings(evalData) as any;
      const idNum = Number(sanitizedEval.id);

      if (!Number.isInteger(idNum)) {
        return res.status(400).json({ message: 'Cada evaluación debe incluir un id numérico válido' });
      }

      sanitizedEvaluaciones.push({
        id: idNum,
        nota: sanitizedEval.nota,
        observacion: sanitizedEval.observacion,
        examenId: sanitizedEval.examenId,
        alumnoId: sanitizedEval.alumnoId,
      });
    }

    const updatedEvaluaciones = await evaluacionService.updateBatchEvaluaciones(
      sanitizedEvaluaciones
    );

    res.status(200).json({
      message: 'Evaluaciones actualizadas exitosamente',
      data: updatedEvaluaciones,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una evaluación (editar nota/observación)
export const updateEvaluacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body) as any;
    const { nota, observacion } = sanitizedData;
    
    const idNum = parseIntOrNaN(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    if (nota !== undefined && (nota < 0 || nota > 10)) {
      return res
        .status(400)
        .json({ message: 'La nota debe ser un número entre 0 y 10' });
    }

    const updatedEvaluacion = await evaluacionService.updateEvaluacion(idNum, {
      nota,
      observacion,
    });
    if (!updatedEvaluacion) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.status(200).json({
      message: 'Evaluación actualizada exitosamente',
      data: updatedEvaluacion,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una evaluación
export const deleteEvaluacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idNum = parseIntOrNaN(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleted = await evaluacionService.deleteEvaluacion(idNum);
    if (!deleted) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.status(200).json({
      message: 'Evaluación eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};


