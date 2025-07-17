import api from './api';

export interface LoginResponse {
  authUrl: string;
}

export interface CallbackResponse {
  user: {
    id: string;
    spotifyId: string;
    displayName: string;
    email: string;
    profileImage?: string;
    country?: string;
  };
  token: string;
}

export const authService = {
  async getSpotifyAuthUrl(): Promise<LoginResponse> {
    const response = await api.post('/auth/spotify/login');
    return response.data;
  },

  async handleCallback(code: string, state: string): Promise<CallbackResponse> {
    const response = await api.get(`/auth/spotify/callback?code=${code}&state=${state}`);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};

export default authService;
