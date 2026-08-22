import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../env';
import { PrismaClient } from './generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = new URL(env.DATABASE_URL);

console.log('Prisma database host:', dbUrl.hostname);
console.log('Prisma database port:', dbUrl.port);
console.log('Prisma database name:', dbUrl.pathname);

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.DATABASE_URL,
    }),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };
