import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SpotifyService } from '@/services/spotifyService.js';
import { cacheService } from '@/services/cacheService.js';
import prisma from '@/config/database.js';
import { logger } from '@/config/logger.js';

const spotifyService = new SpotifyService();

export const spotifyLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'user-library-read',
      'user-read-playback-state',
      'user-read-currently-playing'
    ];

    const state = Math.random().toString(36).substring(7);
    
    // Store state in cache for validation
    await cacheService.set(`auth:state:${state}`, { timestamp: Date.now() }, { ttl: 600 }); // 10 minutes

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${process.env['SPOTIFY_CLIENT_ID']}&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `redirect_uri=${encodeURIComponent(process.env['SPOTIFY_REDIRECT_URI'] || '')}&` +
      `state=${state}`;

    res.json({ authUrl: spotifyAuthUrl });
  } catch (error) {
    logger.error('Error in spotifyLogin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state, error } = req.query;

    // Handle authorization errors
    if (error) {
      logger.warn('Spotify authorization error:', error);
      return res.redirect(`${process.env['FRONTEND_URL']}/auth/error?error=${error}`);
    }

    if (!code || !state) {
      return res.redirect(`${process.env['FRONTEND_URL']}/auth/error?error=missing_parameters`);
    }

    // Validate state parameter
    const stateData = await cacheService.get(`auth:state:${state}`);
    if (!stateData) {
      return res.redirect(`${process.env['FRONTEND_URL']}/auth/error?error=invalid_state`);
    }

    // Clean up state
    await cacheService.del(`auth:state:${state}`);

    // Exchange code for tokens
    const tokens = await spotifyService.exchangeCodeForTokens(code as string);
    
    // Get user profile
    const userProfile = await spotifyService.getUserProfile(tokens.access_token);

    // Store or update user in database
    const tokenExpiry = new Date(Date.now() + (tokens.expires_in * 1000));
    
    const user = await prisma.user.upsert({
      where: { spotifyId: userProfile.id },
      update: {
        email: userProfile.email,
        displayName: userProfile.display_name,
        profileImage: userProfile.images?.[0]?.url || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenExpiry,
        updatedAt: new Date(),
      },
      create: {
        spotifyId: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        profileImage: userProfile.images?.[0]?.url || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenExpiry,
      },
    });

    // Generate JWT
    const jwtPayload = {
      userId: user.id,
      spotifyId: user.spotifyId,
      email: user.email,
      displayName: user.displayName,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env['JWT_SECRET'] || 'fallback-secret', {
      expiresIn: '7d',
    });

    // Store session data in cache
    await cacheService.setUserSession(user.id, {
      ...jwtPayload,
      tokenExpiry,
      lastActivity: new Date(),
    });

    // Set httpOnly cookie
    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: '127.0.0.1',
      path: '/',
    });

    // Redirect to frontend dashboard
    res.redirect(`${process.env['FRONTEND_URL']}/dashboard?auth=success`);
  } catch (error) {
    logger.error('Error in spotifyCallback:', error);
    res.redirect(`${process.env['FRONTEND_URL']}/auth/error?error=server_error`);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    if (userId) {
      // Clear user session from cache
      await cacheService.clearUserData(userId);
      
      // Optionally clear tokens from database (for security)
      await prisma.user.update({
        where: { id: userId },
        data: {
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
        },
      });
    }

    // Clear cookie
    res.clearCookie('auth_token');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Error in logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        spotifyId: true,
        email: true,
        displayName: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    logger.error('Error in getProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      res.status(401).json({ error: 'No refresh token available' });
      return;
    }

    // Check if access token is still valid
    if (user.tokenExpiry && new Date() < user.tokenExpiry) {
      res.json({ message: 'Token still valid' });
      return;
    }

    // Refresh the token
    const newTokens = await spotifyService.refreshAccessToken(user.refreshToken);
    const newExpiry = new Date(Date.now() + (newTokens.expires_in * 1000));

    // Update user with new tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || user.refreshToken,
        tokenExpiry: newExpiry,
      },
    });

    // Update session cache
    await cacheService.setUserSession(userId, {
      userId: user.id,
      spotifyId: user.spotifyId,
      email: user.email,
      displayName: user.displayName,
      tokenExpiry: newExpiry,
      lastActivity: new Date(),
    });

    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};
