import { SpotifyService, AudioFeatures } from './spotifyService.js';
import { cacheService } from './cacheService.js';
import prisma from '@/config/database.js';
import { logger } from '@/config/logger.js';

export interface MusicAnalytics {
  topGenres: Array<{ genre: string; count: number; percentage: number }>;
  audioFeaturesSummary: {
    averages: Partial<AudioFeatures>;
    distributions: Record<string, number[]>;
  };
  listeningPatterns: {
    timeOfDay: Record<string, number>;
    dayOfWeek: Record<string, number>;
  };
  diversityScore: number;
  moodProfile: {
    happy: number;
    energetic: number;
    danceable: number;
    acoustic: number;
    instrumental: number;
  };
}

export interface TrackInsight {
  id: string;
  name: string;
  artist: string;
  popularity: number;
  audioFeatures: AudioFeatures;
  genres: string[];
  recommendations?: string[];
}

export class AnalyticsService {
  private spotifyService: SpotifyService;

  constructor() {
    this.spotifyService = new SpotifyService();
  }

  // Demo Mode Analytics (public data)
  async analyzeTrack(trackId: string): Promise<TrackInsight> {
    try {
      const cacheKey = `track-analysis:${trackId}`;
      const cached = await cacheService.get<TrackInsight>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const [track, audioFeatures] = await Promise.all([
        this.spotifyService.getTrack(trackId),
        this.spotifyService.getTrackAudioFeatures(trackId)
      ]);

      const artist = await this.spotifyService.getArtist(track.artists[0].id);

      const insight: TrackInsight = {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        popularity: track.popularity,
        audioFeatures,
        genres: artist.genres || [],
      };

      await cacheService.set(cacheKey, insight, { ttl: 3600 });
      return insight;
    } catch (error) {
      logger.error('Error analyzing track:', error);
      throw error;
    }
  }

  async analyzeArtist(artistId: string): Promise<any> {
    try {
      const cacheKey = `artist-analysis:${artistId}`;
      const cached = await cacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const [artist, topTracks] = await Promise.all([
        this.spotifyService.getArtist(artistId),
        this.spotifyService.getArtistTopTracks(artistId)
      ]);

      // Get audio features for top tracks
      const trackIds = topTracks.tracks.slice(0, 10).map((track: any) => track.id);
      const audioFeaturesResponse = await this.spotifyService.getAudioFeatures('', trackIds);
      const audioFeatures = audioFeaturesResponse.audio_features.filter(Boolean);

      const analysis = {
        artist: {
          id: artist.id,
          name: artist.name,
          popularity: artist.popularity,
          followers: artist.followers.total,
          genres: artist.genres,
        },
        audioProfile: this.calculateAudioProfile(audioFeatures),
        topTracks: topTracks.tracks.slice(0, 5).map((track: any) => ({
          id: track.id,
          name: track.name,
          popularity: track.popularity,
        })),
      };

      await cacheService.set(cacheKey, analysis, { ttl: 3600 });
      return analysis;
    } catch (error) {
      logger.error('Error analyzing artist:', error);
      throw error;
    }
  }

