import { PrismaClient } from '@prisma/client';

// Prevent multiple PrismaClient instances in development
declare global {
  /// eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
