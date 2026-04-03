import { Router } from 'express';
import { loginController } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { loginSchema } from './auth.schema';

const router = Router();
router.post('/login', validateRequest(loginSchema), loginController);
export default router;