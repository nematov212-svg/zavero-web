import { prisma } from '../config/db';
import { CreateLeadInput, UpdateLeadStatusInput } from '../validators/lead.validator';
import { notifyNewLead, notifyLeadStatusUpdated } from '../sockets/socketHandler';
import { TelegramService } from './telegram.service';

export class LeadService {
  static async createLead(data: CreateLeadInput) {
    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        businessName: data.businessName.trim(),
        city: data.city.trim(),
        message: data.message?.trim() || null,
        status: 'new',
      },
    });

    // Create a notification for the database
    const notification = await prisma.notification.create({
      data: {
        title: '🔔 Yangi mijoz',
        message: `${lead.name} (${lead.businessName}) siz bilan bog'lanishni so'radi. Tel: ${lead.phone}`,
        type: 'NEW_LEAD',
        leadId: lead.id,
      },
    });

    // Send instant Telegram message to bot
    TelegramService.sendNewLeadAlert(lead).catch((err) => {
      console.error('Failed to dispatch telegram notification:', err);
    });

    // Real-time broadcast
    notifyNewLead({
      lead,
      notification,
    });

    return lead;
  }

  static async getLeads(filters: { status?: string; search?: string; page?: number; limit?: number }) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters.search) {
      const search = filters.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getLeadById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notifications: true,
      },
    });

    if (!lead) {
      throw new Error('Mijoz arizasi topilmadi');
    }

    return lead;
  }

  static async updateLeadStatus(id: string, data: UpdateLeadStatusInput) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Mijoz arizasi topilmadi');
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    notifyLeadStatusUpdated(updated);

    return updated;
  }

  static async deleteLead(id: string) {
    return prisma.lead.delete({
      where: { id },
    });
  }
}
