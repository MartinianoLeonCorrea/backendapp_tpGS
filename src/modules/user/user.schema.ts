import Joi from 'joi';

export const createUserSchema = Joi.object({
  dni: Joi.string().pattern(/^\d+$/).required(),
  password: Joi.string().min(6).required(),
  active: Joi.boolean().optional(),
}).required();

export const loginSchema = Joi.object({
  usuario: Joi.string().required().trim(),
  password: Joi.string().required(),
}).required();
