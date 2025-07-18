import { Router } from 'express';
import { 
  // Demo Mode (Public)
  searchTracks,
  searchArtists,
  getTrackAnalysis,
  getArtistAnalysis,
  getTrack,
  getArtist,
  // Personal Mode (Protected)
  getUserTopTracks, 
  getUserTopArtists, 
  getUserAnalytics,
  getUserRecentlyPlayed,
  getUserRecommendations,
  getUserPlaylists
} from '@/controllers/musicController.js';
import { authenticateToken } from '@/middleware/auth.js';
import { apiLimiter } from '@/middleware/rateLimiter.js';

const router: Router = Router();

// Demo Mode Endpoints (Public Access)
router.get('/search/tracks', apiLimiter, searchTracks);
router.get('/search/artists', apiLimiter, searchArtists);
router.get('/track/:trackId', apiLimiter, getTrack);
router.get('/track/:trackId/analysis', apiLimiter, getTrackAnalysis);
router.get('/artist/:artistId', apiLimiter, getArtist);
router.get('/artist/:artistId/analysis', apiLimiter, getArtistAnalysis);

// Personal Mode Endpoints (Require Authentication)
router.get('/user/top-tracks', apiLimiter, authenticateToken, getUserTopTracks);
router.get('/user/top-artists', apiLimiter, authenticateToken, getUserTopArtists);
router.get('/user/analytics', apiLimiter, authenticateToken, getUserAnalytics);
router.get('/user/recently-played', apiLimiter, authenticateToken, getUserRecentlyPlayed);
router.get('/user/recommendations', apiLimiter, authenticateToken, getUserRecommendations);
router.get('/user/playlists', apiLimiter, authenticateToken, getUserPlaylists);

export default router;
