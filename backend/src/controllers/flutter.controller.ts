import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { notifyCafeUpdated, notifyOrderCreated } from '../sockets/socketHandler';

export class FlutterController {
  /**
   * Flutter application integration: register cafe or sync
   * POST /api/cafes (or /api/flutter/cafes)
   */
  static async registerCafe(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, ownerName, phone, city, address, activeTables } = req.body;

      if (!name || !phone || !city) {
        return res.status(400).json({
          success: false,
          message: 'Cafe nomi, telefon va shahar ko\'rsatilishi shart',
        });
      }

      const apiKey = `zvr_flutter_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const cafe = await prisma.cafe.create({
        data: {
          name,
          ownerName: ownerName || 'Zavero Partner',
          phone,
          city,
          address: address || city,
          activeTables: activeTables || 10,
          status: 'ACTIVE',
          apiKey,
        },
      });

      notifyCafeUpdated(cafe);

      res.status(201).json({
        success: true,
        message: 'Cafe Zavero tizimiga muvaffaqiyatli ulandi',
        data: {
          id: cafe.id,
          name: cafe.name,
          apiKey: cafe.apiKey,
          status: cafe.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Flutter app creates real order from tablet/POS
   */
  static async syncOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = req.headers['x-zavero-api-key'] as string;
      const { orderNumber, tableNumber, totalAmount, items, paymentMethod, waiterId } = req.body;

      let cafeId: string | undefined;

      if (apiKey) {
        const cafe = await prisma.cafe.findUnique({ where: { apiKey } });
        if (cafe) cafeId = cafe.id;
      }

      if (!cafeId) {
        const defaultCafe = await prisma.cafe.findFirst({ where: { status: 'ACTIVE' } });
        cafeId = defaultCafe?.id;
      }

      if (!cafeId) {
        return res.status(404).json({ success: false, message: 'Faol cafe topilmadi' });
      }

      const order = await prisma.order.create({
        data: {
          cafeId,
          orderNumber: orderNumber || `ZV-${Date.now().toString().slice(-4)}`,
          tableNumber: tableNumber || 1,
          totalAmount: Number(totalAmount) || 50000,
          items: items || [{ name: 'Standart buyurtma', price: 50000, qty: 1 }],
          paymentMethod: paymentMethod || 'CARD',
          status: 'PAID',
          waiterId: waiterId || null,
        },
      });

      notifyOrderCreated(order);

      res.status(201).json({
        success: true,
        message: 'Buyurtma saqlandi va sayt ko\'rsatkichlari yangilandi',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Flutter app fetches cafe profile and status
   */
  static async getCafeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = req.headers['x-zavero-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ success: false, message: 'x-zavero-api-key talab qilinadi' });
      }

      const cafe = await prisma.cafe.findUnique({
        where: { apiKey },
        include: {
          employees: true,
          _count: {
            select: { orders: true, customers: true },
          },
        },
      });

      if (!cafe) {
        return res.status(404).json({ success: false, message: 'Noto\'g\'ri API kalit' });
      }

      res.json({ success: true, data: cafe });
    } catch (error) {
      next(error);
    }
  }
}
