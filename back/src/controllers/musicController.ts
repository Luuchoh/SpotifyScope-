import { Request, Response } from 'express';
import { logger } from '@/config/logger.js';

export const getDemoData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Demo data for public access
    const demoData = {
      topTracks: [
        { name: 'Blinding Lights', artist: 'The Weeknd', plays: 1250000 },
        { name: 'Watermelon Sugar', artist: 'Harry Styles', plays: 980000 },
        { name: 'Levitating', artist: 'Dua Lipa', plays: 875000 }
      ],
      topArtists: [
        { name: 'The Weeknd', plays: 2500000 },
        { name: 'Dua Lipa', plays: 1800000 },
        { name: 'Harry Styles', plays: 1600000 }
      ],
      genres: [
        { name: 'Pop', percentage: 35 },
        { name: 'Rock', percentage: 25 },
        { name: 'Hip Hop', percentage: 20 },
        { name: 'Electronic', percentage: 20 }
      ]
    };

    res.json(demoData);
  } catch (error) {
    logger.error('Error in getDemoData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserTopTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Get user's top tracks from Spotify API
    res.json({ message: 'User top tracks endpoint' });
  } catch (error) {
    logger.error('Error in getUserTopTracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserTopArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Get user's top artists from Spotify API
    res.json({ message: 'User top artists endpoint' });
  } catch (error) {
    logger.error('Error in getUserTopArtists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAudioFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Get audio features analysis
    res.json({ message: 'Audio features endpoint' });
  } catch (error) {
    logger.error('Error in getAudioFeatures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
