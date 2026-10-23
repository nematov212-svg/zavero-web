import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { CafeService } from '../services/cafe.service';
import { LeadService } from '../services/lead.service';

export class PublicController {
  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await StatsService.getPublicStatistics();
      // Send clean, direct response matching the user's exact specification
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getCafes(req: Request, res: Response, next: NextFunction) {
    try {
      const cafes = await CafeService.getPublicCafes();
      res.json({
        success: true,
        count: cafes.length,
        data: cafes,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await LeadService.createLead(req.body);
      res.status(201).json({
        success: true,
        message: 'Rahmat! Tez orada siz bilan bog\'lanamiz.',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }
}
