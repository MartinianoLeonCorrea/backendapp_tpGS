import Joi from 'joi';

export const createMateriaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().trim(),
  descripcion: Joi.string().max(1000).allow(null, '').trim(),
});

export const updateMateriaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).trim(),
  descripcion: Joi.string().max(1000).allow(null, '').trim(),
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const queryMateriaSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().trim().allow(''),
  include: Joi.string().valid('relations'),
});