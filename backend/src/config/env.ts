import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mirzobek@localhost:5433/zavero_db?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'zavero_super_secret_jwt_key_2026_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  NODE_ENV: process.env.NODE_ENV || 'development',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8701521409:AAGSj1eWEk_QLIH7eMUKzxxXn5LK0ED38oY',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '8873925517',
};
