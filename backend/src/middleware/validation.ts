import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Kiritilgan ma\'lumotlarda xatolik mavjud',
          errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Ma\'lumotlarni tekshirishda xatolik yuz berdi',
      });
    }
  };
};
