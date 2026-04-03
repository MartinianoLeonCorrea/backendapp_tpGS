import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  dni: Joi.string().pattern(/^\d+$/).required(),
  password: Joi.string().min(6).required(),
  active: Joi.boolean().optional(),
}).required();