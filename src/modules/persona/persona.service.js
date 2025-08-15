const { Op } = require('../db/sequelize');
const { Persona } = require('./persona.model');
const { Dictado } = require('../dictado/dictado.model');
const { Curso } = require('../curso/curso.model');
const { Materia } = require('../materia/materia.model');

class PersonaService {
  async getAll() {
    return await Persona.findAll();
  }

  async getById(id) {
    return await Persona.findByPk(id);
  }

  async create(data) {
    return await Persona.create(data);
  }

  async update(id, data) {
    const persona = await Persona.findByPk(id);
    if (!persona) return null;
    await persona.update(data);
    return persona;
  }

  async delete(id) {
    const persona = await Persona.findByPk(id);
    if (!persona) return null;
    await persona.destroy();
    return persona;
  }

  async searchByName(name) {
    return await Persona.findAll({
      where: {
        nombre: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  // Obtener persona por ID con relaciones incluidas
  async getByIdWithRelations(id) {
    return await Persona.findByPk(id, {
      include: [
        { model: Curso, as: 'curso' },
        {
          model: Dictado,
          as: 'dictados',
          through: { attributes: [] },
          include: [
            { model: Curso, as: 'curso' },
            { model: Materia, as: 'materias', through: { attributes: [] } },
          ],
        },
      ],
    });
  }

  // Obtener solo docentes
  async getDocentes() {
    return await Persona.findAll({
      where: {
        tipo: 'docente', // ajusta este campo según tu modelo
      },
      include: [
        { model: Curso, as: 'curso' },
        { model: Dictado, as: 'dictados', through: { attributes: [] } },
      ],
    });
  }

  // Obtener solo alumnos
  async getAlumnos() {
    return await Persona.findAll({
      where: {
        tipo: 'alumno', // ajusta este campo según tu modelo
      },
      include: [{ model: Curso, as: 'curso' }],
    });
  }

  // Obtener personas por curso
  async getByCurso(cursoId) {
    return await Persona.findAll({
      where: {
        cursoId: cursoId,
      },
      include: [
        { model: Curso, as: 'curso' },
        { model: Dictado, as: 'dictados', through: { attributes: [] } },
      ],
    });
  }

  // Asignar un dictado a una persona (docente)
  async addDictadoToPersona(personaId, dictadoId) {
    const persona = await Persona.findByPk(personaId);
    const dictado = await Dictado.findByPk(dictadoId);

    if (!persona || !dictado) {
      throw new Error('Persona o Dictado no encontrado');
    }

    await persona.addDictado(dictado);
    return true;
  }

  // Remover un dictado de una persona
  async removeDictadoFromPersona(personaId, dictadoId) {
    const persona = await Persona.findByPk(personaId);
    const dictado = await Dictado.findByPk(dictadoId);

    if (!persona || !dictado) {
      throw new Error('Persona o Dictado no encontrado');
    }

    await persona.removeDictado(dictado);
    return true;
  }

  // Obtener docentes por dictado específico
  async getDocentesByDictado(dictadoId) {
    return await Persona.findAll({
      include: [
        {
          model: Dictado,
          as: 'dictados',
          where: { id: dictadoId },
          through: { attributes: [] },
        },
      ],
    });
  }

  // Buscar docentes por materia
  async getDocentesByMateria(materiaId) {
    return await Persona.findAll({
      include: [
        {
          model: Dictado,
          as: 'dictados',
          through: { attributes: [] },
          include: [
            {
              model: Materia,
              as: 'materias',
              where: { id: materiaId },
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  // Buscar personas por tipo y con filtros adicionales
  async getByTipo(tipo, options = {}) {
    const where = { tipo };
    const include = [{ model: Curso, as: 'curso' }];

    // Si se solicita incluir dictados
    if (options.includeDictados) {
      include.push({
        model: Dictado,
        as: 'dictados',
        through: { attributes: [] },
        include: [
          { model: Curso, as: 'curso' },
          { model: Materia, as: 'materias', through: { attributes: [] } },
        ],
      });
    }

    // Filtrar por curso si se especifica
    if (options.cursoId) {
      where.cursoId = options.cursoId;
    }

    return await Persona.findAll({
      where,
      include,
    });
  }

  // Verificar si una persona está asignada a un dictado específico
  async isPersonaInDictado(personaId, dictadoId) {
    const persona = await Persona.findByPk(personaId);
    if (!persona) return false;

    const dictado = await Dictado.findByPk(dictadoId);
    if (!dictado) return false;

    return await persona.hasDictado(dictado);
  }

  // Obtener estadísticas generales de personas
  async getEstadisticas() {
    const totalPersonas = await Persona.count();
    const totalDocentes = await Persona.count({ where: { tipo: 'docente' } });
    const totalAlumnos = await Persona.count({ where: { tipo: 'alumno' } });

    return {
      totalPersonas,
      totalDocentes,
      totalAlumnos,
      otros: totalPersonas - totalDocentes - totalAlumnos,
    };
  }

  // Obtener una persona por ID, incluyendo su curso y dictados
  async findPersonaById(Id) {
    return await Persona.findByPk(id, {
      include: [
        { model: Curso, as: 'curso' },
        { model: Dictado, as: 'dictados', through: { attributes: [] } },
      ],
    });
  }

  // Crear una persona (puedes asignar cursoId si es alumno)
  async createPersona(personaData) {
    return await Persona.create(personaData);
  }
}

module.exports = new PersonaService();
