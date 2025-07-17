import { Request, Response } from 'express';
import { logger } from '@/config/logger.js';

export const spotifyLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'user-library-read'
    ];

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${process.env['SPOTIFY_CLIENT_ID']}&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `redirect_uri=${encodeURIComponent(process.env['SPOTIFY_REDIRECT_URI'] || '')}&` +
      `state=${Math.random().toString(36).substring(7)}`;

    res.json({ authUrl: spotifyAuthUrl });
  } catch (error) {
    logger.error('Error in spotifyLogin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required' });
      return;
    }

    // TODO: Exchange code for access token
    // TODO: Store user data and tokens
    // TODO: Redirect to frontend with success

    res.json({ message: 'Authentication successful', code });
  } catch (error) {
    logger.error('Error in spotifyCallback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Clear session/tokens
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Error in logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
