import { z } from 'zod';

export const createCafeSchema = z.object({
  name: z.string().min(2, 'Cafe nomi kamida 2 ta belgidan iborat bo\'lishi kerak').max(120),
  ownerName: z.string().min(2, 'Egasi ismi kamida 2 ta belgidan iborat bo\'lishi kerak').max(100),
  phone: z.string().min(7, 'Telefon raqamni to\'g\'ri kiriting').max(25),
  city: z.string().min(2, 'Shahar nomini kiriting').max(80),
  address: z.string().min(3, 'Manzilni to\'liq kiriting').max(250),
  activeTables: z.number().int().min(1).max(500).default(12).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
});

export const updateCafeSchema = createCafeSchema.partial();

export type CreateCafeInput = z.infer<typeof createCafeSchema>;
export type UpdateCafeInput = z.infer<typeof updateCafeSchema>;
