import crypto from 'crypto';
import { prisma } from '../config/db';
import { CreateCafeInput, UpdateCafeInput } from '../validators/cafe.validator';
import { notifyCafeUpdated } from '../sockets/socketHandler';

export class CafeService {
  static async getPublicCafes() {
    return prisma.cafe.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        activeTables: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllCafes(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.cafe.findMany({
      where,
      include: {
        _count: {
          select: {
            employees: true,
            orders: true,
            customers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCafeById(id: string) {
    const cafe = await prisma.cafe.findUnique({
      where: { id },
      include: {
        employees: {
          take: 20,
          orderBy: { ordersCount: 'desc' },
        },
        orders: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            employees: true,
            orders: true,
            customers: true,
          },
        },
      },
    });

    if (!cafe) {
      throw new Error('Cafe topilmadi');
    }

    return cafe;
  }

  static async createCafe(data: CreateCafeInput) {
    const apiKey = `zvr_live_${crypto.randomBytes(12).toString('hex')}`;

    const cafe = await prisma.cafe.create({
      data: {
        name: data.name.trim(),
        ownerName: data.ownerName.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        address: data.address.trim(),
        activeTables: data.activeTables || 12,
        status: data.status || 'ACTIVE',
        apiKey,
      },
      include: {
        _count: {
          select: { employees: true, orders: true, customers: true },
        },
      },
    });

    notifyCafeUpdated(cafe);

    return cafe;
  }

  static async updateCafe(id: string, data: UpdateCafeInput) {
    const existing = await prisma.cafe.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Cafe topilmadi');
    }

    const updated = await prisma.cafe.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.ownerName && { ownerName: data.ownerName.trim() }),
        ...(data.phone && { phone: data.phone.trim() }),
        ...(data.city && { city: data.city.trim() }),
        ...(data.address && { address: data.address.trim() }),
        ...(data.activeTables !== undefined && { activeTables: data.activeTables }),
        ...(data.status && { status: data.status }),
      },
      include: {
        _count: {
          select: { employees: true, orders: true, customers: true },
        },
      },
    });

    notifyCafeUpdated(updated);

    return updated;
  }

  static async deleteCafe(id: string) {
    const existing = await prisma.cafe.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Cafe topilmadi');
    }

    const deleted = await prisma.cafe.delete({
      where: { id },
    });

    notifyCafeUpdated(deleted);

    return deleted;
  }

  static async regenerateApiKey(id: string) {
    const newApiKey = `zvr_live_${crypto.randomBytes(12).toString('hex')}`;
    return prisma.cafe.update({
      where: { id },
      data: { apiKey: newApiKey },
    });
  }
}
