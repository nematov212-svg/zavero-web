import { Request, Response, NextFunction } from 'express';

// In-memory IP tracking for brute force prevention
interface AttemptRecord {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Xavfsizlik tizimi: Kirish urinishlari ko'payib ketdi. Iltimos, ${minutesLeft} daqiqadan so'ng qayta urinib ko'ring.`,
    });
  }

  record.count += 1;
  loginAttempts.set(ip, record);
  next();
};

export const resetLoginAttempts = (ip: string) => {
  loginAttempts.delete(ip);
};
