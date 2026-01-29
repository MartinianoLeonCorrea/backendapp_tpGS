import Joi from 'joi';

export const createDictadoSchema = Joi.object({
  anio: Joi.number().integer().min(2000).max(2100).required(),
  diasCursado: Joi.string().min(3).max(100).required(),
  cursoId: Joi.number().integer().positive().required(),
  materiaId: Joi.number().integer().positive().required(),
  docenteId: Joi.number().integer().positive().required(),
});

export const updateDictadoSchema = Joi.object({
  anio: Joi.number().integer().min(2000).max(2100),
  diasCursado: Joi.string().min(3).max(100),
  cursoId: Joi.number().integer().positive(),
  materiaId: Joi.number().integer().positive(),
  docenteId: Joi.number().integer().positive(),
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
