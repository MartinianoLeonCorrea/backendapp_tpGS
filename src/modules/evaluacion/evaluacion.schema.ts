import Joi from 'joi';
import {
  NOTA,
  OBSERVACION,
  ALUMNO_ID,
  EXAMEN_ID,
} from './evaluacion.definitions';

export const evaluacionSchema = Joi.object({
  nota: Joi.number()
    .min(NOTA.min!)
    .max(NOTA.max!)
    .allow(null)
    .optional()
    .messages({
      'number.base': 'La nota debe ser un número.',
      'number.min': `La nota debe ser al menos ${NOTA.min}.`,
      'number.max': `La nota no puede superar ${NOTA.max}.`,
    }),
  observacion: Joi.string()
    .min(OBSERVACION.min!)
    .max(OBSERVACION.max!)
    .allow(null)
    .optional()
    .messages({
      'string.base': 'Las observaciones deben ser un texto.',
      'string.min': `Las observaciones deben tener al menos ${OBSERVACION.min} caracteres.`,
      'string.max': `Las observaciones no pueden superar los ${OBSERVACION.max} caracteres.`,
    }),
  alumnoId: Joi.number()
  .integer()
  .required()
  .messages({
    'number.base': 'El ID del alumno debe ser un número entero.',
    'any.required': 'El ID del alumno es obligatorio.',
  }),
  examenId: Joi.number()
  .integer()
  .required()
  .messages({
    'number.base': 'El ID del examen debe ser un número entero.',
    'any.required': 'El ID del examen es obligatorio.',
  }),
});

;
