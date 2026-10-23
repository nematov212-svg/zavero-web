import { Router } from 'express';
import { FlutterController } from '../controllers/flutter.controller';

const router = Router();

router.post('/cafes', FlutterController.registerCafe);
router.post('/orders', FlutterController.syncOrder);
router.get('/status', FlutterController.getCafeStatus);

export default router;
