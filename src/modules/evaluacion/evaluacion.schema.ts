import Joi from 'joi';

export const createEvaluacionSchema = Joi.object({
  nota: Joi.number().min(0).max(10).allow(null).optional(),
  observacion: Joi.string().min(0).max(500).allow(null).optional(),
  alumnoId: Joi.number().integer().positive().required(),
  examenId: Joi.number().integer().positive().required(),
});

export const updateEvaluacionSchema = Joi.object({
  nota: Joi.number().min(0).max(10).allow(null),
  observacion: Joi.string().min(0).max(500).allow(null),
  alumnoId: Joi.number().integer().positive(),
  examenId: Joi.number().integer().positive(),
}).min(1);

export const updateBatchEvaluacionItemSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  nota: Joi.number().min(0).max(10).allow(null),
  observacion: Joi.string().min(0).max(500).allow(null),
  alumnoId: Joi.number().integer().positive(),
  examenId: Joi.number().integer().positive(),
}).or('nota', 'observacion', 'alumnoId', 'examenId');

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
;
