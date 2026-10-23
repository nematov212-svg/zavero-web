import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean old data if needed
  await prisma.notification.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.cafe.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Director User
  const passwordHash = await bcrypt.hash('zavero2026director', 10);
  const director = await prisma.user.create({
    data: {
      email: 'director@zavero.uz',
      passwordHash,
      name: 'Zavero Boshqaruvchisi',
      role: 'DIRECTOR',
    },
  });
  console.log(`✅ Director created: ${director.email}`);

  // 2. Create Initial 2 Cafes
  const cafeFamily = await prisma.cafe.create({
    data: {
      name: 'Family Cafe',
      ownerName: 'Azizbek Rahimov',
      phone: '+998 90 123 45 67',
      city: 'Toshkent',
      address: 'Chilonzor tumani, 9-mavze, 12-uy',
      status: 'ACTIVE',
      activeTables: 18,
      apiKey: 'zvr_live_fam_cafe_98234a9e',
    },
  });

  const cafeSamarqand = await prisma.cafe.create({
    data: {
      name: 'Samarqand Cafe & Lounge',
      ownerName: 'Farrux Zokirov',
      phone: '+998 93 456 78 90',
      city: 'Samarqand',
      address: 'Registon ko\'chasi, 14-uy',
      status: 'ACTIVE',
      activeTables: 24,
      apiKey: 'zvr_live_smq_lounge_34891b2c',
    },
  });
  console.log('✅ 2 Cafes created: Family Cafe & Samarqand Cafe');

  // 3. Create 14 Employees
  const employeeNames = [
    { name: 'Bobur Mirzayev', role: 'Katta ofitsiant', cafeId: cafeFamily.id, orders: 48, closed: 46, sales: 9400000, status: 'Faol ishda' },
    { name: 'Madina Umarova', role: 'Ofitsiant', cafeId: cafeFamily.id, orders: 42, closed: 41, sales: 7800000, status: 'Faol ishda' },
    { name: 'Javohir Karimov', role: 'Ofitsiant', cafeId: cafeFamily.id, orders: 38, closed: 37, sales: 6900000, status: 'Tanaffusda' },
    { name: 'Nilufar Sobirova', role: 'Barista', cafeId: cafeFamily.id, orders: 56, closed: 56, sales: 4200000, status: 'Faol ishda' },
    { name: 'Otabek Qodirov', role: 'Bosh oshpaz', cafeId: cafeFamily.id, orders: 65, closed: 64, sales: 14500000, status: 'Faol ishda' },
    { name: 'Shahzoda Aliyeva', role: 'Kassir', cafeId: cafeFamily.id, orders: 78, closed: 78, sales: 18200000, status: 'Faol ishda' },
    { name: 'Sardor Rustamov', role: 'Administrator', cafeId: cafeFamily.id, orders: 0, closed: 0, sales: 0, status: 'Faol ishda' },

    { name: 'Sherzod Toirov', role: 'Katta ofitsiant', cafeId: cafeSamarqand.id, orders: 52, closed: 50, sales: 11200000, status: 'Faol ishda' },
    { name: 'Kamola Saidova', role: 'Ofitsiant', cafeId: cafeSamarqand.id, orders: 39, closed: 38, sales: 7100000, status: 'Faol ishda' },
    { name: 'Bekzod Fayzullayev', role: 'Ofitsiant', cafeId: cafeSamarqand.id, orders: 35, closed: 34, sales: 6300000, status: 'Faol ishda' },
    { name: 'Zilola Ergasheva', role: 'Barista', cafeId: cafeSamarqand.id, orders: 44, closed: 44, sales: 3800000, status: 'Tanaffusda' },
    { name: 'Dilshod Normatov', role: 'Bosh oshpaz', cafeId: cafeSamarqand.id, orders: 58, closed: 57, sales: 16800000, status: 'Faol ishda' },
    { name: 'Guli Karimova', role: 'Kassir', cafeId: cafeSamarqand.id, orders: 69, closed: 69, sales: 19400000, status: 'Faol ishda' },
    { name: 'Temur Ahmedov', role: 'Administrator', cafeId: cafeSamarqand.id, orders: 0, closed: 0, sales: 0, status: 'Faol ishda' },
  ];

  const createdEmployees = [];
  for (const emp of employeeNames) {
    const created = await prisma.employee.create({
      data: {
        cafeId: emp.cafeId,
        name: emp.name,
        role: emp.role,
        phone: `+998 90 ${Math.floor(1000000 + Math.random() * 9000000)}`,
        ordersCount: emp.orders,
        closedOrdersCount: emp.closed,
        salesAmount: emp.sales,
        attendanceStatus: emp.status,
        rating: 4.8 + Number((Math.random() * 0.2).toFixed(1)),
      },
    });
    createdEmployees.push(created);
  }
  console.log(`✅ 14 Employees seeded successfully`);

  // 4. Create 327 Orders
  console.log('⏳ Creating 327 orders...');
  const orderItemsPool = [
    { name: 'Ribeye Steyk Premium', price: 125000, qty: 1 },
    { name: 'Pitsa Pepperoni Zavero', price: 78000, qty: 1 },
    { name: 'Sezar Salati Tovuqli', price: 46000, qty: 1 },
    { name: 'Kappuchino Grande', price: 24000, qty: 2 },
    { name: 'Limonad Marakuya', price: 28000, qty: 2 },
    { name: 'Tom Yum Sho\'rva', price: 68000, qty: 1 },
    { name: 'Chizkeyk San-Sebastyan', price: 38000, qty: 1 },
    { name: 'Americano Double', price: 20000, qty: 1 },
  ];

  const orderData = [];
  for (let i = 1; i <= 327; i++) {
    const isFamily = i % 2 === 0;
    const cafe = isFamily ? cafeFamily : cafeSamarqand;
    const waiter = createdEmployees[i % createdEmployees.length];
    const items = [
      orderItemsPool[i % orderItemsPool.length],
      orderItemsPool[(i + 2) % orderItemsPool.length],
    ];
    const totalAmount = items.reduce((acc, it) => acc + it.price * it.qty, 0);

    orderData.push({
      cafeId: cafe.id,
      orderNumber: `ZV-${1000 + i}`,
      tableNumber: (i % 18) + 1,
      waiterId: waiter.id,
      status: i > 320 ? 'PREPARING' : i > 310 ? 'SERVED' : 'PAID',
      totalAmount,
      items,
      paymentMethod: i % 3 === 0 ? 'CLICK' : i % 3 === 1 ? 'PAYME' : 'CARD',
      createdAt: new Date(Date.now() - (327 - i) * 1000 * 60 * 18),
    });
  }

  await prisma.order.createMany({
    data: orderData,
  });
  console.log('✅ 327 Orders created successfully');

  // 5. Create Customers (1,284 total)
  console.log('⏳ Creating 1,284 customers count...');
  const customerBatch = [];
  const uzbFirstNames = ['Anvar', 'Jasur', 'Dilshod', 'Shaxlo', 'Madina', 'Kamola', 'Ulug\'bek', 'Davron', 'Shohruh', 'Lobar', 'Nodir', 'Ziyoda'];
  const uzbLastNames = ['Usmonov', 'Aliyev', 'Tursunov', 'Xasanov', 'Sobirov', 'Qodirov', 'Nazarov', 'Yusupov', 'Ergashev', 'Raximov'];

  for (let i = 1; i <= 1284; i++) {
    const fName = uzbFirstNames[i % uzbFirstNames.length];
    const lName = uzbLastNames[i % uzbLastNames.length];
    const cafe = i % 2 === 0 ? cafeFamily : cafeSamarqand;
    customerBatch.push({
      cafeId: cafe.id,
      name: `${fName} ${lName} #${i}`,
      phone: `+998 9${i % 10} ${Math.floor(100 + (i % 900))} ${Math.floor(10 + (i % 90))} ${Math.floor(10 + (i % 90))}`,
      visitsCount: 1 + (i % 15),
      totalSpent: (1 + (i % 12)) * 145000,
      lastVisit: new Date(Date.now() - (i % 30) * 86400000),
    });
  }

  // Insert in batches of 500
  for (let i = 0; i < customerBatch.length; i += 500) {
    const slice = customerBatch.slice(i, i + 500);
    await prisma.customer.createMany({ data: slice });
  }
  console.log('✅ 1,284 Customers created successfully');

  // 6. Seed Leads
  const initialLeads = [
    {
      name: 'Azizbek',
      phone: '+998 90 987 65 43',
      businessName: 'Family Cafe',
      city: 'Toshkent',
      message: 'Bizning Toshkentdagi 2 ta filialimiz bor. Zavero tizimini sinab ko\'rmoqchimiz, tezroq bog\'laning.',
      status: 'new',
    },
    {
      name: 'Sardorbek Aliyev',
      phone: '+998 97 765 43 21',
      businessName: 'Oqtepa Fast Food Samarqand',
      city: 'Samarqand',
      message: 'Kassa va ofitsiantlar tezligini oshirish uchun avtomatlashtirish kerak. Taqdimot qilib bera olasizmi?',
      status: 'contacted',
      notes: 'Telefon qilindi, ertaga soat 15:00 da demo uchrashuv belgilandi.',
    },
    {
      name: 'Nilufar Rahimova',
      phone: '+998 93 111 22 33',
      businessName: 'Caravan Lounge & Restaurant',
      city: 'Buxoro',
      message: 'Restoranimiz 150 kishilik. QR menu va chek chiqarish funksiyasi juda ma\'qul keldi.',
      status: 'converted',
      notes: 'Shartnoma imzolandi, tizim o\'rnatish jarayonida.',
    },
  ];

  for (const lead of initialLeads) {
    const createdLead = await prisma.lead.create({
      data: lead,
    });

    if (lead.status === 'new') {
      await prisma.notification.create({
        data: {
          title: '🔔 Yangi mijoz',
          message: `${lead.name} (${lead.businessName}) siz bilan bog'lanishni so'radi. Tel: ${lead.phone}`,
          type: 'NEW_LEAD',
          leadId: createdLead.id,
        },
      });
    }
  }
  console.log('✅ Initial Leads and Notifications created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
