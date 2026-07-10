import Joi from 'joi';

export const loginSchema = Joi.object({
  identifier: Joi.string().trim().min(1).required(),
  password: Joi.string().min(4).required(),
}).required();
