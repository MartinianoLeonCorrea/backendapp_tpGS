import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { validateRequest } from '../../middleware/validateRequest';
import { createUserSchema, loginSchema } from './user.schema';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post(
  '/register',
  validateRequest(createUserSchema),
  userController.register,
);
router.post('/login', validateRequest(loginSchema), userController.login);
export default router;