  // Personal Mode Analytics (user data)
  async generateUserAnalytics(userId: string, accessToken: string): Promise<MusicAnalytics> {
    try {
      const cacheKey = `user-analytics:${userId}`;
      const cached = await cacheService.getUserAnalytics<MusicAnalytics>(userId, 'full-analytics');
      
      if (cached) {
        logger.info(`Returning cached analytics for user ${userId}`);
        return cached;
      }

      logger.info(`Generating fresh analytics for user ${userId}`);
      
      // Add validation for access token
      if (!accessToken) {
        const error = new Error('No access token provided');
        (error as any).status = 401;
        throw error;
      }

      let topTracks, topArtists, recentlyPlayed;
      
      try {
        [topTracks, topArtists, recentlyPlayed] = await Promise.all([
          this.spotifyService.getUserTopTracks(accessToken, 'medium_term', 50),
          this.spotifyService.getUserTopArtists(accessToken, 'medium_term', 50),
          this.spotifyService.getUserRecentlyPlayed(accessToken, 50)
        ]);
      } catch (error: any) {
        logger.error('Error fetching data from Spotify API:', {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(`Failed to fetch data from Spotify: ${error.message}`);
      }

      // Validate we have data to work with
      if (!topTracks?.items?.length || !topArtists?.items?.length) {
        const error = new Error('Insufficient data from Spotify to generate analytics');
        (error as any).status = 400;
        throw error;
      }

      // Get audio features for top tracks
      const trackIds = topTracks.items.map((track: any) => track.id);
      let audioFeaturesResponse;
      try {
        audioFeaturesResponse = await this.spotifyService.getAudioFeatures(accessToken, trackIds);
      } catch (error: any) {
        logger.error('Error fetching audio features:', {
          error: error.message,
          trackCount: trackIds.length,
          firstTrackId: trackIds[0]
        });
        throw new Error(`Failed to fetch audio features: ${error.message}`);
      }
      
      const audioFeatures = audioFeaturesResponse.audio_features.filter(Boolean);

      if (!audioFeatures.length) {
        logger.warn('No valid audio features returned for tracks', { trackCount: trackIds.length });
      }

      // Analyze genres
      const genreCount: Record<string, number> = {};
      topArtists.items.forEach((artist: any) => {
        if (artist.genres?.length) {
          artist.genres.forEach((genre: string) => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        }
      });

      const totalGenres = Object.values(genreCount).reduce((sum, count) => sum + count, 0);
      const topGenres = Object.entries(genreCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([genre, count]) => ({
          genre,
          count,
          percentage: Math.round((count / (totalGenres || 1)) * 100) // Avoid division by zero
        }));

      // Calculate audio features summary
      const audioFeaturesSummary = audioFeatures.length 
        ? this.calculateAudioFeaturesSummary(audioFeatures)
        : { averages: {}, distributions: {} };

      // Analyze listening patterns (from recently played)
      const listeningPatterns = recentlyPlayed?.items?.length 
        ? this.analyzeListeningPatterns(recentlyPlayed.items)
        : { timeOfDay: {}, dayOfWeek: {} };

      // Calculate diversity score (only if we have data)
      const diversityScore = audioFeatures.length && topGenres.length
        ? this.calculateDiversityScore(topGenres, audioFeatures)
        : 0;

      // Generate mood profile (only if we have audio features)
      const moodProfile = audioFeatures.length 
        ? this.generateMoodProfile(audioFeatures)
        : { happy: 0, energetic: 0, danceable: 0, acoustic: 0, instrumental: 0 };

      const analytics: MusicAnalytics = {
        topGenres,
        audioFeaturesSummary,
        listeningPatterns,
        diversityScore,
        moodProfile,
      };

      try {
        // Store in database
        await this.storeAnalyticsSnapshot(userId, 'full-analytics', analytics);
        // Cache the result
        await cacheService.setUserAnalytics(userId, 'full-analytics', analytics);
      } catch (error) {
        // Don't fail the request if caching fails, just log it
        logger.error('Error caching analytics:', error);
      }

      return analytics;
    } catch (error: any) {
      logger.error('Error in generateUserAnalytics:', {
        error: error.message,
        stack: error.stack,
        userId,
        hasAccessToken: !!accessToken
      });
      
      // Re-throw with status code if available
      if (error.status) {
        const err = new Error(error.message);
        (err as any).status = error.status;
        throw err;
      }
      
      throw error;
    }
  }

  async getUserTopTracksAnalysis(userId: string, accessToken: string, timeRange = 'medium_term'): Promise<any> {
    try {
      const cached = await cacheService.getUserAnalytics(userId, 'top-tracks', timeRange);
      
      if (cached) {
        return cached;
      }

      const topTracks = await this.spotifyService.getUserTopTracks(accessToken, timeRange, 50);
      const trackIds = topTracks.items.map((track: any) => track.id);
      const audioFeaturesResponse = await this.spotifyService.getAudioFeatures(accessToken, trackIds);
      const audioFeatures = audioFeaturesResponse.audio_features.filter(Boolean);

      const analysis = {
        tracks: topTracks.items.map((track: any, index: number) => ({
          ...track,
          audioFeatures: audioFeatures[index] || null,
          rank: index + 1,
        })),
        summary: this.calculateAudioProfile(audioFeatures),
        timeRange,
        generatedAt: new Date().toISOString(),
      };

      await this.storeAnalyticsSnapshot(userId, 'top-tracks', analysis, timeRange);
      await cacheService.setUserAnalytics(userId, 'top-tracks', analysis, timeRange);

      return analysis;
    } catch (error) {
      logger.error('Error analyzing user top tracks:', error);
      throw error;
    }
  }

  // Helper methods
  private calculateAudioProfile(audioFeatures: AudioFeatures[]): any {
    if (!audioFeatures.length) return null;

    const features = ['danceability', 'energy', 'valence', 'acousticness', 'instrumentalness', 'speechiness'];
    const profile: any = {};

    features.forEach(feature => {
      const values = audioFeatures.map(af => af[feature as keyof AudioFeatures] as number);
      profile[feature] = {
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        distribution: this.calculateDistribution(values),
      };
    });

    return profile;
  }

  private calculateAudioFeaturesSummary(audioFeatures: AudioFeatures[]): MusicAnalytics['audioFeaturesSummary'] {
    if (!audioFeatures.length) {
      return { averages: {}, distributions: {} };
    }

    const features = ['danceability', 'energy', 'valence', 'acousticness', 'instrumentalness', 'speechiness', 'tempo'];
    const averages: Partial<AudioFeatures> = {};
    const distributions: Record<string, number[]> = {};

    features.forEach(feature => {
      const values = audioFeatures.map(af => af[feature as keyof AudioFeatures] as number);
      averages[feature as keyof AudioFeatures] = values.reduce((sum, val) => sum + val, 0) / values.length;
      distributions[feature] = this.calculateDistribution(values);
    });

    return { averages, distributions };
  }

  private calculateDistribution(values: number[]): number[] {
    const bins = 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;
    const distribution = new Array(bins).fill(0);

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      distribution[binIndex]++;
    });

    return distribution;
  }

  private analyzeListeningPatterns(recentTracks: any[]): MusicAnalytics['listeningPatterns'] {
    const timeOfDay: Record<string, number> = {
      'morning': 0, 'afternoon': 0, 'evening': 0, 'night': 0
    };
    const dayOfWeek: Record<string, number> = {
      'monday': 0, 'tuesday': 0, 'wednesday': 0, 'thursday': 0,
      'friday': 0, 'saturday': 0, 'sunday': 0
    };

    recentTracks.forEach(item => {
      const playedAt = new Date(item.played_at);
      const hour = playedAt.getHours();
      const day = playedAt.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();

      // Time of day categorization
      if (hour >= 6 && hour < 12) timeOfDay['morning']!++;
      else if (hour >= 12 && hour < 18) timeOfDay['afternoon']!++;
      else if (hour >= 18 && hour < 22) timeOfDay['evening']!++;
      else timeOfDay['night']!++;

      if (dayOfWeek[day] !== undefined) {
        dayOfWeek[day]!++;
      }
    });

    return { timeOfDay, dayOfWeek };
  }

  private calculateDiversityScore(genres: any[], audioFeatures: AudioFeatures[]): number {
    // Genre diversity (0-50 points)
    const genreScore = Math.min(genres.length * 2, 50);

    // Audio feature diversity (0-50 points)
    const features = ['danceability', 'energy', 'valence', 'acousticness'];
    const featureVariances = features.map(feature => {
      const values = audioFeatures.map(af => af[feature as keyof AudioFeatures] as number);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      return variance;
    });

    const avgVariance = featureVariances.reduce((sum, variance) => sum + variance, 0) / featureVariances.length;
    const featureScore = Math.min(avgVariance * 200, 50); // Scale to 0-50

    return Math.round(genreScore + featureScore);
  }

  private generateMoodProfile(audioFeatures: AudioFeatures[]): MusicAnalytics['moodProfile'] {
    if (!audioFeatures.length) {
      return { happy: 0, energetic: 0, danceable: 0, acoustic: 0, instrumental: 0 };
    }

    const averages = {
      valence: audioFeatures.reduce((sum, af) => sum + af.valence, 0) / audioFeatures.length,
      energy: audioFeatures.reduce((sum, af) => sum + af.energy, 0) / audioFeatures.length,
      danceability: audioFeatures.reduce((sum, af) => sum + af.danceability, 0) / audioFeatures.length,
      acousticness: audioFeatures.reduce((sum, af) => sum + af.acousticness, 0) / audioFeatures.length,
      instrumentalness: audioFeatures.reduce((sum, af) => sum + af.instrumentalness, 0) / audioFeatures.length,
    };

    return {
      happy: Math.round(averages.valence * 100),
      energetic: Math.round(averages.energy * 100),
      danceable: Math.round(averages.danceability * 100),
      acoustic: Math.round(averages.acousticness * 100),
      instrumental: Math.round(averages.instrumentalness * 100),
    };
  }

  private async storeAnalyticsSnapshot(userId: string, dataType: string, data: any, timeRange?: string): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 6); // 6 hours expiry

