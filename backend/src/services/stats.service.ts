import { prisma } from '../config/db';

export class StatsService {
  static async getPublicStatistics() {
    const [cafes, employees, orders, customers] = await Promise.all([
      prisma.cafe.count({ where: { status: 'ACTIVE' } }),
      prisma.employee.count(),
      prisma.order.count(),
      prisma.customer.count(),
    ]);

    return {
      cafes,
      employees,
      orders,
      customers,
    };
  }

  static async getDirectorDashboard() {
    const [
      activeCafesCount,
      totalCafesCount,
      employeesCount,
      ordersCount,
      customersCount,
      leadsCount,
      newLeadsCount,
      recentLeads,
      recentCafes,
      ordersSum,
    ] = await Promise.all([
      prisma.cafe.count({ where: { status: 'ACTIVE' } }),
      prisma.cafe.count(),
      prisma.employee.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cafe.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { employees: true, orders: true },
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = ordersSum._sum.totalAmount || 0;

    return {
      overview: {
        activeCafes: activeCafesCount,
        totalCafes: totalCafesCount,
        employees: employeesCount,
        orders: ordersCount,
        customers: customersCount,
        totalLeads: leadsCount,
        newLeads: newLeadsCount,
        totalRevenue,
      },
      recentLeads,
      recentCafes,
    };
  }

  static async getEmployeePerformance() {
    return prisma.employee.findMany({
      orderBy: { ordersCount: 'desc' },
      take: 10,
      include: {
        cafe: {
          select: { name: true, city: true },
        },
      },
    });
  }
}
