import Joi from 'joi';

export const createMaterialSchema = Joi.object({
  titulo: Joi.string().min(2).max(150).required().trim(),
  descripcion: Joi.string().max(500).optional().allow('', null),
  url: Joi.string().uri().max(500).required(),
  tipo: Joi.string().valid('pdf', 'video', 'link', 'otro').required(),
  dictadoId: Joi.number().integer().positive().required(),
});

export const updateMaterialSchema = Joi.object({
  titulo: Joi.string().min(2).max(150).trim(),
  descripcion: Joi.string().max(500).allow('', null),
  url: Joi.string().uri().max(500),
  tipo: Joi.string().valid('pdf', 'video', 'link', 'otro'),
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});