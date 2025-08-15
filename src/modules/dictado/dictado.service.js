//Lógica de negocio para la entidad Dictado
const { models, Op } = require('../db/sequelize');
const Persona = require('../persona/persona.model');
const Curso = require('../curso/curso.model');
const Materia = require('../materia/materia.model');
const Dictado = require('./dictado.model');

// ========== CREATE ==========
// Crear un nuevo dictado
const createDictado = async (dictadoData) => {
  const dictado = await Dictado.create(dictadoData);
  return dictado;
};

// Crear dictado con relaciones (docentes y materias)
const createDictadoWithRelations = async (
  dictadoData,
  docentesIds = [],
  materiasIds = []
) => {
  const dictado = await Dictado.create(dictadoData);

  // Asociar docentes si se proporcionan
  if (docentesIds.length > 0) {
    const docentes = await Persona.findAll({
      where: { id: docentesIds },
    });
    await dictado.setDocentes(docentes);
  }

  // Asociar materias si se proporcionan
  if (materiasIds.length > 0) {
    const materias = await Materia.findAll({
      where: { id: materiasIds },
    });
    await dictado.setMaterias(materias);
  }

  return dictado;
};

// ========== READ ==========
// Obtener todos los dictados
const getAllDictados = async () => {
  const dictados = await Dictado.findAll({
    include: [
      { model: Curso, as: 'curso' },
      { model: Materia, as: 'materias', through: { attributes: [] } },
      { model: Persona, as: 'docentes', through: { attributes: [] } },
    ],
  });
  return dictados;
};

// Obtener dictado por ID
const getDictadoById = async (id) => {
  const dictado = await Dictado.findByPk(id, {
    include: [
      { model: Curso, as: 'curso' },
      { model: Materia, as: 'materias', through: { attributes: [] } },
      { model: Persona, as: 'docentes', through: { attributes: [] } },
    ],
  });
  return dictado;
};

// Obtener dictados por curso
const getDictadosByCurso = async (cursoId) => {
  const dictados = await Dictado.findAll({
    where: { curso_id: cursoId },
    include: [
      { model: Curso, as: 'curso' },
      { model: Materia, as: 'materias', through: { attributes: [] } },
      { model: Persona, as: 'docentes', through: { attributes: [] } },
    ],
  });
  return dictados;
};

// Obtener dictados de una persona específica (corregido)
const getDictadosByPersona = async (id) => {
  const persona = await Persona.findByPk(id, {
    include: [
      {
        model: Dictado,
        as: 'dictados',
        through: { attributes: [] },
        include: [
          { model: Curso, as: 'curso' },
          { model: Materia, as: 'materias', through: { attributes: [] } },
          { model: Persona, as: 'docentes', through: { attributes: [] } },
        ],
      },
    ],
  });
  return persona ? persona.dictados : [];
};

// Obtener dictados activos de una persona (corregido)
const getDictadosActivosByPersona = async (id) => {
  const now = new Date();
  const persona = await Persona.findByPk(id, {
    include: [
      {
        model: Dictado,
        as: 'dictados',
        where: {
          fecha_desde: { [Op.lte]: now },
          fecha_hasta: { [Op.gte]: now },
        },
        through: { attributes: [] },
        include: [
          { model: Curso, as: 'curso' },
          { model: Materia, as: 'materias', through: { attributes: [] } },
        ],
      },
    ],
  });
  return persona ? persona.dictados : [];
};

// Obtener dictados activos
const getDictadosActivos = async () => {
  const now = new Date();
  const dictados = await Dictado.findAll({
    where: {
      fecha_desde: { [Op.lte]: now },
      fecha_hasta: { [Op.gte]: now },
    },
    include: [
      { model: Curso, as: 'curso' },
      { model: Materia, as: 'materias', through: { attributes: [] } },
      { model: Persona, as: 'docentes', through: { attributes: [] } },
    ],
  });
  return dictados;
};

// Obtener dictados por materia
const getDictadosByMateria = async (materiaId) => {
  const materia = await Materia.findByPk(materiaId, {
    include: [
      {
        model: Dictado,
        as: 'dictados',
        through: { attributes: [] },
        include: [
          { model: Curso, as: 'curso' },
          { model: Persona, as: 'docentes', through: { attributes: [] } },
        ],
      },
    ],
  });
  return materia ? materia.dictados : [];
};

