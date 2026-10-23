import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';
import { validateBody } from '../middleware/validation';
import { createLeadSchema } from '../validators/lead.validator';

const router = Router();

router.get('/statistics', PublicController.getStatistics);
router.get('/cafes', PublicController.getCafes);
router.post('/leads', validateBody(createLeadSchema), PublicController.createLead);

export default router;
