import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Verify DATABASE_URL format for Accelerate
if (!process.env.DATABASE_URL?.startsWith('prisma://')) {
  throw new Error('DATABASE_URL must be a Prisma Accelerate connection string');
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Enable query logging in development
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
