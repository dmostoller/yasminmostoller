import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create Prisma Client
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });
}

// Initialize singleton
export const prisma = globalThis.prisma || createPrismaClient();

// Save reference in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
