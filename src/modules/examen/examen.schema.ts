import Joi from 'joi';

export const createExamenSchema = Joi.object({
  fechaExamen: Joi.date().required(),
  temas: Joi.string().min(5).max(800).required(),
  copias: Joi.number().integer().min(1).required(),
  dictadoId: Joi.number().integer().positive().required(),
});

export const updateExamenSchema = Joi.object({
  fechaExamen: Joi.date(),
  temas: Joi.string().min(5).max(800),
  copias: Joi.number().integer().min(1),
  dictadoId: Joi.number().integer().positive(),
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
