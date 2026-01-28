import Joi from 'joi';
import { DNI, NOMBRE, APELLIDO, DIRECCION, TELEFONO, EMAIL, TIPOS } from './persona.definitions';

export const personaSchema = Joi.object({
  dni: Joi.number()
    .integer()
    .min(DNI.min)
    .max(DNI.max)
    .required()
    .messages({
      'number.base': 'El DNI debe ser numérico.',
      'number.min': `El DNI debe tener al menos ${DNI.minLength} dígitos.`,
      'number.max': `El DNI debe tener máximo ${DNI.maxLength} dígitos.`,
      'any.required': 'El DNI es obligatorio.'
    }),

  nombre: Joi.string()
    .min(NOMBRE.min)
    .max(NOMBRE.max)
    .required()
    .messages({
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': `El nombre debe tener al menos ${NOMBRE.min} caracteres.`,
      'string.max': `El nombre no puede superar los ${NOMBRE.max} caracteres.`
    }),

  apellido: Joi.string()
    .min(APELLIDO.min)
    .max(APELLIDO.max)
    .required()
    .messages({
      'string.empty': 'El apellido no puede estar vacío.',
      'string.min': `El apellido debe tener al menos ${APELLIDO.min} caracteres.`,
      'string.max': `El apellido no puede superar los ${APELLIDO.max} caracteres.`
    }),

  telefono: Joi.string()
    .min(TELEFONO.min)
    .max(TELEFONO.max)
    .pattern(TELEFONO.regex)
    .required()
    .messages({
      'string.empty': 'El teléfono no puede estar vacío.',
      'string.min': `El teléfono debe tener al menos ${TELEFONO.min} caracteres.`,
      'string.max': `El teléfono no puede superar los ${TELEFONO.max} caracteres.`,
      'string.pattern.base': 'El formato del teléfono es inválido.'
    }),

  direccion: Joi.string()
    .min(DIRECCION.min)
    .max(DIRECCION.max)
    .required()
    .messages({
      'string.empty': 'La dirección no puede estar vacía.',
      'string.min': `La dirección debe tener al menos ${DIRECCION.min} caracteres.`,
      'string.max': `La dirección no puede superar los ${DIRECCION.max} caracteres.`
    }),

  email: Joi.string()
    .email()
    .max(EMAIL.max)
    .required()
    .messages({
      'string.email': 'El email debe ser válido.',
      'string.empty': 'El email no puede estar vacío.',
      'string.max': `El email no puede superar los ${EMAIL.max} caracteres.`
    }),

  tipo: Joi.string()
    .valid(...TIPOS)
    .required()
    .messages({
      'any.only': `El tipo debe ser uno de los siguientes: ${TIPOS.join(', ')}.`,
      'any.required': 'El tipo es obligatorio.'
    }),

  cursoId: Joi.when('tipo', {
    is: 'alumno',
    then: Joi.number().integer().required().messages({
      'number.base': 'El cursoId debe ser numérico.',
      'any.required': 'El cursoId es obligatorio para alumnos.'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'Los docentes no pueden tener cursoId.'
    })
  }),

  especialidad: Joi.when('tipo', {
    is: 'docente',
    then: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'La especialidad es obligatoria para docentes.',
      'string.min': 'La especialidad debe tener al menos 2 caracteres.'
    }),
    otherwise: Joi.forbidden()
  })
});