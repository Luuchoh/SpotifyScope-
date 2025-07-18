import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { cacheService } from '@/services/cacheService.js';
import { logger } from '@/config/logger.js';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check for token in Authorization header or cookies
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies?.['auth_token'];
    
    const token = headerToken || cookieToken;

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any;
    
    // Check if session exists in cache
    const sessionData = await cacheService.getUserSession(decoded.userId);
    
    if (!sessionData) {
      res.status(401).json({ error: 'Session expired' });
      return;
    }

    // Update last activity
    await cacheService.setUserSession(decoded.userId, {
      ...sessionData,
      lastActivity: new Date(),
    });

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
    } else {
      logger.error('Authentication error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  jwt.verify(token, process.env['JWT_SECRET'] || '', (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};
