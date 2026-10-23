import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Noto\'g\'ri email formati'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

export type LoginInput = z.infer<typeof loginSchema>;
