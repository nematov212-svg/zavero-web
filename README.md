# ZAVERO — Professional Cafe & Restaurant Automation Platform

> **Zavero** — zamonaviy kafe, restoran va umumiy ovqatlanish tarmoqlarini to‘liq avtomatlashtirish, kassa (POS), ofitsiant Flutter ilovasi, oshxona ekrani (KDS), ombor va Director tahlil boshqaruv ekotizimi.

---

## 🌟 Asosiy Imkoniyatlar

1. **Jonli Statistika (Live Database Sync)**:
   - Web saytda ko‘rsatiladigan barcha ma’lumotlar (*Faol cafelar, Xodimlar, Buyurtmalar, Mijozlar*) hardcode qilinmagan. Ular to‘g‘ridan-to‘g‘ri markaziy **PostgreSQL** bazasidan hisoblanadi.
   - Director yangi cafe qo‘shsa yoki yangi buyurtma yopilsa, saytdagi hisoblagich soniyalar ichida avtomatik o‘zgaradi.
2. **Real-time Mijozlar / Lead Tizimi**:
   - Web saytdagi **"Bog‘lanish"** formasidan kiritilgan ariza (*Ism, Telefon, Cafe, Shahar, Izoh*) backend orqali **PostgreSQL `leads`** jadvaliga tushadi.
   - **Socket.IO** orqali **Director Panel**ga real vaqtda ovozli va animatsiyali push-xabarnoma beriladi:
     > 🔔 **Yangi mijoz:** *Shohruh Mirzo (Besh Qozon Chorsu)* siz bilan bog‘lanishni so‘radi.
3. **Professional Director Panel (`/director`)**:
   - **Dashboard**: Asosiy KPI ko‘rsatkichlar, jami tushum, faol cafelar va arizalar.
   - **Mijozlar (Leads)**: Barcha arizalar jadvali, filtrlar (*Yangi, Bog‘lanildi, Hamkor bo‘ldi, Rad etildi*), mobil qurilmalarda bir bosishda qo‘ng‘iroq qilish imkoniyati (`tel:+...`), statusni o‘zgartirish va eslatma qoldirish.
   - **Cafelar**: Yangi cafe qo‘shish, tahrirlash, faol/nofaol qilish hamda **Flutter POS API Key** yaratish.
   - **Statistika**: Tushum dinamikasi, to‘lov turlari (*Click, Payme, Kartalar, Naqd*), top ofitsiantlar reytingi.
4. **Zavero Flutter App Integratsiyasi**:
   - Mavjud va yangi Zavero Flutter mobil/planshet ilovalari uchun maxsus `x-zavero-api-key` xavfsizlik arxitekturasi.
   - Flutter POS orqali ochilgan buyurtmalar real vaqtda markaziy bazaga sinxronlanadi.

---

## 🛠 Texnologik Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens (Deep Obsidian Dark Theme)
- **Animatsiyalar**: Framer Motion + Canvas Confetti
- **Ikonkalar**: Lucide React
- **Router**: React Router DOM v7
- **Real-time**: Socket.IO Client

### Backend
- **Platforma**: Node.js v24 + TypeScript (Clean Architecture)
- **Server**: Express.js + HTTP + Socket.IO
- **Database**: PostgreSQL (port 5433 / 5432)
- **ORM**: Prisma ORM v6
- **Xavfsizlik**: JWT (JSON Web Tokens), bcryptjs, Zod validatsiya, CORS

---

## 📁 Loyiha Strukturasi

