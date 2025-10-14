const Joi = require('joi');
const {
  DICTADO_ANIO,
  DICTADO_DIAS_CURSADO,
  DICTADO_CURSO_ID,
  DICTADO_MATERIA_ID,
  DICTADO_DOCENTE_ID,
  DICTADO_ID,
  IDS_ARRAY,
} = require('./dictado.definitions');

// ========================= CREATE SCHEMA =========================

const createDictadoSchema = Joi.object({
  anio: Joi.number()
    .integer()
    .min(DICTADO_ANIO.MIN)
    .max(DICTADO_ANIO.MAX)
    .required()
    .messages({
      'number.base': 'El año debe ser un número',
      'number.integer': 'El año debe ser un número entero',
      'number.min': `El año debe ser mayor o igual a ${DICTADO_ANIO.MIN}`,
      'number.max': `El año debe ser menor o igual a ${DICTADO_ANIO.MAX}`,
      'any.required': 'El año es obligatorio',
    }),
  dias_cursado: Joi.string()
    .min(DICTADO_DIAS_CURSADO.MIN)
    .max(DICTADO_DIAS_CURSADO.MAX)
    .required()
    .trim()
    .messages({
      'string.base': 'Los días de cursado deben ser un texto',
      'string.empty': 'Los días de cursado no pueden estar vacíos',
      'string.min': `Los días de cursado deben tener al menos ${DICTADO_DIAS_CURSADO.MIN} caracteres`,
      'string.max': `Los días de cursado no pueden exceder los ${DICTADO_DIAS_CURSADO.MAX} caracteres`,
      'any.required': 'Los días de cursado son obligatorios',
    }),
  cursoId: Joi.number()
    .integer()
    .min(DICTADO_CURSO_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID del curso debe ser un número',
      'number.integer': 'El ID del curso debe ser un número entero',
      'number.min': 'El ID del curso debe ser mayor a 0',
      'any.required': 'El ID del curso es obligatorio',
    }),
  materiaId: Joi.number()
    .integer()
    .min(DICTADO_MATERIA_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID de la materia debe ser un número',
      'number.integer': 'El ID de la materia debe ser un número entero',
      'number.min': 'El ID de la materia debe ser mayor a 0',
      'any.required': 'El ID de la materia es obligatorio',
    }),
  docenteId: Joi.number()
    .integer()
    .min(DICTADO_DOCENTE_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID del docente debe ser un número',
      'number.integer': 'El ID del docente debe ser un número entero',
      'number.min': 'El ID del docente debe ser mayor a 0',
      'any.required': 'El ID del docente es obligatorio',
    }),
  // Arrays opcionales para crear con relaciones múltiples
  docentesIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(IDS_ARRAY.MIN_ITEMS)
    .messages({
      'array.base': 'Los IDs de docentes deben ser un array',
      'array.min': 'Debe proporcionar al menos un ID de docente',
      'number.base': 'Cada ID de docente debe ser un número',
      'number.integer': 'Cada ID de docente debe ser un número entero',
    }),
  materiasIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(IDS_ARRAY.MIN_ITEMS)
    .messages({
      'array.base': 'Los IDs de materias deben ser un array',
      'array.min': 'Debe proporcionar al menos un ID de materia',
      'number.base': 'Cada ID de materia debe ser un número',
      'number.integer': 'Cada ID de materia debe ser un número entero',
    }),
});

// ========================= UPDATE SCHEMA =========================

const updateDictadoSchema = Joi.object({
  anio: Joi.number()
    .integer()
    .min(DICTADO_ANIO.MIN)
    .max(DICTADO_ANIO.MAX)
    .messages({
      'number.base': 'El año debe ser un número',
      'number.integer': 'El año debe ser un número entero',
      'number.min': `El año debe ser mayor o igual a ${DICTADO_ANIO.MIN}`,
      'number.max': `El año debe ser menor o igual a ${DICTADO_ANIO.MAX}`,
    }),
  dias_cursado: Joi.string()
    .min(DICTADO_DIAS_CURSADO.MIN)
    .max(DICTADO_DIAS_CURSADO.MAX)
    .trim()
    .messages({
      'string.base': 'Los días de cursado deben ser un texto',
      'string.empty': 'Los días de cursado no pueden estar vacíos',
      'string.min': `Los días de cursado deben tener al menos ${DICTADO_DIAS_CURSADO.MIN} caracteres`,
      'string.max': `Los días de cursado no pueden exceder los ${DICTADO_DIAS_CURSADO.MAX} caracteres`,
    }),
  cursoId: Joi.number().integer().min(DICTADO_CURSO_ID.MIN).messages({
    'number.base': 'El ID del curso debe ser un número',
    'number.integer': 'El ID del curso debe ser un número entero',
    'number.min': 'El ID del curso debe ser mayor a 0',
  }),
  materiaId: Joi.number().integer().min(DICTADO_MATERIA_ID.MIN).messages({
    'number.base': 'El ID de la materia debe ser un número',
    'number.integer': 'El ID de la materia debe ser un número entero',
    'number.min': 'El ID de la materia debe ser mayor a 0',
  }),
  docenteId: Joi.number().integer().min(DICTADO_DOCENTE_ID.MIN).messages({
    'number.base': 'El ID del docente debe ser un número',
    'number.integer': 'El ID del docente debe ser un número entero',
    'number.min': 'El ID del docente debe ser mayor a 0',
  }),
  // Arrays opcionales para actualizar relaciones
  docentesIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(IDS_ARRAY.MIN_ITEMS)
    .messages({
      'array.base': 'Los IDs de docentes deben ser un array',
      'array.min': 'Debe proporcionar al menos un ID de docente',
    }),
  materiasIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(IDS_ARRAY.MIN_ITEMS)
    .messages({
      'array.base': 'Los IDs de materias deben ser un array',
      'array.min': 'Debe proporcionar al menos un ID de materia',
    }),
})
  .min(1)
  .messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar',
  });

