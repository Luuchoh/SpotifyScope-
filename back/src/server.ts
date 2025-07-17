import dotenv from 'dotenv';
import app from '@/app.js';
import { logger } from '@/config/logger.js';
import redisClient from '@/config/redis.js';

// Load environment variables
dotenv.config();

const PORT = process.env['PORT'] || 3001;

// Initialize Redis connection if available
const initializeRedis = async (): Promise<boolean> => {
  if (!redisClient) {
    logger.warn('Redis is not configured. Running without Redis.');
    return false;
  }

  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
    return true;
  } catch (error) {
    logger.warn('Failed to connect to Redis. Running without Redis:', error);
    return false;
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    const redisConnected = await initializeRedis();
    
    if (!redisConnected) {
      logger.warn('Running without Redis. Some features may be limited.');
    }
    
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    await disconnectRedis();
    process.exit(1);
  }
};

// Helper function to safely disconnect Redis
const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.disconnect();
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
    }
  }
};

// Handle graceful shutdown
const handleShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, shutting down gracefully`);
  await disconnectRedis();
  process.exit(0);
};

// Set up signal handlers
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Start the server
startServer().catch(async (error) => {
  logger.error('Unhandled error in server startup:', error);
  await disconnectRedis();
  process.exit(1);
});
