const Joi = require('joi');
const { NRO_LETRA, TURNO } = require('./curso.definitions');

const createCursoSchema = Joi.object({
  nro_letra: Joi.string()
    .min(NRO_LETRA.min)
    .max(NRO_LETRA.max)
    .required()
    .messages({
      'string.base': 'El nro y letra del curso debe ser un texto.',
      'string.empty': 'El nro y letra del curso no pueden estar vacíos.',
      'string.min': `El nro y letra debe tener al menos ${NRO_LETRA.min} caracteres.`,
      'string.max': `El nro y letra debe tener máximo ${NRO_LETRA.max} caracteres.`,
      'any.required': 'El campo nro_letra es obligatorio.',
    }),
  turno: Joi.string()
    .valid(...TURNO.validValues)
    .required()
    .messages({
      'string.base': 'El turno debe ser un texto.',
      'any.only': `El turno debe ser uno de los siguientes: ${TURNO.validValues.join(', ')}.`,
      'any.required': 'El campo turno es obligatorio.',
    }),
});

const updateCursoSchema = Joi.object({
  nro_letra: Joi.string()
    .min(NRO_LETRA.min)
    .max(NRO_LETRA.max)
    .optional()
    .messages({
      'string.base': 'El nro y letra del curso debe ser un texto.',
      'string.empty': 'El nro y letra del curso no pueden estar vacíos.',
      'string.min': `El nro y letra debe tener al menos ${NRO_LETRA.min} caracteres.`,
      'string.max': `El nro y letra debe tener máximo ${NRO_LETRA.max} caracteres.`,
    }),
  turno: Joi.string()
    .valid(...TURNO.validValues)
    .optional()
    .messages({
      'string.base': 'El turno debe ser un texto.',
      'any.only': `El turno debe ser uno de los siguientes: ${TURNO.validValues.join(', ')}.`,
    }),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar.',
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID debe ser un número.',
    'number.integer': 'El ID debe ser un número entero.',
    'number.positive': 'El ID debe ser un número positivo.',
    'any.required': 'El ID es obligatorio.',
  }),
});

const getCursoQuerySchema = Joi.object({
  includeAlumnos: Joi.string().valid('true', 'false').optional(),
  includeDictados: Joi.string().valid('true', 'false').optional(),
}).unknown(true); 

module.exports = {
  createCursoSchema,
  updateCursoSchema,
  idParamSchema,
  getCursoQuerySchema,
};