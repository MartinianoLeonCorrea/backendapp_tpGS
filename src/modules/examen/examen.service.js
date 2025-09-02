// src/services/examen.service.js
const Persona = require('../persona/persona.model');
const Examen = require('../examen/examen.model');
const Materia = require('../materia/materia.model');
const Dictado = require('../dictado/dictado.model');

class ExamenService {
  // Función para obtener todos los exámenes con sus relaciones
  async getAllExamenes() {
    return await Examen.findAll({
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
            {
              model: Persona,
              as: 'docente',
              attributes: ['nombre', 'apellido'],
            },
          ],
        },
      ],
    });
  }

  // Función para obtener un examen por ID
  async getExamenById(id) {
    return await Examen.findByPk(id, {
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['dni', 'nombre'] },
          ],
        },
        {
          model: Persona,
          as: 'docente',
          attributes: ['nombre', 'apellido'],
        },
      ],
    });
  }

  // Función para crear un nuevo examen
  async createExamen(examenData) {
    const newExamen = await Examen.create(examenData);
    return this.getExamenById(newExamen.id);
  }

  // Función para actualizar un examen
  async updateExamen(id, updateData) {
    const examen = await Examen.findByPk(id);
    if (!examen) return null;
    await examen.update(updateData);
    return this.getExamenById(id);
  }

  // Función para eliminar un examen
  async deleteExamen(id) {
    const examen = await Examen.findByPk(id);
    if (!examen) return null;
    await examen.destroy();
    return examen;
  }

  // Funciones para búsquedas por relaciones
  async getExamenesByMateria(materiaId) {
    //Busco los dictados de la materia
    const dictados = await Dictado.findAll({
      where: { materiaId },
      attributes: ['id'],
    });
    const dictadoIds = dictados.map((d) => d.id);
    return await Examen.findAll({
      where: { dictadoId: dictadoIds.length > 0 ? dictadoIds : null },
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
          ],
        },
        {
          model: Persona,
          as: 'docente',
          attributes: ['nombre', 'apellido'],
        },
      ],
    });
  }

  // ========================= HELPER FUNCTIONS ===========================

  // Función para construir una respuesta de éxito estandarizada
  _successResponse(message, data) {
    return {
      success: true,
      message,
      data,
    };
  }

  // Función para construir una respuesta de error estandarizada
  _errorResponse(message, errors = []) {
    return {
      success: false,
      message,
      errors,
    };
  }
}

module.exports = new ExamenService();
