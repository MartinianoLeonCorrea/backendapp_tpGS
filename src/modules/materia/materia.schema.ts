import Joi from 'joi';
import {
  MATERIA_NOMBRE,
  MATERIA_DESCRIPCION,
  MATERIA_ID,
  PAGINATION,
  INCLUDE_OPTIONS,
} from './materia.definitions';

export const createMateriaSchema = Joi.object({
  nombre: Joi.string()
    .min(MATERIA_NOMBRE.MIN)
    .max(MATERIA_NOMBRE.MAX)
    .required()
    .trim()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': `El nombre debe tener al menos ${MATERIA_NOMBRE.MIN} caracteres`,
      'string.max': `El nombre no puede exceder los ${MATERIA_NOMBRE.MAX} caracteres`,
      'any.required': 'El nombre es obligatorio',
    }),
  descripcion: Joi.string()
    .max(MATERIA_DESCRIPCION.MAX)
    .allow(null, '')
    .trim()
    .messages({
      'string.base': 'La descripción debe ser un texto',
      'string.max': `La descripción no puede exceder los ${MATERIA_DESCRIPCION.MAX} caracteres`,
    }),
});

export const updateMateriaSchema = Joi.object({
  nombre: Joi.string()
    .min(MATERIA_NOMBRE.MIN)
    .max(MATERIA_NOMBRE.MAX)
    .trim()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': `El nombre debe tener al menos ${MATERIA_NOMBRE.MIN} caracteres`,
      'string.max': `El nombre no puede exceder los ${MATERIA_NOMBRE.MAX} caracteres`,
    }),
  descripcion: Joi.string()
    .max(MATERIA_DESCRIPCION.MAX)
    .allow(null, '')
    .trim()
    .messages({
      'string.base': 'La descripción debe ser un texto',
      'string.max': `La descripción no puede exceder los ${MATERIA_DESCRIPCION.MAX} caracteres`,
    }),
})
  .min(1)
  .messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar',
  });

export const idParamSchema = Joi.object({
  id: Joi.number().integer().min(MATERIA_ID.MIN).required().messages({
    'number.base': 'El ID debe ser un número',
    'number.integer': 'El ID debe ser un número entero',
    'number.min': 'El ID debe ser mayor a 0',
    'any.required': 'El ID es obligatorio',
  }),
});

export const queryMateriaSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(PAGINATION.PAGE_MIN)
    .default(PAGINATION.PAGE_DEFAULT)
    .messages({
      'number.base': 'El número de página debe ser un número',
      'number.integer': 'El número de página debe ser un número entero',
      'number.min': `El número de página debe ser al menos ${PAGINATION.PAGE_MIN}`,
    }),
  limit: Joi.number()
    .integer()
    .min(PAGINATION.LIMIT_MIN)
    .max(PAGINATION.LIMIT_MAX)
    .default(PAGINATION.LIMIT_DEFAULT)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': `El límite debe ser al menos ${PAGINATION.LIMIT_MIN}`,
      'number.max': `El límite no puede exceder ${PAGINATION.LIMIT_MAX}`,
    }),
  search: Joi.string().trim().allow('').messages({
    'string.base': 'El término de búsqueda debe ser un texto',
  }),
  include: Joi.string()
    .valid(...INCLUDE_OPTIONS)
    .messages({
      'any.only': `El parámetro include solo puede ser: ${INCLUDE_OPTIONS.join(', ')}`,
    }),
});