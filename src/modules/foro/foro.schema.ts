import Joi from 'joi';

export const dictadoIdParamSchema = Joi.object({
  dictadoId: Joi.number().integer().positive().required(),
});

export const createForoMensajeSchema = Joi.object({
  texto: Joi.string().trim().min(1).max(5000).required(),
});
