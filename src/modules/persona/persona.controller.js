const PersonaService = require('./persona.service');

// ========================= CREATE =========================

// Crear un alumno (mejorado con validaciones unificadas y respuestas estandarizadas)
const createAlumno = async (req, res, next) => {
  try {
    const alumnoData = { ...req.body, tipo: 'alumno' };

    // Verificar si el DNI ya existe (adicional al unique del modelo)
    const existingAlumno = await PersonaService.findPersonaByDni(
      alumnoData.dni
    );
    if (existingAlumno) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('DNI duplicado', [
            'El DNI ya está registrado en el sistema. Verifique los datos.',
          ])
        );
    }

    // Si se proporciona cursoId, validar que exista
    if (alumnoData.cursoId) {
      const cursoExists = await PersonaService.validateCursoExists(
        alumnoData.cursoId
      );
      if (!cursoExists) {
        return res
          .status(400)
          .json(
            PersonaService.errorResponse('Curso inválido', [
              `El curso con ID ${alumnoData.cursoId} no existe. No se puede asignar al alumno.`,
            ])
          );
      }
    }

    const newAlumno = await PersonaService.createPersona(alumnoData);
    res
      .status(201)
      .json(
        PersonaService.successResponse(
          'Alumno registrado exitosamente en la aplicación',
          newAlumno
        )
      );
  } catch (error) {
    next(error);
  }
};

// Crear un docente (mejorado similar a createAlumno)
const createDocente = async (req, res, next) => {
  try {
    const docenteData = { ...req.body, tipo: 'docente' };

    // Verificar que no incluya cursoId (docentes no lo necesitan)
    if (docenteData.cursoId) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('Campo no permitido', [
            'Los docentes no pueden ser asignados a un curso. Remueva el campo cursoId.',
          ])
        );
    }

    const newDocente = await PersonaService.createPersona(docenteData); // Reusa createPersona con tipo
    res
      .status(201)
      .json(
        PersonaService.successResponse(
          'Docente registrado exitosamente en la aplicación',
          newDocente
        )
      );
  } catch (error) {
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
    const paginationValidation = PersonaService.validatePaginationParams({
      page,
      limit,
    });
    if (!paginationValidation.isValid) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse(
            'Parámetros de paginación inválidos',
            paginationValidation.errors
          )
        );
    }

    // Validar filtros
    const filterValidation = PersonaService.validateFilterParams({
      tipo,
      search,
    });
    if (!filterValidation.isValid) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse(
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

    const response = PersonaService.successResponse(
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

    // Validación del DNI
    if (!PersonaService.validateDni(dni)) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('DNI inválido', [
            'El DNI debe ser un número válido',
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
          PersonaService.errorResponse('Persona no encontrada', [
            `No existe una persona con DNI ${dni}`,
          ])
        );
    }

    res
      .status(200)
      .json(
        PersonaService.successResponse('Persona obtenida exitosamente', persona)
      );
  } catch (error) {
    next(error);
  }
};

// Obtener alumnos por curso
const getAlumnosByCurso = async (req, res, next) => {
  try {
    const { cursoId } = req.params;

    // Validar cursoId
    if (!PersonaService._validateId(cursoId)) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('Curso ID inválido', [
            'El cursoId debe ser un número válido.',
          ])
        );
    }

    const alumnos = await PersonaService.findAlumnosByCurso(cursoId);

    if (!alumnos || alumnos.length === 0) {
      return res
        .status(404)
        .json(
          PersonaService.errorResponse('Alumnos no encontrados', [
            `No se encontraron alumnos para el curso con ID ${cursoId}.`,
          ])
        );
    }

    res
      .status(200)
      .json(
        PersonaService.successResponse(
          'Alumnos obtenidos exitosamente',
          alumnos
        )
      );
  } catch (error) {
    next(error);
  }
};

// Obtener materias por DNI de alumno
const getMateriasByAlumnoDni = async (req, res, next) => {
  try {
    const { dni } = req.params;

    // Validar DNI
    if (!PersonaService._validateDni(dni)) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('DNI inválido', [
            'El DNI debe ser un número entero válido.',
          ])
        );
    }

    const materias = await PersonaService.getMateriasByAlumnoDni(dni);

    if (!materias || materias.length === 0) {
      return res
        .status(404)
        .json(
          PersonaService.errorResponse('Materias no encontradas', [
            `No se encontraron materias para el alumno con DNI ${dni}.`,
          ])
        );
    }

    res
      .status(200)
      .json(
        PersonaService.successResponse(
          'Materias obtenidas exitosamente',
          materias
        )
      );
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================

// Actualizar una persona
const updatePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const personaData = req.body;

    console.log('Actualizando persona con DNI:', dni, 'Datos:', personaData);

    const updatedPersona = await PersonaService.updatePersona(dni, personaData);

    if (!updatedPersona) {
      return res.status(404).json({
        success: false,
        message: `No se encontró una persona con el DNI ${dni}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Persona actualizada exitosamente',
      data: updatedPersona,
    });
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// ========================= DELETE =========================

// Eliminar una persona (mejorado con chequeo de dependientes)
const deletePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;

    if (!PersonaService.validateDni(dni)) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('DNI inválido', [
            'El DNI debe ser un número entero válido.',
          ])
        );
    }

    // Chequear dependientes (e.g., si es alumno con notas, o docente con dictados)
    const hasDependents = await PersonaService.checkDependents(parseInt(dni));
    if (hasDependents) {
      return res
        .status(400)
        .json(
          PersonaService.errorResponse('Eliminación bloqueada', [
            'No se puede eliminar esta persona porque tiene registros asociados (notas, dictados, etc.). Use soft delete o resuelva dependencias.',
          ])
        );
    }

    const deletedPersona = await PersonaService.deletePersona(parseInt(dni));

    if (!deletedPersona) {
      return res
        .status(404)
        .json(
          PersonaService.errorResponse('Persona no encontrada', [
            `No se encontró la persona con DNI ${dni} para eliminar.`,
          ])
        );
    }

    res.status(200).json(
      PersonaService.successResponse('Persona eliminada exitosamente', {
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
  getAlumnosByCurso,
  getMateriasByAlumnoDni,
  updatePersona,
  deletePersona,
};
