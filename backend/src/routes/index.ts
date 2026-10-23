import { Router } from 'express';
import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import directorRoutes from './director.routes';
import flutterRoutes from './flutter.routes';
import { PublicController } from '../controllers/public.controller';
import { FlutterController } from '../controllers/flutter.controller';
import { validateBody } from '../middleware/validation';
import { createLeadSchema } from '../validators/lead.validator';

const router = Router();

// Main Route Handlers
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/director', directorRoutes);
router.use('/flutter', flutterRoutes);

// Direct top-level endpoints as requested in prompt:
// 1. POST /api/leads
router.post('/leads', validateBody(createLeadSchema), PublicController.createLead);

// 2. POST /api/cafes (for Flutter app integration)
router.post('/cafes', FlutterController.registerCafe);

// 3. POST /api/orders (for Flutter app POS sync)
router.post('/orders', FlutterController.syncOrder);

export default router;
