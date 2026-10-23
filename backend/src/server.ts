import http from 'http';
import { createApp } from './app';
import { ENV } from './config/env';
import { initSocket } from './sockets/socketHandler';
import { prisma } from './config/db';
import { TelegramService } from './services/telegram.service';

const startServer = async () => {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully');

    const app = createApp();
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = initSocket(server, ENV.CORS_ORIGIN);
    console.log('✅ Socket.io initialized for real-time notifications');

    // Initialize Telegram Notification Bot
    await TelegramService.init();

    server.listen(ENV.PORT, () => {
      console.log(`🚀 Zavero Backend running on http://localhost:${ENV.PORT}`);
      console.log(`📡 WebSocket ready on port ${ENV.PORT}`);
      console.log(`📊 Health check: http://localhost:${ENV.PORT}/api/health`);
    });

    const shutdown = async () => {
      console.log('🛑 Shutting down gracefully...');
      await prisma.$disconnect();
      server.close(() => {
        console.log('🏁 Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
