import { Router } from 'express';
import * as materiaController from './materia.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createMateriaSchema,
  updateMateriaSchema,
  idParamSchema,
  queryMateriaSchema,
} from './materia.schema';

const router = Router();

// ========================= CREATE =========================

router.post(
  '/',
  validateRequest(createMateriaSchema, 'body'),
  materiaController.createMateria
);

// ========================= READ ===========================

router.get(
  '/',
  validateRequest(queryMateriaSchema, 'query'),
  materiaController.getAllMaterias
);

router.get(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(queryMateriaSchema, 'query'),
  materiaController.getMateriaById
);

// ========================= UPDATE =========================

router.put(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateMateriaSchema, 'body'),
  materiaController.updateMateria
);

// ========================= DELETE =========================

router.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  materiaController.deleteMateria
);

export default router;