```
Zavero.uz/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema (users, cafes, employees, orders, leads, notifications)
│   ├── src/
│   │   ├── config/               # db.ts (Prisma singleton), env.ts
│   │   ├── controllers/          # auth, public, director, flutter controllerlari
│   │   ├── middleware/           # auth.ts (JWT verify), validation.ts (Zod), errorHandler.ts
│   │   ├── routes/               # auth, public, director, flutter marshrutlari
│   │   ├── services/             # auth, lead, cafe, stats, notification servis qatlamlari
│   │   ├── sockets/              # socketHandler.ts (WebSocket broadcast)
│   │   ├── utils/                # seed.ts (Boshlang'ich data generatori)
│   │   ├── validators/           # Zod sxemalari
│   │   ├── app.ts                # Express ilovasi
│   │   └── server.ts             # HTTP + Socket.io server
│   ├── .env                      # Muhit o'zgaruvchilari
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/                   # logo.svg (vektor logotip)
│   ├── src/
│   │   ├── api/                  # client.ts, publicApi.ts, directorApi.ts, authApi.ts
│   │   ├── animations/           # variants.ts (Framer Motion)
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Button, Logo, Badge, Modal, SuccessModal
│   │   │   └── hero/             # HeroDashboardMockup (interaktiv 3D restoran boshqaruv paneli)
│   │   ├── hooks/                # useAuth.tsx, useSocket.ts, useAnimatedCounter.ts
│   │   ├── layouts/              # PublicLayout.tsx, DirectorLayout.tsx
│   │   ├── pages/
│   │   │   ├── public/           # HomePage, FeaturesPage, PricingPage, AboutPage, ContactPage
│   │   │   └── director/         # DirectorLoginPage, DirectorDashboardPage, DirectorLeadsPage, DirectorCafesPage, DirectorStatsPage
│   │   ├── sections/             # HeroSection, LiveStatsSection, PartnerCafesSection, FeaturesSection, EmployeeManagementSection, LeadFormSection, FaqSection, CtaSection
│   │   ├── types/                # index.ts (TypeScript interfeyslari)
│   │   ├── App.tsx               # Asosiy router
│   │   ├── main.tsx
│   │   └── index.css             # Glassmorphism, Tailwind va shriftlar
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Qanday Ishga Tushirish (Quick Start)

### 1. Talablar
- Node.js (v18 yoki undan yuqori)
- PostgreSQL (ishlayotgan holatda)

### 2. Backend sozlash
```bash
cd backend
npm install

# PostgreSQL migratsiyasini yurgizish
npx prisma db push

# Boshlang'ich ma'lumotlarni kiritish (Director, 2 ta Cafe, 14 xodim, 327 buyurtma, 1284 mijoz)
npm run seed

# Backend serverni ishga tushirish
npm run dev
```
Backend ishga tushadi: `http://localhost:5001`
Sog'liqni tekshirish: `http://localhost:5001/api/health`

### 3. Frontend sozlash
Yangi terminalda:
```bash
cd frontend
npm install

# Frontendni ishga tushirish
npm run dev
```
Frontend ochiladi: `http://localhost:5173`

---

## 🔑 Director Panel Login Ma'lumotlari

Director paneliga kirish uchun:
- **URL**: `http://localhost:5173/director/login`
- **Email**: `director@zavero.uz`
- **Parol**: `zavero2026director`

*(Kirish oynasida **"Demo loginni avtomatik to'ldirish"** tugmasi mavjud bo'lib, bir bosishda maydonlarni to'ldirib kirish mumkin)*

---

## 📡 API Endpointlar Arxitekturasi

### Ommaviy Marshrutlar (Public)
| Method | Endpoint | Tavsif |
|---|---|---|
| `GET` | `/api/health` | Server holati va ish vaqti |
| `GET` | `/api/public/statistics` | Jonli statistika: `{ cafes, employees, orders, customers }` |
| `GET` | `/api/public/cafes` | Zaverodan foydalanayotgan faol cafelar ro'yxati |
| `POST` | `/api/leads` | Web saytdagi forma orqali yangi mijoz arizasini yuborish |

### Autentifikatsiya (Auth)
| Method | Endpoint | Tavsif |
|---|---|---|
| `POST` | `/api/auth/login` | Director email va paroli orqali JWT olish |
| `GET` | `/api/auth/me` | Joriy sessiya ma'lumotlarini tekshirish |

