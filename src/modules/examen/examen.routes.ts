import { Router } from 'express';
// Importamos todas las exportaciones nombradas del controlador como un objeto
import * as examenController from './examen.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { examenSchema } from './examen.schema';

const router = Router();

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
// para evitar conflictos

// Ruta para obtener exámenes de una materia específica
// GET /api/examenes/materia/:materiaId
router.get('/materia/:materiaId', examenController.getExamenesByMateria);

// Ruta para obtener exámenes por dictadoId (query parameter) u obtener todos
// GET /api/examenes?dictadoId=123
// GET /api/examenes
router.get('/', (req, res, next) => {
  if (req.query.dictadoId) {
    return examenController.getExamenesByDictadoId(req, res, next);
  }
  return examenController.getAllExamenes(req, res, next);
});

// Ruta para crear un nuevo examen
// POST /api/examenes
router.post('/', validateRequest(examenSchema), examenController.createExamen);

// Actualizar un examen existente
// PUT /api/examenes/:id
router.put(
  '/:id',
  validateRequest(examenSchema),
  examenController.updateExamen
);

// Rutas de búsqueda y manipulación por ID (DEBEN IR AL FINAL)
// GET /api/examenes/:id
router.get('/:id', examenController.getExamenById);

// DELETE /api/examenes/:id
router.delete('/:id', examenController.deleteExamen);

export default router;
