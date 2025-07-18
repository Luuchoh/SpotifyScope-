import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Class with all endpoints
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  // Auth endpoints
  async login(): Promise<{ authUrl: string }> {
    const response = await this.api.post('/auth/spotify/login');
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  async refreshToken(): Promise<void> {
    await this.api.post('/auth/refresh');
  }

  async handleCallback(code: string, state: string): Promise<any> {
    const response = await this.api.get(`/auth/spotify/callback?code=${code}&state=${state}`);
    return response.data;
  }

  // Demo Mode endpoints (public)
  async searchTracks(query: string, limit = 20): Promise<any> {
    const response = await this.api.get('/music/search/tracks', {
      params: { q: query, limit },
    });
    return response.data;
  }

  async searchArtists(query: string, limit = 20): Promise<any> {
    const response = await this.api.get('/music/search/artists', {
      params: { q: query, limit },
    });
    return response.data;
  }

  async getTrack(trackId: string): Promise<any> {
    const response = await this.api.get(`/music/track/${trackId}`);
    return response.data;
  }

  async getTrackAnalysis(trackId: string): Promise<any> {
    const response = await this.api.get(`/music/track/${trackId}/analysis`);
    return response.data;
  }

  async getArtist(artistId: string): Promise<any> {
    const response = await this.api.get(`/music/artist/${artistId}`);
    return response.data;
  }

  async getArtistAnalysis(artistId: string): Promise<any> {
    const response = await this.api.get(`/music/artist/${artistId}/analysis`);
    return response.data;
  }

  async getDemoData(): Promise<any> {
    const response = await this.api.get('/music/demo');
    return response.data;
  }

  // Personal Mode endpoints (require auth)
  async getUserTopTracks(timeRange = 'medium_term', limit = 20): Promise<any> {
    const response = await this.api.get('/music/user/top-tracks', {
      params: { time_range: timeRange, limit },
    });
    return response.data;
  }

  async getUserTopArtists(timeRange = 'medium_term', limit = 20): Promise<any> {
    const response = await this.api.get('/music/user/top-artists', {
      params: { time_range: timeRange, limit },
    });
    return response.data;
  }

  async getUserAnalytics(): Promise<any> {
    const response = await this.api.get('/music/user/analytics');
    return response.data;
  }

  async getUserRecentlyPlayed(limit = 50): Promise<any> {
    const response = await this.api.get('/music/user/recently-played', {
      params: { limit },
    });
    return response.data;
  }

  async getUserRecommendations(): Promise<any> {
    const response = await this.api.get('/music/user/recommendations');
    return response.data;
  }

  async getUserPlaylists(limit = 50): Promise<any> {
    const response = await this.api.get('/music/user/playlists', {
      params: { limit },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default api;