### Director Marshrutlari (Himoyalangan - Bearer JWT)
| Method | Endpoint | Tavsif |
|---|---|---|
| `GET` | `/api/director/dashboard` | Umumiy KPI, so'nggi arizalar va ulangan cafelar |
| `GET` | `/api/director/leads` | Barcha mijozlar (filtr: `?status=new`, qidiruv: `?search=...`) |
| `GET` | `/api/director/leads/:id` | Bitta arizaning to'liq ma'lumoti |
| `PATCH` | `/api/director/leads/:id/status` | Statusni o'zgartirish (`new`, `contacted`, `converted`, `rejected`) |
| `DELETE` | `/api/director/leads/:id` | Arizani o'chirish |
| `GET` | `/api/director/cafes` | Barcha cafelar va ularning parametrlari |
| `POST` | `/api/director/cafes` | Yangi cafe qo'shish va unga noyob Flutter API kalit berish |
| `PATCH` | `/api/director/cafes/:id` | Cafe ma'lumotlarini tahrirlash |
| `DELETE` | `/api/director/cafes/:id` | Cafeni tizimdan o'chirish |
| `POST` | `/api/director/cafes/:id/regenerate-key` | Yangi Flutter API kalit generatsiya qilish |
| `GET` | `/api/director/employees` | Xodimlar reytingi va KPI ko'rsatkichlari |
| `GET` | `/api/director/notifications` | Real-time bildirishnomalar arxivi |

### Zavero Flutter App Integratsiyasi
| Method | Endpoint | Tavsif |
|---|---|---|
| `POST` | `/api/cafes` | Flutter orqali yangi cafe ochish yoki ro'yxatdan o'tkazish |
| `POST` | `/api/flutter/orders` | Ofitsiant/POS ilovasidan yangi buyurtmani yuborish |
| `GET` | `/api/flutter/status` | `x-zavero-api-key` orqali filial holatini olish |

---

## 📱 Zavero Flutter App Bilan Bog'lash Yo'riqnomasi

Mavjud Zavero Flutter ilovangizda backend so'rovlarini jo'natish uchun quyidagi namuna koddan foydalaning:

```dart
// lib/services/zavero_api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ZaveroApiService {
  static const String baseUrl = 'https://api.zavero.uz/api'; // yoki http://localhost:5001/api
  final String apiKey; // Director Panelda berilgan API kalit: zvr_live_...

  ZaveroApiService({required this.apiKey});

  // 1. Yangi buyurtma yuborish
  Future<bool> sendOrder({
    required String orderNumber,
    required int tableNumber,
    required double totalAmount,
    required List<Map<String, dynamic>> items,
    String? waiterId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/flutter/orders'),
      headers: {
        'Content-Type': 'application/json',
        'x-zavero-api-key': apiKey,
      },
      body: jsonEncode({
        'orderNumber': orderNumber,
        'tableNumber': tableNumber,
        'totalAmount': totalAmount,
        'items': items,
        'paymentMethod': 'CARD',
        'waiterId': waiterId,
      }),
    );
    return response.statusCode == 201;
  }
}
```

---

## 🔒 Xavfsizlik Choralar (Security)

1. **Parollarni Shifrlash**: Barcha foydalanuvchi parollari `bcrypt` orqali xeshlangan holda saqlanadi.
2. **JWT Autentifikatsiya**: Barcha `/api/director/*` marshrutlari JWT tekshiruvi va `DIRECTOR` roli orqali himoyalangan.
3. **Zod Validatsiya**: Barcha kiruvchi ma’lumotlar qat’iy tekshiriladi, bu esa SQL Injection va noto‘g‘ri formatdagi ma’lumotlardan himoya qiladi.
4. **CORS Siyosati**: Faqat ruxsat etilgan domenlar uchun sozlanadi.
5. **No Secrets in Frontend**: Barcha maxfiy kalitlar faqat server `.env` faylida saqlanadi.

---

## 🌐 Production Deploy Ko‘rsatmasi

### Docker orqali ishga tushirish (Tavsiya etiladi)
```bash
# Docker orqali build va run
docker compose up -d --build
```

### Manual Deploy (Nginx + PM2)
1. **Backend**:
   ```bash
   cd backend
   npm run build
   pm2 start dist/server.js --name "zavero-backend"
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm run build
   # Nginx /var/www/zavero papkasiga dist/ ni yo'naltiring
   ```

---
© 2026 **ZAVERO Technologies Inc.** Barcha huquqlar himoyalangan.
