import { Request, Response, NextFunction } from 'express';

export const validateSpotifyCallback = (req: Request, res: Response, next: NextFunction): void => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Authorization code is required' });
    return;
  }

  if (!state || typeof state !== 'string') {
    res.status(400).json({ error: 'State parameter is required' });
    return;
  }

  next();
};

export const validateTimeRange = (req: Request, res: Response, next: NextFunction): void => {
  const { time_range } = req.query;
  const validTimeRanges = ['short_term', 'medium_term', 'long_term'];

  if (time_range && !validTimeRanges.includes(time_range as string)) {
    res.status(400).json({ 
      error: 'Invalid time_range. Must be one of: short_term, medium_term, long_term' 
    });
    return;
  }

  next();
};

export const validateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const { limit } = req.query;

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      res.status(400).json({ 
        error: 'Invalid limit. Must be a number between 1 and 50' 
      });
      return;
    }
  }

  next();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidSpotifyId = (spotifyId: string): boolean => {
  return typeof spotifyId === 'string' && spotifyId.length > 0;
};
