import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

export interface Track {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  popularity: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: {
    spotify: string;
  };
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

interface MusicState {
  // Demo Mode
  searchResults: {
    tracks: Track[];
    artists: Artist[];
  };
  selectedTrack: Track | null;
  selectedArtist: Artist | null;
  trackAnalysis: any | null;
  artistAnalysis: any | null;
  
  // Personal Mode
  userTopTracks: Track[];
  userTopArtists: Artist[];
  userAnalytics: MusicAnalytics | null;
  recentlyPlayed: any[];
  recommendations: any[];
  playlists: any[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  currentTimeRange: 'short_term' | 'medium_term' | 'long_term';
}

const initialState: MusicState = {
  searchResults: {
    tracks: [],
    artists: [],
  },
  selectedTrack: null,
  selectedArtist: null,
  trackAnalysis: null,
  artistAnalysis: null,
  userTopTracks: [],
  userTopArtists: [],
  userAnalytics: null,
  recentlyPlayed: [],
  recommendations: [],
  playlists: [],
  isLoading: false,
  error: null,
  currentTimeRange: 'medium_term',
};

// Demo Mode Async Thunks
export const searchTracks = createAsyncThunk(
  'music/searchTracks',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await apiService.searchTracks(query);
      return response.tracks.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const searchArtists = createAsyncThunk(
  'music/searchArtists',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await apiService.searchArtists(query);
      return response.artists.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const fetchTrackAnalysis = createAsyncThunk(
  'music/fetchTrackAnalysis',
  async (trackId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getTrackAnalysis(trackId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Analysis failed');
    }
  }
);

export const fetchArtistAnalysis = createAsyncThunk(
  'music/fetchArtistAnalysis',
  async (artistId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getArtistAnalysis(artistId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Analysis failed');
    }
  }
);

// Personal Mode Async Thunks
export const fetchUserTopTracks = createAsyncThunk(
  'music/fetchUserTopTracks',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserTopTracks(timeRange);
      return response.tracks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch top tracks');
    }
  }
);

export const fetchUserTopArtists = createAsyncThunk(
  'music/fetchUserTopArtists',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserTopArtists(timeRange);
      return response.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch top artists');
    }
  }
);

export const fetchUserAnalytics = createAsyncThunk(
  'music/fetchUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserAnalytics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch analytics');
    }
  }
);

export const fetchRecentlyPlayed = createAsyncThunk(
  'music/fetchRecentlyPlayed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserRecentlyPlayed();
      return response.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recently played');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'music/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserRecommendations();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recommendations');
    }
  }
);

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTrack: (state, action: PayloadAction<Track | null>) => {
      state.selectedTrack = action.payload;
    },
    setSelectedArtist: (state, action: PayloadAction<Artist | null>) => {
      state.selectedArtist = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<'short_term' | 'medium_term' | 'long_term'>) => {
      state.currentTimeRange = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = { tracks: [], artists: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      // Search tracks
      .addCase(searchTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults.tracks = action.payload;
      })
      .addCase(searchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Search artists
      .addCase(searchArtists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchArtists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults.artists = action.payload;
      })
      .addCase(searchArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Track analysis
      .addCase(fetchTrackAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrackAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trackAnalysis = action.payload;
      })
      .addCase(fetchTrackAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Artist analysis
      .addCase(fetchArtistAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtistAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artistAnalysis = action.payload;
      })
      .addCase(fetchArtistAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // User top tracks
      .addCase(fetchUserTopTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTopTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTopTracks = action.payload;
      })
      .addCase(fetchUserTopTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // User top artists
      .addCase(fetchUserTopArtists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTopArtists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTopArtists = action.payload;
      })
      .addCase(fetchUserTopArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // User analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Recently played
      .addCase(fetchRecentlyPlayed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentlyPlayed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentlyPlayed = action.payload;
      })
      .addCase(fetchRecentlyPlayed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedTrack,
  setSelectedArtist,
  setTimeRange,
  clearSearchResults,
} = musicSlice.actions;

export default musicSlice.reducer;
