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
    try {
      const examen = await Examen.findByPk(id, {
        include: [
          {
            model: Dictado,
            as: 'dictado',
            attributes: ['id', 'dias_cursado', 'materiaId'],
            include: [
              { model: Materia, as: 'materia', attributes: ['nombre'] },
              {
                model: Persona,
                as: 'docente',
                attributes: ['nombre', 'apellido'],
              },
            ],
          },
        ],
      });
      return examen;
    } catch (error) {
      throw error;
    }
  }

  // Función para crear un nuevo examen
  async createExamen(examenData) {
    // Verificar que el dictadoId exista
    const dictado = await Dictado.findByPk(examenData.dictadoId);
    if (!dictado) {
      throw new Error(`El dictado con ID ${examenData.dictadoId} no existe.`);
    }

    const newExamen = await Examen.create(examenData);
    return this.getExamenById(newExamen.id);
  }

  // Función para actualizar un examen
  async updateExamen(id, updateData) {
    const examen = await Examen.findByPk(id);
    if (!examen) {
      return null;
    }

    // Verificar que el dictadoId exista si se está actualizando
    if (updateData.dictadoId) {
      const dictado = await Dictado.findByPk(updateData.dictadoId);
      if (!dictado) {
        throw new Error(`El dictado con ID ${updateData.dictadoId} no existe.`);
      }
    }

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
    // Buscar dictados de la materia
    const dictados = await Dictado.findAll({
      where: { materiaId },
      attributes: ['id'],
    });
    const dictadoIds = dictados.map((d) => d.id);

    console.log('Dictado IDs:', dictadoIds);
    if (!dictadoIds.length) {
      return [];
    }
    const examenes = await Examen.findAll({
      where: { dictadoId: dictadoIds },
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId', 'docenteId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
            {
              model: Persona,
              as: 'docente',
              attributes: ['id', 'nombre', 'apellido'],
            },
          ],
        },
      ],
    });
    console.log('Examenes encontrados:', examenes);
    return examenes;
  }
  async getExamenesByDictadoId(dictadoId) {
    try {
      return await Examen.findAll({
        where: { dictadoId },
        include: [
          {
            model: Dictado,
            as: 'dictado',
            attributes: ['id', 'dias_cursado', 'materiaId', 'docenteId'],
            include: [
              { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
              {
                model: Persona,
                as: 'docente',
                attributes: ['dni', 'nombre', 'apellido'],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error en getExamenesByDictadoId:', error);
      return [];
    }
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
