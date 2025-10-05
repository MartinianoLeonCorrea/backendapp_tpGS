const evaluacionService = require('../evaluacion/evaluacion.service'); // Asume que existe, similar a otros

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

// Crear una evaluación (subir nota para un alumno en un examen)
const createEvaluacion = async (req, res, next) => {
  try {
    const { nota, observacion, examenId, alumnoDni } = req.body;

    // Validaciones
    if (nota === undefined || nota < 0 || nota > 10) {
      return res
        .status(400)
        .json({ message: 'La nota debe ser un número entre 0 y 10' });
    }
    if (!examenId || !alumnoDni) {
      return res
        .status(400)
        .json({ message: 'Faltan examenId o alumnoDni obligatorios' });
    }
    const examenNum = parseInt(examenId);
    const dniNum = parseInt(alumnoDni);
    if (isNaN(examenNum) || isNaN(dniNum)) {
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
      return res
        .status(400)
        .json({
          message: 'Ya existe una evaluación para este alumno y examen',
        });
    }

    // Verificar que alumno esté en el curso del examen (via dictado → curso)
    const examen = await evaluacionService.getExamenById(examenNum); // Asume helper en service
    if (!examen || !examen.dictado || !examen.dictado.curso) {
      return res
        .status(404)
        .json({ message: 'Examen o dictado no encontrado' });
    }
    const alumno = await evaluacionService.getPersonaByDni(dniNum); // Asume helper
    if (!alumno || alumno.cursoId !== examen.dictado.cursoId) {
      return res
        .status(400)
        .json({ message: 'El alumno no pertenece al curso del examen' });
    }

    const newEvaluacion = await evaluacionService.createEvaluacion({
      nota,
      observacion,
      examenId: examenNum,
      alumnoId: dniNum, // Asumiendo FK alumnoId es DNI
    });

    res.status(201).json({
      message: 'Evaluación creada exitosamente',
      data: newEvaluacion,
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
};
