import api from './api';

export interface Track {
  name: string;
  artist: string;
  plays: number;
}

export interface Artist {
  name: string;
  plays: number;
}

export interface Genre {
  name: string;
  percentage: number;
}

export interface DemoData {
  topTracks: Track[];
  topArtists: Artist[];
  genres: Genre[];
}

export const musicService = {
  async getDemoData(): Promise<DemoData> {
    const response = await api.get('/music/demo');
    return response.data;
  },
};

export default musicService;
