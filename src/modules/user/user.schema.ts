import Joi from 'joi';

export const createUserSchema = Joi.object({
  personaDni: Joi.number()
    .integer()
    .positive()
    .required(),

  password: Joi.string()
    .min(4)
    .max(100)
    .optional(),
}).required();

export const loginSchema = Joi.object({
  usuario: Joi.string().required().trim(),
  password: Joi.string().required(),
}).required();

export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required(),
});