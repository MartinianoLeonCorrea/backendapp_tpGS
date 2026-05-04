import { Router } from 'express';
import * as MaterialController from './material.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createMaterialSchema, updateMaterialSchema, idParamSchema } from './material.schema';

const router = Router();

// GET /api/materiales
router.get('/', MaterialController.getAllMateriales);

// GET /api/materiales/:id
router.get('/:id', validateRequest(idParamSchema, 'params'), MaterialController.getMaterialById);

// GET /api/materiales/dictado/:dictadoId
router.get('/dictado/:dictadoId', MaterialController.getMaterialesByDictado);

// POST /api/materiales
router.post('/', validateRequest(createMaterialSchema), MaterialController.createMaterial);

// PUT /api/materiales/:id
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(updateMaterialSchema), MaterialController.updateMaterial);

// DELETE /api/materiales/:id
router.delete('/:id', validateRequest(idParamSchema, 'params'), MaterialController.deleteMaterial);

export default router;