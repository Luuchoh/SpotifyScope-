import { Request, Response } from 'express';
import { SpotifyService } from '@/services/spotifyService.js';
import { analyticsService } from '@/services/analyticsService.js';
import prisma from '@/config/database.js';
import { logger } from '@/config/logger.js';

const spotifyService = new SpotifyService();

// Demo Mode Endpoints (Public Access)
export const searchTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    const results = await spotifyService.searchTracks(q, Number(limit));
    res.json(results);
  } catch (error) {
    logger.error('Error in searchTracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    const results = await spotifyService.searchArtists(q, Number(limit));
    res.json(results);
  } catch (error) {
    logger.error('Error in searchArtists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrackAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackId } = req.params;
    
    if (!trackId) {
      res.status(400).json({ error: 'Track ID is required' });
      return;
    }

    const analysis = await analyticsService.analyzeTrack(trackId);
    res.json(analysis);
  } catch (error) {
    logger.error('Error in getTrackAnalysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getArtistAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artistId } = req.params;
    
    if (!artistId) {
      res.status(400).json({ error: 'Artist ID is required' });
      return;
    }

    const analysis = await analyticsService.analyzeArtist(artistId);
    res.json(analysis);
  } catch (error) {
    logger.error('Error in getArtistAnalysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackId } = req.params;
    
    if (!trackId) {
      res.status(400).json({ error: 'Track ID is required' });
      return;
    }

    const track = await spotifyService.getTrack(trackId);
    res.json(track);
  } catch (error) {
    logger.error('Error in getTrack:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artistId } = req.params;
    
    if (!artistId) {
      res.status(400).json({ error: 'Artist ID is required' });
      return;
    }

    const artist = await spotifyService.getArtist(artistId);
    res.json(artist);
  } catch (error) {
    logger.error('Error in getArtist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Personal Mode Endpoints (Require Authentication)
export const getUserTopTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { time_range = 'medium_term', limit = 20 } = req.query;
    
    if (!userId) {
      logger.warn('Unauthorized access attempt to getUserTopTracks - no userId');
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User ID is missing from the request',
        code: 'UNAUTHORIZED'
      });
      return;
    }

    logger.info(`Fetching top tracks for user ${userId}`, { time_range, limit });
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, accessToken: true, refreshToken: true }
    });

    if (!user) {
      logger.warn(`User not found: ${userId}`);
      res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    if (!user.accessToken) {
      logger.warn(`No access token for user: ${userId}`);
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'No valid access token. Please re-authenticate.',
        code: 'INVALID_ACCESS_TOKEN'
      });
      return;
    }

    try {
      const analysis = await analyticsService.getUserTopTracksAnalysis(
        userId,
        user.accessToken,
        time_range as string
      );
      
      res.json(analysis);
    } catch (error: any) {
      logger.error('Error in getUserTopTracksAnalysis:', {
        error: error.message,
        stack: error.stack,
        userId,
        time_range,
        hasAccessToken: !!user.accessToken
      });
      
      // Handle specific error cases
      if (error.status === 401) {
        res.status(401).json({ 
          error: 'Session expired',
          message: 'Your session has expired. Please log in again.',
          code: 'SESSION_EXPIRED'
        });
      } else if (error.status === 429) {
        // Rate limiting from Spotify
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      } else {
        // Generic error response
        res.status(500).json({
          error: 'Failed to fetch top tracks',
          message: 'An error occurred while processing your request.',
          code: 'INTERNAL_SERVER_ERROR',
          details: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
      }
    }
  } catch (error) {
    logger.error('Unexpected error in getUserTopTracks controller:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: (req as any).user?.userId || 'unknown'
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred.',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const getUserTopArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { time_range = 'medium_term', limit = 20 } = req.query;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'No valid access token' });
      return;
    }

    const topArtists = await spotifyService.getUserTopArtists(
      user.accessToken,
      time_range as string,
      Number(limit)
    );
    
    res.json(topArtists);
  } catch (error) {
    logger.error('Error in getUserTopArtists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserAnalytics = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  
  if (!userId) {
    logger.warn('Unauthorized access attempt to getUserAnalytics - no userId');
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'User ID is missing from the request',
      code: 'UNAUTHORIZED'
    });
    return;
  }

  logger.info(`Fetching analytics for user ${userId}`);
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, accessToken: true, refreshToken: true }
    });

    if (!user) {
      logger.warn(`User not found when fetching analytics: ${userId}`);
      res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    if (!user.accessToken) {
      logger.warn(`No access token for user when fetching analytics: ${userId}`);
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'No valid access token. Please log in again.',
        code: 'INVALID_ACCESS_TOKEN'
      });
      return;
    }

    try {
      logger.debug(`Generating analytics for user ${userId}`);
      const analytics = await analyticsService.generateUserAnalytics(userId, user.accessToken);
      
      if (!analytics) {
        logger.warn(`No analytics data generated for user: ${userId}`);
        res.status(200).json({
          message: 'Not enough data to generate analytics',
          topGenres: [],
          audioFeaturesSummary: { averages: {}, distributions: {} },
          listeningPatterns: { timeOfDay: {}, dayOfWeek: {}},
          diversityScore: 0,
          moodProfile: {
            happy: 0,
            energetic: 0,
            danceable: 0,
            acoustic: 0,
            instrumental: 0
          }
        });
        return;
      }
      
      res.json(analytics);
    } catch (error: any) {
      logger.error('Error in generateUserAnalytics:', {
        error: error.message,
        stack: error.stack,
        userId,
        hasAccessToken: !!user.accessToken
      });
      
      // Handle specific error cases
      if (error.status === 401) {
        res.status(401).json({ 
          error: 'Session expired',
          message: 'Your session has expired. Please log in again.',
          code: 'SESSION_EXPIRED'
        });
      } else if (error.status === 429) {
        // Rate limiting from Spotify
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      } else if (error.message?.includes('insufficient data')) {
        res.status(200).json({
          message: 'Not enough data to generate analytics',
          topGenres: [],
          audioFeaturesSummary: { averages: {}, distributions: {} },
          listeningPatterns: { timeOfDay: {}, dayOfWeek: {}},
          diversityScore: 0,
          moodProfile: {
            happy: 0,
            energetic: 0,
            danceable: 0,
            acoustic: 0,
            instrumental: 0
          }
        });
      } else {
        // Generic error response
        res.status(500).json({
          error: 'Failed to generate analytics',
          message: 'An error occurred while generating your analytics.',
          code: 'INTERNAL_SERVER_ERROR',
          details: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
      }
    }
  } catch (error) {
    logger.error('Unexpected error in getUserAnalytics controller:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: (req as any).user?.userId || 'unknown'
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request.',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const getUserRecentlyPlayed = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { limit = 50 } = req.query;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'No valid access token' });
      return;
    }

    const recentlyPlayed = await spotifyService.getUserRecentlyPlayed(
      user.accessToken,
      Number(limit)
    );
    
    res.json(recentlyPlayed);
  } catch (error) {
    logger.error('Error in getUserRecentlyPlayed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserRecommendations = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  
  if (!userId) {
    logger.warn('Unauthorized access attempt to getUserRecommendations - no userId');
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'User ID is missing from the request',
      code: 'UNAUTHORIZED'
    });
    return;
  }

  logger.info(`Generating recommendations for user ${userId}`);
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, accessToken: true, refreshToken: true }
    });

    if (!user) {
      logger.warn(`User not found when generating recommendations: ${userId}`);
      res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    if (!user.accessToken) {
      logger.warn(`No access token for user when generating recommendations: ${userId}`);
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'No valid access token. Please log in again.',
        code: 'INVALID_ACCESS_TOKEN'
      });
      return;
    }

    try {
      const recommendations = await analyticsService.generateRecommendations(userId, user.accessToken);
      
      if (!recommendations || !recommendations.tracks || !recommendations.tracks.length) {
        logger.warn('No recommendations generated', { userId });
        res.status(200).json({
          message: 'Not enough data to generate recommendations',
          tracks: [],
          seeds: []
        });
        return;
      }
      
      res.json(recommendations);
    } catch (error: any) {
      logger.error('Error generating recommendations:', {
        error: error.message,
        stack: error.stack,
        userId,
        hasAccessToken: !!user.accessToken
      });
      
      // Handle specific error cases
      if (error.status === 401) {
        res.status(401).json({ 
          error: 'Session expired',
          message: 'Your session has expired. Please log in again.',
          code: 'SESSION_EXPIRED'
        });
      } else if (error.status === 429) {
        // Rate limiting from Spotify
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      } else if (error.message?.includes('insufficient data')) {
        res.status(200).json({
          message: 'Not enough data to generate recommendations',
          tracks: [],
          seeds: []
        });
      } else {
        // Generic error response
        res.status(500).json({
          error: 'Failed to generate recommendations',
          message: 'An error occurred while generating recommendations.',
          code: 'INTERNAL_SERVER_ERROR',
          details: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
      }
    }
  } catch (error) {
    logger.error('Unexpected error in getUserRecommendations controller:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: (req as any).user?.userId || 'unknown'
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request.',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const getUserPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { limit = 50 } = req.query;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'No valid access token' });
      return;
    }

    const playlists = await spotifyService.getUserPlaylists(
      user.accessToken,
      Number(limit)
    );
    
    res.json(playlists);
  } catch (error) {
    logger.error('Error in getUserPlaylists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
