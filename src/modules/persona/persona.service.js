// src/modules/persona/persona.service.js - REEMPLAZAR TODO EL ARCHIVO

const { Op } = require('sequelize');
const Persona = require('./persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('../dictado/dictado.model');
const Materia = require('../materia/materia.model');

class PersonaService {
  // ========================= CREATE =========================
  static async createPersona(personaData) {
    try {
      // Convierte cursoId y dni a número
      if (personaData.cursoId) personaData.cursoId = Number(personaData.cursoId);
      if (personaData.dni) personaData.dni = Number(personaData.dni);

      // Si tipo es 'alumno', especialidad debe ser null
      if (personaData.tipo === 'alumno') personaData.especialidad = null;

      console.log('Datos que se van a guardar:', personaData);
      const persona = await Persona.create(personaData);
      return persona;
    } catch (error) {
      // Manejar el error de validación de unicidad
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        if (field === 'dni') {
          throw new Error('El DNI ya se encuentra registrado.');
        }
        // if (field === 'email') {
        //   throw new Error('El email ya se encuentra registrado.');
        // }
      }

      // Manejar otros errores de validación (por ejemplo, formato de email, longitud)
      if (error.name === 'SequelizeValidationError') {
        const validationMessage = error.errors[0].message;
        throw new Error('Error de validación: ' + validationMessage);
      }

      // Manejar cualquier otro tipo de error desconocido
      throw new Error('Error al crear la persona: ' + error.message);
    }
  }

  static async createDocente(docenteData) {
    try {
      // Asegurarse de que sea docente y no tenga curso
      const docente = await Persona.create({
        ...docenteData,
        tipo: 'docente',
        cursoId: null // Los docentes no tienen curso asignado
      });
      return docente;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una persona con ese DNI o email.');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(
          'Error de validación: ' +
          error.errors.map((e) => e.message).join(', ')
        );
      }
      throw new Error('Error al crear docente: ' + error.message);
    }
  }

  // ========================= READ ===========================

  // Obtener todas las personas
  static async findAllPersonas(options = {}) {
    try {
      const { tipo, includeCurso = false, includeDictados = false } = options;
      const where = {};
      const include = [];

      // Filtrar por tipo si se especifica
      if (tipo) {
        where.tipo = tipo;
      }

      // Incluir curso si se solicita
      if (includeCurso) {
        include.push({
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        });
      }

      // Incluir dictados si se solicita (solo para docentes)
      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno'],
            },
          ],
        });
      }

      const personas = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      });

      return personas;
    } catch (error) {
      throw new Error('Error al obtener todas las personas: ' + error.message);
    }
  }

  // Encontrar persona por DNI
  static async findPersonaByDni(dni, options = {}) {
    try {
      const { includeCurso = false, includeDictados = false } = options;
      const include = [];

      if (includeCurso) {
        include.push({
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno']
        });
      }

      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno']
            },
            {
              model: Materia,
              as: 'materia',
              attributes: ['id', 'nombre', 'descripcion']
            }
          ]
        });
      }

      const persona = await Persona.findByPk(dni, { include });
      return persona;
    } catch (error) {
      throw new Error('Error al obtener persona por DNI: ' + error.message);
    }
  }

  // Método corregido para obtener alumnos
  static async findAllAlumnos(options = {}) {
    try {
      const { cursoId, includeCurso = true } = options;
      const where = { tipo: 'alumno' };
      const include = [];

      // Filtrar por curso si se especifica
      if (cursoId) {
        where.cursoId = cursoId;
      }

      // Incluir curso si se solicita
      if (includeCurso) {
        include.push({
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        });
      }

      const alumnos = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      });

      return alumnos;
    } catch (error) {
      throw new Error('Error al obtener todos los alumnos: ' + error.message);
    }
  }

  // Método corregido para obtener docentes
  static async findAllDocentes(options = {}) {
    try {
      const { includeDictados = false, especialidad } = options;
      const where = { tipo: 'docente' };
      const include = [];

      // Filtrar por especialidad si se especifica
      if (especialidad) {
        where.especialidad = especialidad;
      }

      // Incluir dictados si se solicita
      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno'],
            },
            {
              model: Materia,
              as: 'materia',
              attributes: ['id', 'nombre', 'descripcion'],
            }
          ],
        });
      }

      const docentes = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      });

      return docentes;
    } catch (error) {
      throw new Error('Error al obtener todos los docentes: ' + error.message);
    }
  }

  // Obtener alumnos por curso
  static async findAlumnosByCurso(cursoId) {
    try {
      const alumnos = await Persona.findAll({
        where: {
          tipo: 'alumno',
          cursoId: cursoId
        },
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno']
        }],
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      });
      return alumnos;
    } catch (error) {
      throw new Error('Error al obtener alumnos por curso: ' + error.message);
    }
  }

  // Método para obtener materias por alumno
  static async getMateriasByAlumnoDni(dni) {
    try {
      // Busca el alumno por DNI
      const alumno = await Persona.findByPk(dni, {
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno']
        }]
      });

      if (!alumno || !alumno.cursoId) return [];

      // Busca los dictados del curso del alumno
      const dictados = await Dictado.findAll({
        where: { cursoId: alumno.cursoId },
        include: [{
          model: Materia,
          as: 'materia',
          attributes: ['id', 'nombre', 'descripcion']
        }],
      });

      // Extrae materias únicas
      const materias = dictados
        .map((d) => d.materia)
        .filter((m, i, arr) => m && arr.findIndex((x) => x.id === m.id) === i);

      return materias;
    } catch (error) {
      throw new Error('Error al obtener materias por DNI de alumno: ' + error.message);
    }
  }

  // ========================= UPDATE =========================

  // Actualizar una persona
  static async updatePersona(dni, personaData) {
    try {
      const [updatedRows] = await Persona.update(personaData, {
        where: { dni: dni },
      });

      if (updatedRows > 0) {
        return await Persona.findByPk(dni);
      }
      return null;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una persona con ese DNI o email.');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(
          'Error de validación: ' +
          error.errors.map((e) => e.message).join(', ')
        );
      }
      throw new Error('Error al actualizar persona: ' + error.message);
    }
  }

  // ========================= DELETE =========================

  // Eliminar una persona
  static async deletePersona(dni) {
    try {
      const persona = await Persona.findByPk(dni);
      if (!persona) {
        return false;
      }

      // Si es docente, remover relaciones con dictados
      if (persona.tipo === 'docente') {
        await persona.setDictados([]);
      }

      const deletedRows = await Persona.destroy({
        where: { dni: dni },
      });

      return deletedRows > 0;
    } catch (error) {
      throw new Error('Error al eliminar persona: ' + error.message);
    }
  }
}

// IMPORTANTE: Exportar la clase, no una instancia
module.exports = PersonaService;