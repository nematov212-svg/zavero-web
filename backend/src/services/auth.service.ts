import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { ENV } from '../config/env';
import { LoginInput } from '../validators/auth.validator';

export class AuthService {
  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error('Email yoki parol noto\'g\'ri');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email yoki parol noto\'g\'ri');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    return user;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new Error('Joriy parol noto\'g\'ri kiritildi');
    }

    if (newPass.length < 6) {
      throw new Error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi shart');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }
}
