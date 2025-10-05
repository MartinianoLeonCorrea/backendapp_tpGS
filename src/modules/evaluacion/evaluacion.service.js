const { Op } = require('sequelize');
const Evaluacion = require('./evaluacion.model');
const Examen = require('../examen/examen.model');
const Persona = require('../persona/persona.model');

class EvaluacionService {
  // ========================== CREATE ==========================
  // Crear una nueva evaluación
  async createEvaluacion(evaluacionData) {
    return await Evaluacion.create(evaluacionData);
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

  // Contar evaluaciones con filtros opcionales
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

  // Obtener evaluación por examen y alumno
  async findEvaluacionByExamenAndAlumno(examenId, alumnoId) {
    return await Evaluacion.findOne({
      where: { examenId, alumnoId },
    });
  }

  // ========================== UPDATE ==========================
  // Actualizar una evaluación
  async updateEvaluacion(id, updateData) {
    const [updatedRowsCount] = await Evaluacion.update(updateData, {
      where: { id },
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return await this.findEvaluacionById(id);
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
