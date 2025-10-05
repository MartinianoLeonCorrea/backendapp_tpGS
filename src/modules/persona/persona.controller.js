const PersonaService = require('./persona.service');

// ========================= CREATE =========================

// Crear un alumno

const createAlumno = async (req, res, next) => {
  console.log('Datos recibidos en createAlumno:', req.body); //sacar
  try {
    const alumnoData = { ...req.body, tipo: 'alumno' };

    // Validaciones
    if (!alumnoData.dni || !alumnoData.nombre || !alumnoData.apellido) {
      return res.status(400).json({
        message: 'Los campos DNI, nombre y apellido son obligatorios',
      });
    }

    if (!/^[\d]{7,9}$/.test(alumnoData.dni)) {
      return res.status(400).json({
        message: 'El DNI debe ser un número entre 1,000,000 y 999,999,999',
      });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(alumnoData.email)) {
      return res.status(400).json({
        message: 'El email debe tener un formato válido',
      });
    }

    if (!/^[\d\s\-\+\(\)]*$/.test(alumnoData.telefono)) {
      return res.status(400).json({
        message: 'El teléfono contiene caracteres no válidos',
      });
    }

    // Verificar si el DNI ya existe
    const existingAlumno = await PersonaService.findPersonaByDni(
      alumnoData.dni
    );
    if (existingAlumno) {
      return res.status(400).json({
        message: 'El DNI ya está registrado',
      });
    }

    const newAlumno = await PersonaService.createPersona(alumnoData);
    res.status(201).json({
      message: 'Alumno creado exitosamente',
      data: newAlumno,
    });
  } catch (error) {
    console.error('Error en createAlumno:', error);
    if (error.name) console.error('Error name:', error.name);
    if (error.message) console.error('Error message:', error.message);
    if (error.stack) console.error('Error stack:', error.stack);
    if (error.errors) console.error('Error errors:', error.errors);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }
    if (error.name === 'SequelizeValidationError' && error.errors) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Error interno', error: error.message });
  }
};

// Crear un docente

const createDocente = async (req, res, next) => {
  try {
    const docenteData = req.body;

    // Validaciones básicas

    if (!docenteData.dni || !docenteData.nombre || !docenteData.apellido) {
      return res.status(400).json({
        message: 'Los campos dni, nombre y apellido son obligatorios',
      });
    }

    // Verificar que no incluya cursoId

    if (docenteData.cursoId) {
      return res.status(400).json({
        message: 'Los docentes no pueden tener curso asignado',
      });
    }

    const newDocente = await PersonaService.createDocente(docenteData);
    res.status(201).json({
      message: 'Docente creado exitosamente',
      data: newDocente,
    });
  } catch (error) {
    next(error);
  }
};

// ========================= READ ===========================

// Obtener todas las personas

const getAllPersonas = async (req, res, next) => {
  try {
    const { tipoCodigo, includeCurso, includeDictados } = req.query;
    const options = {
      tipoCodigo,
      includeCurso: includeCurso === 'true',
      includeDictados: includeDictados === 'true',
    };

    const personas = await PersonaService.findAllPersonas(options);
    res.status(200).json({
      message: 'Personas obtenidas exitosamente',
      data: personas,
      count: personas.length,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener persona por DNI

const getPersonaByDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const { includeCurso, includeDictados } = req.query;

    const options = {
      includeCurso: includeCurso === 'true',
      includeDictados: includeDictados === 'true',
    };

    console.log('DNI recibido:', req.params.dni);
    const dniNum = parseInt(dni);
    if (isNaN(dniNum)) {
      return res.status(400).json({ message: 'DNI inválido' });
    }

    // Cambiar de instancia a método estático
    const persona = await PersonaService.findPersonaByDni(dniNum, options);

    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({
      message: 'Persona obtenida exitosamente',
      data: persona,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los alumnos

const getAllAlumnos = async (req, res, next) => {
  try {
    const { cursoId, includeCurso } = req.query;
    const options = {
      cursoId: cursoId ? parseInt(cursoId) : undefined,
      includeCurso: includeCurso !== 'false', // Por defecto true
    };

    const alumnos = await PersonaService.findAllAlumnos(options);
    res.status(200).json({
      message: 'Alumnos obtenidos exitosamente',
      data: alumnos,
      count: alumnos.length,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los docentes

const getAllDocentes = async (req, res, next) => {
  try {
    const { includeDictados, especialidad } = req.query;
    const options = {
      includeDictados: includeDictados === 'true',
      especialidad,
    };

    const docentes = await PersonaService.findAllDocentes(options);
    res.status(200).json({
      message: 'Docentes obtenidos exitosamente',
      data: docentes,
      count: docentes.length,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener alumnos por curso

const getAlumnosByCurso = async (req, res, next) => {
  try {
    const { cursoId } = req.params;
    const alumnos = await PersonaService.findAlumnosByCurso(parseInt(cursoId));

    res.status(200).json({
      message: 'Alumnos del curso obtenidos exitosamente',
      data: alumnos,
      count: alumnos.length,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener materias por DNI de alumno

const getMateriasByAlumnoDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const materias = await PersonaService.getMateriasByAlumnoDni(parseInt(dni));
    res.status(200).json({
      message: 'Materias obtenidas exitosamente',
      data: materias,
    });
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

    const updatedPersona = await PersonaService.updatePersona(
      parseInt(dni),
      personaData
    );

    if (!updatedPersona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({
      message: 'Persona actualizada exitosamente',
      data: updatedPersona,
    });
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================

// Eliminar una persona

const deletePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const deletedPersona = await PersonaService.deletePersona(parseInt(dni));

    if (!deletedPersona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({
      message: 'Persona eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlumno,
  createDocente,
  getAllPersonas,
  getPersonaByDni,
  getAllAlumnos,
  getAllDocentes,
  getAlumnosByCurso,
  getMateriasByAlumnoDni,
  updatePersona,
  deletePersona,
};