// ========================= ID PARAM SCHEMAS =========================

const idParamSchema = Joi.object({
  id: Joi.number().integer().min(DICTADO_ID.MIN).required().messages({
    'number.base': 'El ID debe ser un número',
    'number.integer': 'El ID debe ser un número entero',
    'number.min': 'El ID debe ser mayor a 0',
    'any.required': 'El ID es obligatorio',
  }),
});

const cursoIdParamSchema = Joi.object({
  cursoId: Joi.number()
    .integer()
    .min(DICTADO_CURSO_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID del curso debe ser un número',
      'number.integer': 'El ID del curso debe ser un número entero',
      'number.min': 'El ID del curso debe ser mayor a 0',
      'any.required': 'El ID del curso es obligatorio',
    }),
});

const personaIdParamSchema = Joi.object({
  personaId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID de la persona debe ser un número',
    'number.integer': 'El ID de la persona debe ser un número entero',
    'number.min': 'El ID de la persona debe ser mayor a 0',
    'any.required': 'El ID de la persona es obligatorio',
  }),
});

const materiaIdParamSchema = Joi.object({
  materiaId: Joi.number()
    .integer()
    .min(DICTADO_MATERIA_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID de la materia debe ser un número',
      'number.integer': 'El ID de la materia debe ser un número entero',
      'number.min': 'El ID de la materia debe ser mayor a 0',
      'any.required': 'El ID de la materia es obligatorio',
    }),
});

// Schema para rutas con dos parámetros (agregar/remover relaciones)
const dictadoDocenteParamSchema = Joi.object({
  dictadoId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID del dictado debe ser un número',
    'number.integer': 'El ID del dictado debe ser un número entero',
    'number.min': 'El ID del dictado debe ser mayor a 0',
    'any.required': 'El ID del dictado es obligatorio',
  }),
  docenteId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID del docente debe ser un número',
    'number.integer': 'El ID del docente debe ser un número entero',
    'number.min': 'El ID del docente debe ser mayor a 0',
    'any.required': 'El ID del docente es obligatorio',
  }),
});

const dictadoMateriaParamSchema = Joi.object({
  dictadoId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID del dictado debe ser un número',
    'number.integer': 'El ID del dictado debe ser un número entero',
    'number.min': 'El ID del dictado debe ser mayor a 0',
    'any.required': 'El ID del dictado es obligatorio',
  }),
  materiaId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID de la materia debe ser un número',
    'number.integer': 'El ID de la materia debe ser un número entero',
    'number.min': 'El ID de la materia debe ser mayor a 0',
    'any.required': 'El ID de la materia es obligatorio',
  }),
});

// ========================= QUERY SCHEMA =========================

const queryCursoMateriaSchema = Joi.object({
  cursoId: Joi.number()
    .integer()
    .min(DICTADO_CURSO_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID del curso debe ser un número',
      'number.integer': 'El ID del curso debe ser un número entero',
      'number.min': 'El ID del curso debe ser mayor a 0',
      'any.required': 'El ID del curso es obligatorio',
    }),
  materiaId: Joi.number()
    .integer()
    .min(DICTADO_MATERIA_ID.MIN)
    .required()
    .messages({
      'number.base': 'El ID de la materia debe ser un número',
      'number.integer': 'El ID de la materia debe ser un número entero',
      'number.min': 'El ID de la materia debe ser mayor a 0',
      'any.required': 'El ID de la materia es obligatorio',
    }),
});

module.exports = {
  createDictadoSchema,
  updateDictadoSchema,
  idParamSchema,
  cursoIdParamSchema,
  personaIdParamSchema,
  materiaIdParamSchema,
  dictadoDocenteParamSchema,
  dictadoMateriaParamSchema,
  queryCursoMateriaSchema,
};