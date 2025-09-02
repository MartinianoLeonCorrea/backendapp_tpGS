const { Op } = require('sequelize');
const Persona = require('./persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('../dictado/dictado.model');
const Materia = require('../materia/materia.model');

class PersonaService {
  // ========================= CREATE =========================
  static async createPersona(personaData) {
    try {
      // Solo crea la persona y asocia el curso por cursoId si es alumno
      const persona = await Persona.create(personaData);
      return persona;
    } catch (error) {
      throw new Error('Error al crear persona: ' + error.message);
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
          through: { attributes: [] },
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
        });
      }

      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          through: { attributes: [] },
          include: [
            {
              model: Curso,
              as: 'curso',
            },
            {
              model: Materia,
              as: 'materias',
              through: { attributes: [] },
            },
          ],
        });
      }

      const persona = await Persona.findByPk(dni, { include });
      return persona;
    } catch (error) {
      throw new Error('Error al obtener persona por DNI: ' + error.message);
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

      if (persona.tipo === 'Docente') {
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

module.exports = new PersonaService();
