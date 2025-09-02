//Lógica de negocio para la entidad Dictado
const { Op } = require('sequelize');
const Persona = require('../persona/persona.model');
const Curso = require('../curso/curso.model');
const Materia = require('../materia/materia.model');
const Dictado = require('../dictado/dictado.model');
const Examen = require('../examen/examen.model');

class DictadoService {
  // ========================== CREATE ==========================
  // Crear un nuevo dictado
  async createDictado(dictadoData) {
    const dictado = await Dictado.create(dictadoData);
    return dictado;
  }

  // ========================== READ ============================
  // Obtener todos los dictados
  async getAllDictados() {
    return await Dictado.findAll({
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictado por ID
  async getDictadoById(id) {
    return await Dictado.findByPk(id, {
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictados por curso
  async getDictadosByCurso(cursoId) {
    return await Dictado.findAll({
      where: { cursoId },
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictados de un docente específico
  async getDictadosByPersona(docenteId) {
    return await Dictado.findAll({
      where: { docenteId },
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictados activos de una persona
  async getDictadosActivosByPersona(id) {
    const now = new Date();
    return await Dictado.findAll({
      where: {
        docenteId: id,
        fecha_desde: { [Op.lte]: now },
        fecha_hasta: { [Op.gte]: now },
      },
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictados activos
  async getDictadosActivos() {
    const now = new Date();
    return await Dictado.findAll({
      where: {
        fecha_desde: { [Op.lte]: now },
        fecha_hasta: { [Op.gte]: now },
      },
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // Obtener dictados por materia
  async getDictadosByMateria(materiaId) {
    return await Dictado.findAll({
      where: { materiaId },
      include: [
        { model: Curso, as: 'curso' },
        { model: Materia, as: 'materia' },
        { model: Persona, as: 'docente' },
        { model: Examen, as: 'examenes' },
      ],
    });
  }

  // ========================== UPDATE ==========================
  // Actualizar dictado básico
  async updateDictado(id, updateData) {
    const [updatedRowsCount] = await Dictado.update(updateData, {
      where: { id: id },
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return await getDictadoById(id);
  }

  // ========================= DELETE =========================
  // Eliminar dictado por ID
  async deleteDictado(id) {
    const dictado = await Dictado.findByPk(id);
    if (!dictado) return null;
    await dictado.destroy();
    return dictado;
  }

  // Eliminar dictados por curso
  async deleteDictadosByCurso(cursoId) {
    const dictados = await getDictadosByCurso(cursoId);

    const deletedCount = await Dictado.destroy({
      where: { curso_id: cursoId },
    });

    return { deletedCount, deletedDictados: dictados };
  }
}
module.exports = new DictadoService();
