const Joi = require('joi');
const {
  FECHA_EXAMEN,
  TEMAS,
  COPIAS,
  DICTADO_ID,
} = require('./examen.definitions');

const examenSchema = Joi.object({
  fecha_examen: Joi.date().required(FECHA_EXAMEN.required).messages({
    'date.base': 'La fecha del examen debe ser válida.',
    'any.required': 'La fecha del examen es obligatoria.',
  }),
  temas: Joi.string()
    .min(TEMAS.min)
    .max(TEMAS.max)
    .required()
    .messages({
      'string.empty': 'Los temas no pueden estar vacíos.',
      'string.min': `Los temas deben tener al menos ${TEMAS.min} caracteres.`,
      'string.max': `Los temas no pueden superar los ${TEMAS.max} caracteres.`,
    }),
  copias: Joi.number()
    .integer()
    .min(COPIAS.min)
    .required()
    .messages({
      'number.base': 'El número de copias debe ser un número entero.',
      'number.min': `El número de copias debe ser al menos ${COPIAS.min}.`,
      'any.required': 'El número de copias es obligatorio.',
    }),
  dictadoId: Joi.number().integer().required(DICTADO_ID.required).messages({
    'number.base': 'El dictadoId debe ser un número entero.',
    'any.required': 'El dictadoId es obligatorio.',
  }),
});

module.exports = { examenSchema };
