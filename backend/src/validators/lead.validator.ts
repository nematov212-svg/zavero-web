import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(80),
  phone: z.string().min(7, 'Telefon raqamni to\'g\'ri kiriting').max(25),
  businessName: z.string().min(2, 'Cafe yoki restoran nomi kamida 2 ta belgidan iborat bo\'lishi kerak').max(120),
  city: z.string().min(2, 'Shahar nomini kiriting').max(80),
  message: z.string().max(1000).optional().nullable(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'rejected'], {
    errorMap: () => ({ message: 'Status faqat: new, contacted, converted, rejected bo\'lishi mumkin' }),
  }),
  notes: z.string().max(1000).optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
