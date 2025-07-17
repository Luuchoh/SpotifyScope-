import { Router } from 'express';
import { 
  getDemoData, 
  getUserTopTracks, 
  getUserTopArtists, 
  getAudioFeatures 
} from '@/controllers/musicController.js';
import { authenticateToken, optionalAuth } from '@/middleware/auth.js';
import { apiLimiter } from '@/middleware/rateLimiter.js';

const router: Router = Router();

// Public demo endpoints
router.get('/demo', apiLimiter, getDemoData);

// Protected user endpoints
router.get('/user/top-tracks', apiLimiter, authenticateToken, getUserTopTracks);
router.get('/user/top-artists', apiLimiter, authenticateToken, getUserTopArtists);
router.get('/user/audio-features', apiLimiter, authenticateToken, getAudioFeatures);

export default router;
