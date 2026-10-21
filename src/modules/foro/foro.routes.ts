import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import * as foroController from './foro.controller';
import { createForoMensajeSchema, dictadoIdParamSchema } from './foro.schema';

const router = Router();

router.use(authMiddleware);
router.get(
  '/dictado/:dictadoId',
  validateRequest(dictadoIdParamSchema, 'params'),
  foroController.getMensajes,
);
router.post(
  '/dictado/:dictadoId',
  validateRequest(dictadoIdParamSchema, 'params'),
  validateRequest(createForoMensajeSchema),
  foroController.createMensaje,
);

export default router;
