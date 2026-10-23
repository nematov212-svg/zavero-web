import { Router } from 'express';
import { DirectorController } from '../controllers/director.controller';
import { authenticateToken, requireDirector } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createCafeSchema, updateCafeSchema } from '../validators/cafe.validator';
import { updateLeadStatusSchema } from '../validators/lead.validator';

const router = Router();

// Protect all director routes
router.use(authenticateToken, requireDirector);

// Dashboard
router.get('/dashboard', DirectorController.getDashboard);

// Leads
router.get('/leads', DirectorController.getLeads);
router.get('/leads/:id', DirectorController.getLeadById);
router.patch('/leads/:id/status', validateBody(updateLeadStatusSchema), DirectorController.updateLeadStatus);
router.delete('/leads/:id', DirectorController.deleteLead);

// Cafes
router.get('/cafes', DirectorController.getCafes);
router.post('/cafes', validateBody(createCafeSchema), DirectorController.createCafe);
router.get('/cafes/:id', DirectorController.getCafeById);
router.patch('/cafes/:id', validateBody(updateCafeSchema), DirectorController.updateCafe);
router.delete('/cafes/:id', DirectorController.deleteCafe);
router.post('/cafes/:id/regenerate-key', DirectorController.regenerateApiKey);

// Employees & Monitoring
router.get('/employees', DirectorController.getEmployees);

// Notifications
router.get('/notifications', DirectorController.getNotifications);
router.patch('/notifications/:id/read', DirectorController.markNotificationRead);
router.post('/notifications/read-all', DirectorController.markAllNotificationsRead);

export default router;
