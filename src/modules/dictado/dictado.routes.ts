import Joi from 'joi';
import { Router } from 'express';
import * as dictadoController from './dictado.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createDictadoSchema,
  updateDictadoSchema,
  idParamSchema,
  queryCursoMateriaSchema,
} from './dictado.schema';
import { personaSchema } from '../persona/persona.schema';

const router = Router();

// Buscar dictados por curso y materia
router.get(
  '/by-curso-materia',
  validateRequest(queryCursoMateriaSchema, 'query'),
  dictadoController.getDictadosByCursoAndMateria
);


// Buscar dictados por persona
router.get(
  '/persona/:personaId',
  validateRequest(Joi.object({ personaId: personaSchema.extract('dni') }), 'params'),
  dictadoController.getDictadosByPersona
);

// Buscar dictados activos por persona
router.get(
  '/persona/:personaId/activos',
  validateRequest(Joi.object({ personaId: personaSchema.extract('dni') }), 'params'),
  dictadoController.getDictadosActivosByPersona
);

router.get('/', dictadoController.getAllDictados);
router.get('/:id', validateRequest(idParamSchema, 'params'), dictadoController.getDictadoById);

router.post(
  '/',
  validateRequest(createDictadoSchema, 'body'),
  dictadoController.createDictado
);

router.put(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateDictadoSchema, 'body'),
  dictadoController.updateDictado
);

router.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  dictadoController.deleteDictado
);

export default router;
