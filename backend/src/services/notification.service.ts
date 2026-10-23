import { prisma } from '../config/db';

export class NotificationService {
  static async getNotifications(limit = 20) {
    return prisma.notification.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
      },
    });
  }

  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  static async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }
}
