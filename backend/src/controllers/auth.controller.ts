import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.json({
        success: true,
        message: 'Tizimga muvaffaqiyatli kirildi',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login xatosi',
      });
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: 'Avtorizatsiyadan o\'tilmagan' });
      }
      const user = await AuthService.getProfile(req.user.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: 'Avtorizatsiyadan o\'tilmagan' });
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Joriy va yangi parolni kiriting' });
      }
      const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Parolni o\'zgartirishda xatolik yuz berdi',
      });
    }
  }
}
