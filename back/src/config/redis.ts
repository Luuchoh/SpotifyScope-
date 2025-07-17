import { createClient, RedisClientType } from 'redis';
import { logger } from '@/config/logger.js';

let redisClient: RedisClientType | null = null;

// Only create Redis client if REDIS_ENABLED is not explicitly set to 'false'
if (process.env['NODE_ENV'] !== 'test' && process.env['REDIS_ENABLED'] !== 'false') {
  try {
    const redisOptions: any = {
      url: process.env['REDIS_URL'] || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 3) {
            logger.warn('Max Redis reconnection attempts reached. Redis will be disabled.');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 5000);
        }
      }
    };
    
    if (process.env['REDIS_PASSWORD']) {
      redisOptions.password = process.env['REDIS_PASSWORD'];
    }
    
    redisClient = createClient(redisOptions);

    redisClient.on('error', (err: any) => {
      if (err.code === 'ECONNREFUSED') {
        logger.warn('Redis connection refused. Running without Redis.');
        redisClient = null;
      } else {
        logger.error('Redis Client Error:', err);
      }
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    // Attempt to connect but don't block the application start
    redisClient.connect().catch(() => {
    // Connection errors are already handled by the error event
    });
  } catch (error) {
    logger.warn('Failed to initialize Redis. Running without Redis.');
    redisClient = null;
  }
} else {
  logger.info('Redis is disabled by configuration');
}

export default redisClient;
