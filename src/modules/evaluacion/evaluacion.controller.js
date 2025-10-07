const evaluacionService = require('../evaluacion/evaluacion.service'); // Asume que existe, similar a otros
const { get } = require('./evaluacion.routes');

// Obtener todas las evaluaciones (para admin; con filtros opcionales)
const getAllEvaluaciones = async (req, res, next) => {
  try {
    const { examenId, alumnoDni, dictadoId, page = 1, limit = 10 } = req.query;
    const idNum = parseInt(examenId);
    const dniNum = parseInt(alumnoDni);
    const dictadoNum = parseInt(dictadoId);

    if (
      (examenId && isNaN(idNum)) ||
      (alumnoDni && isNaN(dniNum)) ||
      (dictadoId && isNaN(dictadoNum))
    ) {
      return res.status(400).json({ message: 'IDs o DNI inválidos' });
    }

    const options = {
      examenId: idNum || undefined,
      alumnoDni: dniNum || undefined,
      dictadoId: dictadoNum || undefined,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const evaluaciones = await evaluacionService.findAllEvaluaciones(options);
    const total = await evaluacionService.countEvaluaciones(options); // Asume método en service

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
const getEvaluacionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
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
const getEvaluacionesByExamen = async (req, res, next) => {
  try {
    const { examenId } = req.params;
    const idNum = parseInt(examenId);

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
const getEvaluacionByAlumnoAndExamen = async (req, res, next) => {
  try {
    const { alumnoId, examenId } = req.params;
    const alumnoNum = parseInt(alumnoId);
    const examenNum = parseInt(examenId);

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
const getEvaluacionesByAlumno = async (req, res, next) => {
  try {
    const { alumnoId } = req.params;
    const alumnoNum = parseInt(alumnoId);

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
const createEvaluacion = async (req, res, next) => {
  try {
    const { nota, observacion, examenId, alumnoDni } = req.body;

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
    const examen = await evaluacionService.getExamenById(examenNum); // Asume helper en service
    if (!examen || !examen.dictado || !examen.dictado.curso) {
      console.error('Error: Examen o dictado no encontrado');
      return res
        .status(404)
        .json({ message: 'Examen o dictado no encontrado' });
    }
    const alumno = await evaluacionService.getPersonaByDni(dniNum); // Asume helper
    if (!alumno || alumno.cursoId !== examen.dictado.cursoId) {
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
      alumnoId: dniNum, // Asumiendo FK alumnoId es DNI
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
const createBatchEvaluaciones = async (req, res, next) => {
  try {
    const { evaluaciones } = req.body;
    console.log('Datos recibidos en batch-create:', { evaluaciones }); // Log para debug

    if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debe proporcionar un array de evaluaciones' });
    }

    const validEvaluaciones = [];
    const errors = [];

    for (const evalData of evaluaciones) {
      const { nota, observacion, examenId, alumnoId } = evalData; // Usa alumnoId (no alumnoDni)

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
const updateBatchEvaluaciones = async (req, res, next) => {
  try {
    const { evaluaciones } = req.body;

    if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debe proporcionar un array de evaluaciones' });
    }

    const updatedEvaluaciones = await evaluacionService.updateBatchEvaluaciones(
      evaluaciones
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
const updateEvaluacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nota, observacion } = req.body;
    const idNum = parseInt(id);
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
const deleteEvaluacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
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

module.exports = {
  getAllEvaluaciones,
  getEvaluacionById,
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  getEvaluacionesByExamen,
  getEvaluacionesByAlumno,
  getEvaluacionByAlumnoAndExamen,
  createBatchEvaluaciones,
  updateBatchEvaluaciones,
};