      await prisma.analyticsSnapshot.create({
        data: {
          userId,
          dataType,
          timeRange: timeRange || 'all',
          data: JSON.parse(JSON.stringify(data)),
          expiresAt,
        },
      });
    } catch (error) {
      logger.error('Error storing analytics snapshot:', error);
      // Don't throw - this is not critical
    }
  }

  // Predictive Analytics
  async generateRecommendations(userId: string, accessToken: string): Promise<any> {
    try {
      const analytics = await this.generateUserAnalytics(userId, accessToken);
      const topTracks = await this.spotifyService.getUserTopTracks(accessToken, 'short_term', 5);
      
      // Use top tracks as seeds for recommendations
      const seedTracks = topTracks.items.slice(0, 2).map((track: any) => track.id);
      const seedArtists = topTracks.items.slice(0, 2).map((track: any) => track.artists[0].id);
      
      // Generate recommendations based on user's audio profile
      const recommendations = await this.getSpotifyRecommendations(
        accessToken,
        seedTracks,
        seedArtists,
        analytics.audioFeaturesSummary.averages
      );

      return {
        recommendations: recommendations.tracks,
        basedOn: {
          topGenres: analytics.topGenres.slice(0, 3),
          moodProfile: analytics.moodProfile,
          seedTracks: topTracks.items.slice(0, 2),
        },
      };
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw error;
    }
  }

  private async getSpotifyRecommendations(
    accessToken: string,
    seedTracks: string[],
    seedArtists: string[],
    targetFeatures: Partial<AudioFeatures>
  ): Promise<any> {
    try {
      const params: any = {
        seed_tracks: seedTracks.join(','),
        seed_artists: seedArtists.join(','),
        limit: 20,
      };

      // Add target audio features
      if (targetFeatures.danceability) params.target_danceability = targetFeatures.danceability;
      if (targetFeatures.energy) params.target_energy = targetFeatures.energy;
      if (targetFeatures.valence) params.target_valence = targetFeatures.valence;

      const response = await this.spotifyService.getUserTopTracks(accessToken); // This should be recommendations endpoint
      return response;
    } catch (error) {
      logger.error('Error getting Spotify recommendations:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
