import axios from 'axios';
import { logger } from '@/config/logger.js';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com/api';

export interface SpotifyTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env['SPOTIFY_CLIENT_ID'] || '';
    this.clientSecret = process.env['SPOTIFY_CLIENT_SECRET'] || '';
  }


  // Authorization Code Flow for Personal Mode
  async exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(`${SPOTIFY_ACCOUNTS_BASE_URL}/token`, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env['SPOTIFY_REDIRECT_URI'] || '',
        }).toString(),
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(`${SPOTIFY_ACCOUNTS_BASE_URL}/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      throw error;
    }
  }

  async getUserProfile(accessToken: string): Promise<SpotifyUser> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

}
