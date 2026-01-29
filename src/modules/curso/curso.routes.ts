import { Router } from 'express';
import * as CursoController from './curso.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createCursoSchema,
  updateCursoSchema,
  idParamSchema,
  getCursoQuerySchema,
} from './curso.schema';

const router = Router();

// ========================= CREATE =========================

router.post(
  '/',
  validateRequest(createCursoSchema, 'body'),
  CursoController.createCurso
);

// ========================= READ ===========================

router.get(
  '/',
  validateRequest(getCursoQuerySchema, 'query'),
  CursoController.getAllCursos
);

router.get(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  CursoController.getCursoById
);

// ========================= UPDATE =========================

router.put(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateCursoSchema, 'body'),
  CursoController.updateCurso
);

// ========================= DELETE =========================

router.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  CursoController.deleteCurso
);

export default router;
