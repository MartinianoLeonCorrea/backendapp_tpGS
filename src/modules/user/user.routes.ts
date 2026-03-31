import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post('/login', userController.login);
router.post('/register', userController.register);

export default router;