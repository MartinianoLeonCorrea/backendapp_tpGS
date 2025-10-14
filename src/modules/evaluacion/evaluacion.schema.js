const Joi = require('joi');
const {
  NOTA,
  OBSERVACIONES,
  ALUMNO_ID,
  EXAMEN_ID,
} = require('./evaluacion.definitions');

const evaluacionSchema = Joi.object({
  nota: Joi.number()
    .min(NOTA.min)
    .max(NOTA.max)
    .required(NOTA.required)
    .messages({
      'number.base': 'La nota debe ser un número.',
      'number.min': `La nota debe ser al menos ${NOTA.min}.`,
      'number.max': `La nota no puede superar ${NOTA.max}.`,
      'any.required': 'La nota es obligatoria.',
    }),
  observaciones: Joi.string()
    .min(OBSERVACIONES.min)
    .max(OBSERVACIONES.max)
    .optional()
    .messages({
      'string.base': 'Las observaciones deben ser un texto.',
      'string.min': `Las observaciones deben tener al menos ${OBSERVACIONES.min} caracteres.`,
      'string.max': `Las observaciones no pueden superar los ${OBSERVACIONES.max} caracteres.`,
    }),
  alumnoId: Joi.number().integer().required(ALUMNO_ID.required).messages({
    'number.base': 'El ID del alumno debe ser un número entero.',
    'any.required': 'El ID del alumno es obligatorio.',
  }),
  examenId: Joi.number().integer().required(EXAMEN_ID.required).messages({
    'number.base': 'El ID del examen debe ser un número entero.',
    'any.required': 'El ID del examen es obligatorio.',
  }),
});

module.exports = { evaluacionSchema };
