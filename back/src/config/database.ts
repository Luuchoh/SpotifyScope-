import { PrismaClient } from '@prisma/client';
import { logger } from '@/config/logger.js';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env['NODE_ENV'] === 'development') {
  globalThis.__prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Test database connection
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error: Error) => {
    logger.error('Database connection failed:', error);
  });

export default prisma;
