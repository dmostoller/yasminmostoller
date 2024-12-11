import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Define the extended client type correctly
type PrismaClientWithExtensions = ReturnType<typeof createPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientWithExtensions | undefined;
}

// Verify DATABASE_URL format for Accelerate
if (!process.env.DATABASE_URL?.startsWith('prisma://')) {
  throw new Error('DATABASE_URL must be a Prisma Accelerate connection string');
}

// Create Prisma Client with Accelerate
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  }).$extends(withAccelerate());
}

// Initialize singleton
export const prisma = globalThis.prisma || createPrismaClient();

// Save reference in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
