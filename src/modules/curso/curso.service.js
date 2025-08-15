//Lógica de negocio para la entidad Curso

const Curso = require('./curso.model');

// Encontrar todos los cursos
const findAllCursos = async () => {
  try {
    const cursos = await Curso.findAll();
    return cursos;
  } catch (error) {
    throw new Error('Error al obtener todos los cursos: ' + error.message);
  }
};

// Encontrar un curso por ID
const findCursoById = async (id) => {
  try {
    const curso = await Curso.findByPk(id);
    return curso;
  } catch (error) {
    throw new Error('Error al obtener curso por ID: ' + error.message);
  }
};

// Crear un nuevo curso
const createCurso = async (cursoData) => {
  try {
    const newCurso = await Curso.create(cursoData);
    return newCurso;
  } catch (error) {
    // Manejo de errores específicos de Sequelize, por ejemplo, validación
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
};

// Actualizar un curso
const updateCurso = async (id, cursoData) => {
  try {
    const [updatedRows] = await Curso.update(cursoData, {
      where: { id: id },
    });
    if (updatedRows > 0) {
      return Curso.findByPk(id); // Retorna el curso actualizado
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
};

// Eliminar un curso
const deleteCurso = async (id) => {
  try {
    const deletedRows = await Curso.destroy({
      where: { id: id },
    });
    return deletedRows > 0; // Retorna true si se eliminó al menos un curso
  } catch (error) {
    throw new Error('Error al eliminar curso: ' + error.message);
  }
};

const buscarCursosPorPersona = async (personaId) => {
  try {
    const persona = await Persona.findByPk(personaId, {
      include: [{ model: Curso, as: 'cursos' }],
    });
    return persona ? persona.cursos : [];
  } catch (error) {
    throw new Error('Error al buscar cursos por persona: ' + error.message);
  }
};

module.exports = {
  findAllCursos,
  findCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
  buscarCursosPorPersona,
};
