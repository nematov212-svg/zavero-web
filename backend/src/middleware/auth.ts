import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Avtorizatsiya talab qilinadi. Token topilmadi.',
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token yaroqsiz yoki muddati tugagan.',
    });
  }
};

export const requireDirector = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'DIRECTOR' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({
      success: false,
      message: 'Ushbu bo\'lim faqat Zavero Director uchun ochiq.',
    });
  }
  next();
};
