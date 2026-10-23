import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { LeadService } from '../services/lead.service';
import { CafeService } from '../services/cafe.service';
import { NotificationService } from '../services/notification.service';

export class DirectorController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await StatsService.getDirectorDashboard();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // Leads
  static async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search, page, limit } = req.query;
      const result = await LeadService.getLeads({
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getLeadById(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await LeadService.getLeadById(req.params.id);
      res.json({ success: true, data: lead });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await LeadService.updateLeadStatus(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Mijoz holati muvaffaqiyatli yangilandi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      await LeadService.deleteLead(req.params.id);
      res.json({ success: true, message: 'Mijoz arizasi o\'chirildi' });
    } catch (error) {
      next(error);
    }
  }

  // Cafes
  static async getCafes(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const cafes = await CafeService.getAllCafes(search as string);
      res.json({ success: true, data: cafes });
    } catch (error) {
      next(error);
    }
  }

  static async getCafeById(req: Request, res: Response, next: NextFunction) {
    try {
      const cafe = await CafeService.getCafeById(req.params.id);
      res.json({ success: true, data: cafe });
    } catch (error) {
      next(error);
    }
  }

  static async createCafe(req: Request, res: Response, next: NextFunction) {
    try {
      const cafe = await CafeService.createCafe(req.body);
      res.status(201).json({
        success: true,
        message: 'Yangi cafe muvaffaqiyatli qo\'shildi',
        data: cafe,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCafe(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CafeService.updateCafe(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cafe ma\'lumotlari yangilandi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCafe(req: Request, res: Response, next: NextFunction) {
    try {
      await CafeService.deleteCafe(req.params.id);
      res.json({ success: true, message: 'Cafe o\'chirildi' });
    } catch (error) {
      next(error);
    }
  }

  static async regenerateApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CafeService.regenerateApiKey(req.params.id);
      res.json({
        success: true,
        message: 'Yangi Flutter API kaliti yaratildi',
        apiKey: updated.apiKey,
      });
    } catch (error) {
      next(error);
    }
  }

  // Employees & Monitoring
  static async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await StatsService.getEmployeePerformance();
      res.json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  }

  // Notifications
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getNotifications();
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  static async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAsRead(req.params.id);
      res.json({ success: true, message: 'Bildirishnoma o\'qildi deb belgilandi' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead();
      res.json({ success: true, message: 'Barcha bildirishnomalar o\'qildi' });
    } catch (error) {
      next(error);
    }
  }
}
