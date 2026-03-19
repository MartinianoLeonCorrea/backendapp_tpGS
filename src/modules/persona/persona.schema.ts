import Joi from 'joi';

export const personaSchema = Joi.object({
  dni: Joi.number().integer().min(1000000).max(99999999).required(),
  nombre: Joi.string().min(2).max(100).required().trim(),
  apellido: Joi.string().min(2).max(100).required().trim(),
  telefono: Joi.string().min(7).max(20).pattern(/^[\d\s\-+()]*$/).required().trim(),
  direccion: Joi.string().min(5).max(255).required().trim(),
  email: Joi.string().email().max(100).required().trim(),
  tipo: Joi.string().valid('alumno', 'docente').required(),
  
  cursoId: Joi.when('tipo', {
    is: 'alumno',
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.forbidden(),
  }),
  
  especialidad: Joi.when('tipo', {
    is: 'docente',
    then: Joi.string().min(2).max(100).required().trim(),
    otherwise: Joi.forbidden(),
  }),
});