const PersonaService = require('./persona.service');

// ========================= CREATE =========================

// Crear un alumno (mejorado con validaciones unificadas y respuestas estandarizadas)
const createAlumno = async (req, res, next) => {
  try {
    const alumnoData = { ...req.body, tipo: 'alumno' };

    // Validación unificada usando el service (similar a Materia)
    const validationResult =
      PersonaService._validateCreateAlumnoData(alumnoData);
    if (!validationResult.isValid) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Error de validación en el registro de alumno',
            validationResult.errors
          )
        );
    }

    // Verificar si el DNI ya existe (adicional al unique del modelo)
    const existingAlumno = await PersonaService.findPersonaByDni(
      alumnoData.dni
    );
    if (existingAlumno) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('DNI duplicado', [
            'El DNI ya está registrado en el sistema. Verifique los datos.',
          ])
        );
    }

    // Si se proporciona cursoId, validar que exista
    if (alumnoData.cursoId) {
      const cursoExists = await PersonaService._validateCursoExists(
        alumnoData.cursoId
      );
      if (!cursoExists) {
        return res
          .status(400)
          .json(
            PersonaService._errorResponse('Curso inválido', [
              `El curso con ID ${alumnoData.cursoId} no existe. No se puede asignar al alumno.`,
            ])
          );
      }
    }

    const newAlumno = await PersonaService.createPersona(alumnoData);
    res
      .status(201)
      .json(
        PersonaService._successResponse(
          'Alumno registrado exitosamente en la aplicación',
          newAlumno
        )
      );
  } catch (error) {
    console.error('Error en createAlumno:', error); // Remover en producción

    // Manejo específico de errores de Sequelize para respuestas más amigables
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('Conflicto de unicidad', [
            'El email o DNI ya está en uso. Intente con datos únicos.',
          ])
        );
    }
    if (error.name === 'SequelizeValidationError' && error.errors) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Error de validación en el modelo',
            validationErrors
          )
        );
    }
    // Error genérico
    next(error);
  }
};

// Crear un docente (mejorado similar a createAlumno)
const createDocente = async (req, res, next) => {
  try {
    const docenteData = { ...req.body, tipo: 'docente' };

    // Validación unificada
    const validationResult =
      PersonaService._validateCreateDocenteData(docenteData);
    if (!validationResult.isValid) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Error de validación en el registro de docente',
            validationResult.errors
          )
        );
    }

    // Verificar que no incluya cursoId (docentes no lo necesitan)
    if (docenteData.cursoId) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('Campo no permitido', [
            'Los docentes no pueden ser asignados a un curso. Remueva el campo cursoId.',
          ])
        );
    }

    // Validar especialidad si se proporciona (opcional, pero si está, debe ser válida)
    if (docenteData.especialidad) {
      const especialidadValidation = PersonaService._validateEspecialidad(
        docenteData.especialidad
      );
      if (!especialidadValidation.isValid) {
        return res
          .status(400)
          .json(
            PersonaService._errorResponse(
              'Especialidad inválida',
              especialidadValidation.errors
            )
          );
      }
    }

    const newDocente = await PersonaService.createPersona(docenteData); // Reusa createPersona con tipo
    res
      .status(201)
      .json(
        PersonaService._successResponse(
          'Docente registrado exitosamente en la aplicación',
          newDocente
        )
      );
  } catch (error) {
    // Similar manejo de errores que en createAlumno
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('Conflicto de unicidad', [
            'El email o DNI ya está en uso. Intente con datos únicos.',
          ])
        );
    }
    if (error.name === 'SequelizeValidationError' && error.errors) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Error de validación en el modelo',
            validationErrors
          )
        );
    }
    next(error);
  }
};

// ========================= READ ===========================

// Obtener todas las personas (con paginación y filtros mejorados, como en Materia)
const getAllPersonas = async (req, res, next) => {
  try {
    const { page, limit, tipo, search, includeCurso, includeDictados } =
      req.query;

    // Validar parámetros de paginación
    const paginationValidation = PersonaService._validatePaginationParams({
      page,
      limit,
    });
    if (!paginationValidation.isValid) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Parámetros de paginación inválidos',
            paginationValidation.errors
          )
        );
    }

    // Validar filtros
    const filterValidation = PersonaService._validateFilterParams({
      tipo,
      search,
    });
    if (!filterValidation.isValid) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse(
            'Filtros inválidos',
            filterValidation.errors
          )
        );
    }

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      tipo: tipo || null, // e.g., 'alumno' o 'docente'
      search: search || null, // Búsqueda por nombre/apellido/email
      includeCurso: includeCurso === 'true',
      includeDictados: includeDictados === 'true',
    };

    const personas = await PersonaService.findAllPersonas(options);

    // Obtener total para paginación
    let totalCount = null;
    if (page && limit) {
      totalCount = await PersonaService.countPersonas(options);
    }

    const response = PersonaService._successResponse(
      'Personas obtenidas exitosamente',
      personas
    );

    // Agregar metadata de paginación
    if (totalCount !== null) {
      response.pagination = PersonaService._buildPaginationMeta(
        options.page,
        options.limit,
        totalCount
      );
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Obtener persona por DNI (mejorado con validación de ID y includes)
const getPersonaByDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const { includeCurso, includeDictados } = req.query;

    // Validación del DNI (similar a _validateId, pero para DNI)
    if (!PersonaService._validateDni(dni)) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('DNI inválido', [
            'El DNI debe ser un número entero entre 1,000,000 y 99,999,999.',
          ])
        );
    }

    const dniNum = parseInt(dni);
    const options = {
      includeCurso: includeCurso === 'true',
      includeDictados: includeDictados === 'true',
    };

    const persona = await PersonaService.findPersonaByDni(dniNum, options);

    if (!persona) {
      return res
        .status(404)
        .json(
          PersonaService._errorResponse('Persona no encontrada', [
            `No existe una persona con DNI ${dniNum}.`,
          ])
        );
    }

    res
      .status(200)
      .json(
        PersonaService._successResponse(
          'Persona obtenida exitosamente',
          persona
        )
      );
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================

// Eliminar una persona (mejorado con chequeo de dependientes)
const deletePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;

    if (!PersonaService._validateDni(dni)) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('DNI inválido', [
            'El DNI debe ser un número entero válido.',
          ])
        );
    }

    // Chequear dependientes (e.g., si es alumno con notas, o docente con dictados)
    const hasDependents = await PersonaService._checkDependents(parseInt(dni));
    if (hasDependents) {
      return res
        .status(400)
        .json(
          PersonaService._errorResponse('Eliminación bloqueada', [
            'No se puede eliminar esta persona porque tiene registros asociados (notas, dictados, etc.). Use soft delete o resuelva dependencias.',
          ])
        );
    }

    const deletedPersona = await PersonaService.deletePersona(parseInt(dni));

    if (!deletedPersona) {
      return res
        .status(404)
        .json(
          PersonaService._errorResponse('Persona no encontrada', [
            `No se encontró la persona con DNI ${dni} para eliminar.`,
          ])
        );
    }

    res
      .status(200)
      .json(
        PersonaService._successResponse('Persona eliminada exitosamente', {
          dni: parseInt(dni),
        })
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlumno,
  createDocente,
  getAllPersonas,
  getPersonaByDni,
  deletePersona,
};
