import axios from 'axios';
import { logger } from '@/config/logger.js';
import { cacheService } from './cacheService.js';

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
  private clientCredentialsToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.clientId = process.env['SPOTIFY_CLIENT_ID'] || '';
    this.clientSecret = process.env['SPOTIFY_CLIENT_SECRET'] || '';
  }

  // Client Credentials Flow for Demo Mode (public data)
  async getClientCredentialsToken(): Promise<string> {
    try {
      // Check if we have a valid cached token
      if (this.clientCredentialsToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.clientCredentialsToken;
      }

      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(`${SPOTIFY_ACCOUNTS_BASE_URL}/token`, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in } = response.data;
      this.clientCredentialsToken = access_token;
      this.tokenExpiry = new Date(Date.now() + (expires_in * 1000) - 60000); // 1 minute buffer
      
      return access_token;
    } catch (error) {
      logger.error('Error getting client credentials token:', error);
      throw error;
    }
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

  async getUserTopTracks(accessToken: string, timeRange = 'medium_term', limit = 20): Promise<any> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/top/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: timeRange,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting user top tracks:', error);
      throw error;
    }
  }

  async getUserTopArtists(accessToken: string, timeRange = 'medium_term', limit = 20): Promise<any> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/top/artists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: timeRange,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting user top artists:', error);
      throw error;
    }
  }

  /**
   * Get audio features for multiple tracks (handles more than 100 tracks by batching)
   * @param accessToken User's access token
   * @param trackIds Array of track IDs (max 100 per batch)
   * @returns Object with audio_features array
   */
  async getAudioFeatures(accessToken: string, trackIds: string[]): Promise<{ audio_features: (AudioFeatures | null)[] }> {
    try {
      if (!trackIds.length) {
        return { audio_features: [] };
      }

      // Create a cache key for this specific set of track IDs
      const sortedTrackIds = [...trackIds].sort();
      const cacheKey = `audio-features:${sortedTrackIds.join(',')}`;
      
      // Try to get from cache first
      const cached = await cacheService.getSpotifyData<{ audio_features: (AudioFeatures | null)[] }>(cacheKey);
      if (cached) {
        logger.debug(`Returning cached audio features for ${trackIds.length} tracks`);
        return cached;
      }

      // Spotify has a limit of 100 track IDs per request
      const BATCH_SIZE = 100;
      const batches: string[][] = [];
      
      // Split track IDs into batches of 100
      for (let i = 0; i < trackIds.length; i += BATCH_SIZE) {
        batches.push(trackIds.slice(i, i + BATCH_SIZE));
      }

      logger.debug(`Fetching audio features in ${batches.length} batches`);
      
      // Process each batch in parallel
      const batchPromises = batches.map(async (batch) => {
        try {
          const response = await axios.get<{ audio_features: (AudioFeatures | null)[] }>(
            `${SPOTIFY_API_BASE_URL}/audio-features`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { ids: batch.join(',') },
              timeout: 10000 // 10 seconds timeout per request
            }
          );
          return response.data.audio_features || [];
        } catch (error: any) {
          logger.error(`Error fetching audio features for batch:`, {
            error: error.message,
            batchSize: batch.length,
            firstTrackId: batch[0],
            status: error.response?.status
          });
          // Return null for each track in the failed batch
          return batch.map(() => null);
        }
      });

      // Wait for all batches to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Flatten the results into a single array
      const audioFeatures = batchResults.flat();
      
      // Create the response in the expected format
      const result = { audio_features: audioFeatures };
      
      // Cache the result (only if we have features)
      if (audioFeatures.some(f => f !== null)) {
        try {
          await cacheService.setSpotifyData(cacheKey, result, { ttl: 3600 }); // Cache for 1 hour
        } catch (cacheError) {
          logger.error('Error caching audio features:', cacheError);
          // Don't fail the request if caching fails
        }
      }
      
      return result;
    } catch (error) {
      logger.error('Error getting audio features:', error);
      throw error;
    }
  }

  // Demo Mode Methods (using Client Credentials)
  async searchTracks(query: string, limit = 20): Promise<any> {
    try {
      const cacheKey = `search:tracks:${query}:${limit}`;
      const cached = await cacheService.getSpotifyData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const token = await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit,
        },
      });

      await cacheService.setSpotifyData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error searching tracks:', error);
      throw error;
    }
  }

  async searchArtists(query: string, limit = 20): Promise<any> {
    try {
      const cacheKey = `search:artists:${query}:${limit}`;
      const cached = await cacheService.getSpotifyData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const token = await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'artist',
          limit,
        },
      });

      await cacheService.setSpotifyData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error searching artists:', error);
      throw error;
    }
  }

  async getTrack(trackId: string): Promise<any> {
    try {
      const cacheKey = `track:${trackId}`;
      const cached = await cacheService.getSpotifyData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const token = await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await cacheService.setSpotifyData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error getting track:', error);
      throw error;
    }
  }

  async getArtist(artistId: string): Promise<any> {
    try {
      const cacheKey = `artist:${artistId}`;
      const cached = await cacheService.getSpotifyData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const token = await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await cacheService.setSpotifyData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error getting artist:', error);
      throw error;
    }
  }

  async getArtistTopTracks(artistId: string, country = 'US'): Promise<any> {
    try {
      const cacheKey = `artist-top-tracks:${artistId}:${country}`;
      const cached = await cacheService.getSpotifyData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const token = await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/artists/${artistId}/top-tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          country,
        },
      });

      await cacheService.setSpotifyData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error getting artist top tracks:', error);
      throw error;
    }
  }

  // Personal Mode Methods (require user access token)
  async getUserRecentlyPlayed(accessToken: string, limit = 50): Promise<any> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/player/recently-played`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting recently played:', error);
      throw error;
    }
  }

  async getUserPlaylists(accessToken: string, limit = 50): Promise<any> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting user playlists:', error);
      throw error;
    }
  }

  async getUserSavedTracks(accessToken: string, limit = 50, offset = 0): Promise<any> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
          offset,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting saved tracks:', error);
      throw error;
    }
  }

  // Analytics helper methods
  async getTrackAudioFeatures(trackId: string, accessToken?: string): Promise<AudioFeatures> {
    try {
      const token = accessToken || await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/audio-features/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting track audio features:', error);
      throw error;
    }
  }

  async getMultipleArtists(artistIds: string[], accessToken?: string): Promise<any> {
    try {
      const token = accessToken || await this.getClientCredentialsToken();
      const response = await axios.get(`${SPOTIFY_API_BASE_URL}/artists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: artistIds.join(','),
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting multiple artists:', error);
      throw error;
    }
  }
}
