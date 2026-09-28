import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { validateRequest } from '../../middleware/validateRequest';
import { authMiddleware } from '../../middleware/auth';
import { createUserSchema, loginSchema } from './user.schema';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Ruta pública: iniciar sesión
router.post(
  '/login',
  validateRequest(loginSchema),
  userController.login,
);

// Obtener usuarios existentes
router.get(
  '/',
  authMiddleware,
  userController.findAll,
);

// Obtener personas que todavía no tienen usuario
router.get(
  '/without-user',
  authMiddleware,
  userController.findPersonasWithoutUser,
);

// Crear un usuario para una persona existente
router.post(
  '/register',
  authMiddleware,
  validateRequest(createUserSchema),
  userController.create,
);

export default router;