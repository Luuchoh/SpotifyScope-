export const API_ENDPOINTS = {
  AUTH: {
    SPOTIFY_LOGIN: '/auth/spotify/login',
    SPOTIFY_CALLBACK: '/auth/spotify/callback',
    LOGOUT: '/auth/logout',
  },
  MUSIC: {
    DEMO: '/music/demo',
    USER_TOP_TRACKS: '/music/user/top-tracks',
    USER_TOP_ARTISTS: '/music/user/top-artists',
    AUDIO_FEATURES: '/music/user/audio-features',
  },
};

export const TIME_RANGES = {
  SHORT_TERM: 'short_term',
  MEDIUM_TERM: 'medium_term',
  LONG_TERM: 'long_term',
} as const;

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'playlist-read-private',
  'user-library-read',
];

export const CHART_COLORS = {
  PRIMARY: '#1DB954',
  SECONDARY: '#1ED760',
  ACCENT: '#FF6B6B',
  INFO: '#4ECDC4',
  WARNING: '#45B7D1',
  SUCCESS: '#96CEB4',
};
