import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation';
import { loginSchema } from '../validators/auth.validator';
import { authenticateToken } from '../middleware/auth';
import { loginRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginRateLimiter, validateBody(loginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.me);
router.patch('/change-password', authenticateToken, AuthController.changePassword);

export default router;
