const { Op } = require('sequelize');
const Evaluacion = require('./evaluacion.model');
const Examen = require('../examen/examen.model');
const Persona = require('../persona/persona.model');
const Dictado = require('../dictado/dictado.model'); // Importar el modelo Dictado
const Materia = require('../materia/materia.model'); // Importar el modelo Materia

class EvaluacionService {
  // ========================== CREATE ==========================
  // Crear una nueva evaluación
  async createEvaluacion(evaluacionData) {
    try {
      return await Evaluacion.create(evaluacionData);
    } catch (error) {
      throw new Error('Error al crear la evaluación');
    }
  }

  // Crear múltiples evaluaciones en batch
  async createBatchEvaluaciones(evaluaciones) {
    try {
      return await Evaluacion.bulkCreate(evaluaciones, { validate: true });
    } catch (error) {
      throw new Error('Error al crear evaluaciones en batch');
    }
  }

  // ========================== READ ============================
  // Obtener todas las evaluaciones con filtros opcionales
  async findAllEvaluaciones({ examenId, alumnoDni, dictadoId, page, limit }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (examenId) where.examenId = examenId;
    if (alumnoDni) where.alumnoId = alumnoDni;
    if (dictadoId) where['$examen.dictadoId$'] = dictadoId;

    return await Evaluacion.findAll({
      where,
      include: [
        { model: Examen, as: 'examen' },
        { model: Persona, as: 'alumno' },
      ],
      offset,
      limit,
    });
  }

  // Contar evaluaciones with optional filters
  async countEvaluaciones({ examenId, alumnoDni, dictadoId }) {
    const where = {};

    if (examenId) where.examenId = examenId;
    if (alumnoDni) where.alumnoId = alumnoDni;
    if (dictadoId) where['$examen.dictadoId$'] = dictadoId;

    return await Evaluacion.count({
      where,
      include: [{ model: Examen, as: 'examen' }],
    });
  }

  // Obtener una evaluación por ID
  async findEvaluacionById(
    id,
    { includeExamen = false, includeAlumno = false } = {}
  ) {
    const include = [];
    if (includeExamen) include.push({ model: Examen, as: 'examen' });
    if (includeAlumno) include.push({ model: Persona, as: 'alumno' });

    return await Evaluacion.findByPk(id, { include });
  }
  // Obtener evaluaciones por examenId
  async findEvaluacionesByExamen(examenId) {
    return await Evaluacion.findAll({
      where: { examenId },
      include: [
        { model: Examen, as: 'examen' },
        { model: Persona, as: 'alumno' },
      ],
    });
  }
  // Obtener evaluaciones por alumnoId
  async findEvaluacionesByAlumno(alumnoId) {
    return await Evaluacion.findAll({
      where: { alumnoId },
      include: [
        {
          model: Examen,
          as: 'examen',
          include: [
            {
              model: Dictado,
              as: 'dictado',
              include: [{ model: Materia, as: 'materia' }],
            },
          ],
        },
        { model: Persona, as: 'alumno' },
      ],
    });
  }

  // Obtener evaluación por examen y alumno
  async findEvaluacionByExamenAndAlumno(examenId, alumnoId) {
    return await Evaluacion.findOne({
      where: { examenId, alumnoId },
    });
  }

  // ========================== UPDATE ==========================
  // Actualizar una evaluación
  async updateEvaluacion(id, updateData) {
    try {
      const [updatedRowsCount] = await Evaluacion.update(updateData, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      return await this.findEvaluacionById(id);
    } catch (error) {
      throw new Error('Error al actualizar la evaluación');
    }
  }

  // Actualizar múltiples evaluaciones en batch
  async updateBatchEvaluaciones(evaluaciones) {
    try {
      const updatedEvaluaciones = [];

      for (const evaluacion of evaluaciones) {
        const { id, ...updateData } = evaluacion;
        const updated = await this.updateEvaluacion(id, updateData);
        if (updated) {
          updatedEvaluaciones.push(updated);
        }
      }

      return updatedEvaluaciones;
    } catch (error) {
      throw new Error('Error al actualizar evaluaciones en batch');
    }
  }

  // ========================== DELETE ==========================
  // Eliminar una evaluación por ID
  async deleteEvaluacion(id) {
    const evaluacion = await Evaluacion.findByPk(id);
    if (!evaluacion) return null;

    await evaluacion.destroy();
    return evaluacion;
  }
}

module.exports = new EvaluacionService();
