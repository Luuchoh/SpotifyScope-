import redisClient from '@/config/redis.js';
import { logger } from '@/config/logger.js';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class CacheService {
  private static instance: CacheService;
  private defaultTTL = 3600; // 1 hour

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private getKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}:${key}` : key;
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      if (!redisClient?.isReady) {
        return null;
      }

      const fullKey = this.getKey(key, options.prefix);
      const value = await redisClient.get(fullKey);
      
      if (value) {
        return JSON.parse(value) as T;
      }
      
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!redisClient?.isReady) {
        return false;
      }

      const fullKey = this.getKey(key, options.prefix);
      const ttl = options.ttl || this.defaultTTL;
      
      await redisClient.setEx(fullKey, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!redisClient?.isReady) {
        return false;
      }

      const fullKey = this.getKey(key, options.prefix);
      await redisClient.del(fullKey);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!redisClient?.isReady) {
        return false;
      }

      const fullKey = this.getKey(key, options.prefix);
      const result = await redisClient.exists(fullKey);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  async flush(pattern?: string): Promise<boolean> {
    try {
      if (!redisClient?.isReady) {
        return false;
      }

      if (pattern) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } else {
        await redisClient.flushAll();
      }
      
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  // Specific cache methods for SpotifyScope
  async getSpotifyData<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
    const key = `spotify:${endpoint}:${JSON.stringify(params || {})}`;
    return this.get<T>(key, { ttl: 3600 }); // 1 hour TTL
  }

  async setSpotifyData<T>(endpoint: string, data: T, params?: Record<string, any>): Promise<boolean> {
    const key = `spotify:${endpoint}:${JSON.stringify(params || {})}`;
    return this.set(key, data, { ttl: 3600 }); // 1 hour TTL
  }

  async getUserAnalytics<T>(userId: string, dataType: string, timeRange?: string): Promise<T | null> {
    const key = `analytics:${userId}:${dataType}:${timeRange || 'all'}`;
    return this.get<T>(key, { ttl: 21600 }); // 6 hours TTL
  }

  async setUserAnalytics<T>(userId: string, dataType: string, data: T, timeRange?: string): Promise<boolean> {
    const key = `analytics:${userId}:${dataType}:${timeRange || 'all'}`;
    return this.set(key, data, { ttl: 21600 }); // 6 hours TTL
  }

  async getUserSession<T>(userId: string): Promise<T | null> {
    const key = `session:${userId}`;
    return this.get<T>(key, { ttl: 86400 }); // 24 hours TTL
  }

  async setUserSession<T>(userId: string, data: T): Promise<boolean> {
    const key = `session:${userId}`;
    return this.set(key, data, { ttl: 86400 }); // 24 hours TTL
  }

  async clearUserData(userId: string): Promise<boolean> {
    return this.flush(`*:${userId}:*`);
  }
}

export const cacheService = CacheService.getInstance();