// ========== UPDATE ==========
// Actualizar dictado básico
const updateDictado = async (id, updateData) => {
  const [updatedRowsCount] = await Dictado.update(updateData, {
    where: { id: id },
  });

  if (updatedRowsCount === 0) {
    return null;
  }

  return await getDictadoById(id);
};

// Actualizar dictado con relaciones
const updateDictadoWithRelations = async (
  id,
  updateData,
  docentesIds = null,
  materiasIds = null
) => {
  // Actualizar datos básicos
  const [updatedRowsCount] = await Dictado.update(updateData, {
    where: { id: id },
  });

  if (updatedRowsCount === 0) {
    return null;
  }

  const dictado = await Dictado.findByPk(id);

  // Actualizar docentes si se proporcionan
  if (docentesIds !== null) {
    if (docentesIds.length > 0) {
      const docentes = await Persona.findAll({
        where: { id: docentesIds },
      });
      await dictado.setDocentes(docentes);
    } else {
      await dictado.setDocentes([]);
    }
  }

  // Actualizar materias si se proporcionan
  if (materiasIds !== null) {
    if (materiasIds.length > 0) {
      const materias = await Materia.findAll({
        where: { id: materiasIds },
      });
      await dictado.setMaterias(materias);
    } else {
      await dictado.setMaterias([]);
    }
  }

  return await getDictadoById(id);
};

// Agregar docente a dictado
const addDocenteToDictado = async (dictadoId, docenteId) => {
  const dictado = await Dictado.findByPk(dictadoId);
  const docente = await Persona.findByPk(docenteId);

  if (!dictado || !docente) {
    return null;
  }

  await dictado.addDocente(docente);
  return await getDictadoById(dictadoId);
};

// Remover docente de dictado
const removeDocenteFromDictado = async (dictadoId, docenteId) => {
  const dictado = await Dictado.findByPk(dictadoId);
  const docente = await Persona.findByPk(docenteId);

  if (!dictado || !docente) {
    return null;
  }

  await dictado.removeDocente(docente);
  return await getDictadoById(dictadoId);
};

// Agregar materia a dictado
const addMateriaToDictado = async (dictadoId, materiaId) => {
  const dictado = await Dictado.findByPk(dictadoId);
  const materia = await Materia.findByPk(materiaId);

  if (!dictado || !materia) {
    return null;
  }

  await dictado.addMateria(materia);
  return await getDictadoById(dictadoId);
};

// Remover materia de dictado
const removeMateriaFromDictado = async (dictadoId, materiaId) => {
  const dictado = await Dictado.findByPk(dictadoId);
  const materia = await Materia.findByPk(materiaId);

  if (!dictado || !materia) {
    return null;
  }

  await dictado.removeMateria(materia);
  return await getDictadoById(dictadoId);
};

// ========== DELETE ==========
// Eliminar dictado por ID
const deleteDictado = async (id) => {
  const dictado = await Dictado.findByPk(id);

  if (!dictado) {
    return null;
  }

  // Sequelize automáticamente limpia las relaciones many-to-many
  await dictado.destroy();
  return dictado;
};

// Eliminar dictado con verificación de relaciones
const deleteDictadoSafe = async (id) => {
  const dictado = await getDictadoById(id);

  if (!dictado) {
    return null;
  }

  // Limpiar relaciones manualmente (opcional, Sequelize lo hace automáticamente)
  await dictado.setDocentes([]);
  await dictado.setMaterias([]);

  await dictado.destroy();
  return dictado;
};

// Eliminar dictados por curso
const deleteDictadosByCurso = async (cursoId) => {
  const dictados = await getDictadosByCurso(cursoId);

  const deletedCount = await Dictado.destroy({
    where: { curso_id: cursoId },
  });

  return { deletedCount, deletedDictados: dictados };
};

module.exports = {
  // CREATE
  createDictado,
  createDictadoWithRelations,

  // READ
  getAllDictados,
  getDictadoById,
  getDictadosByCurso,
  getDictadosByPersona,
  getDictadosActivosByPersona,
  getDictadosActivos,
  getDictadosByMateria,

  // UPDATE
  updateDictado,
  updateDictadoWithRelations,
  addDocenteToDictado,
  removeDocenteFromDictado,
  addMateriaToDictado,
  removeMateriaFromDictado,

  // DELETE
  deleteDictado,
  deleteDictadoSafe,
  deleteDictadosByCurso,
};
