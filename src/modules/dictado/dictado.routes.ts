import { Router } from 'express';
import * as dictadoController from './dictado.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createDictadoSchema,
  updateDictadoSchema,
  idParamSchema,
} from './dictado.schema';

const router = Router();

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
