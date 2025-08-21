const Curso = require('./curso.model');
const Persona = require('../persona/persona.model');
const Dictado = require('../dictado/dictado.model');

class CursoService {

  // ========================= CREATE =========================

  // Crear un nuevo curso

  static async createCurso(cursoData) {
    try {
      const newCurso = await Curso.create(cursoData);
      return newCurso;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe un curso con ese año y letra.');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(
          'Error de validación: ' + error.errors.map((e) => e.message).join(', ')
        );
      }
      throw new Error('Error al crear curso: ' + error.message);
    }
  }

  // ========================= READ ===========================

  // Obtener todos los cursos

  static async findAllCursos(options = {}) {
    try {
      const { includeAlumnos = false, includeDictado = false } = options;
      const include = [];

      if (includeAlumnos) {
        include.push({
          model: Persona,
          as: 'alumnos',
          attributes: ['dni', 'nombre', 'apellido', 'email']
        });
      }

      if (includeDictado) {
        include.push({
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado']
        });
      }

      const cursos = await Curso.findAll({
        include,
        order: [['anio_letra', 'ASC']]
      });
      return cursos;
    } catch (error) {
      throw new Error('Error al obtener todos los cursos: ' + error.message);
    }
  }

  // Encontrar un curso por ID

  static async findCursoById(id, options = {}) {
    try {
      const { includeAlumnos = false, includeDictado = false } = options;
      const include = [];

      if (includeAlumnos) {
        include.push({
          model: Persona,
          as: 'alumnos',
          attributes: ['dni', 'nombre', 'apellido', 'email', 'telefono']
        });
      }

      if (includeDictado) {
        include.push({
          model: Dictado,
          as: 'dictado'
        });
      }

      const curso = await Curso.findByPk(id, { include });
      return curso;
    } catch (error) {
      throw new Error('Error al obtener curso por ID: ' + error.message);
    }
  }

  // Buscar cursos por turno

  static async findCursosByTurno(turno) {
    try {
      const cursos = await Curso.findAll({
        where: { turno },
        order: [['anio_letra', 'ASC']]
      });
      return cursos;
    } catch (error) {
      throw new Error('Error al buscar cursos por turno: ' + error.message);
    }
  }

  // ========================= UPDATE =========================
  
  // Actualizar un curso

  static async updateCurso(id, cursoData) {
    try {
      const [updatedRows] = await Curso.update(cursoData, {
        where: { id: id },
      });
      
      if (updatedRows > 0) {
        return await Curso.findByPk(id); // Retorna el curso actualizado
      }
      return null; // Si no se encontró el curso
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe un curso con ese año y letra.');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(
          'Error de validación: ' + error.errors.map((e) => e.message).join(', ')
        );
      }
      throw new Error('Error al actualizar curso: ' + error.message);
    }
  }

  // ========================= DELETE =========================
  
  // Eliminar un curso

  static async deleteCurso(id) {
    try {

      // Verificar si hay alumnos asignados

      const alumnosCount = await Persona.count({
        where: { cursoId: id, tipoCodigo: 'Alumno' }
      });

      if (alumnosCount > 0) {
        throw new Error('No se puede eliminar el curso porque tiene alumnos asignados.');
      }

      const deletedRows = await Curso.destroy({
        where: { id: id },
      });
      
      return deletedRows > 0; // Retorna true si se eliminó al menos un curso
    } catch (error) {
      throw new Error('Error al eliminar curso: ' + error.message);
    }
  }
}

module.exports = CursoService;
