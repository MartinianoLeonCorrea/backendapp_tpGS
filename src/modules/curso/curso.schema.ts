import Joi from 'joi';

export const createCursoSchema = Joi.object({
  nroLetra: Joi.string()
    .min(1)
    .max(3)
    .required()
    .messages({
      'string.base': 'El nro y letra del curso debe ser un texto.',
      'string.empty': 'El nro y letra del curso no puede estar vacío.',
      'string.min': 'El nro y letra debe tener al menos 1 caracter.',
      'string.max': 'El nro y letra debe tener máximo 3 caracteres.',
      'any.required': 'El campo nroLetra es obligatorio.',
    }),

  turno: Joi.string()
    .valid('MAÑANA', 'TARDE', 'NOCHE')
    .required()
    .messages({
      'string.base': 'El turno debe ser un texto.',
      'any.only': 'El turno debe ser MAÑANA, TARDE o NOCHE.',
      'any.required': 'El campo turno es obligatorio.',
    }),
});

export const updateCursoSchema = Joi.object({
  nroLetra: Joi.string()
    .min(1)
    .max(3)
    .messages({
      'string.base': 'El nro y letra del curso debe ser un texto.',
      'string.empty': 'El nro y letra del curso no puede estar vacío.',
      'string.min': 'El nro y letra debe tener al menos 1 caracter.',
      'string.max': 'El nro y letra debe tener máximo 3 caracteres.',
    }),

  turno: Joi.string()
    .valid('MAÑANA', 'TARDE', 'NOCHE')
    .messages({
      'string.base': 'El turno debe ser un texto.',
      'any.only': 'El turno debe ser MAÑANA, TARDE o NOCHE.',
    }),
})
  .min(1)
  .messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar.',
  });

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID debe ser un número.',
    'number.integer': 'El ID debe ser un número entero.',
    'number.positive': 'El ID debe ser un número positivo.',
    'any.required': 'El ID es obligatorio.',
  }),
});

export const getCursoQuerySchema = Joi.object({
  includeAlumnos: Joi.string().valid('true', 'false').optional(),
  includeDictados: Joi.string().valid('true', 'false').optional(),
}).unknown(true);
