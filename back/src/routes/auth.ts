import { Router } from 'express';
import { spotifyLogin, spotifyCallback, logout, getProfile, refreshToken } from '@/controllers/authController.js';
import { generalLimiter } from '@/middleware/rateLimiter.js';
import { authenticateToken } from '@/middleware/auth.js';

const router: Router = Router();

// Public auth routes
router.post('/spotify/login', generalLimiter, spotifyLogin);
router.get('/spotify/callback', generalLimiter, spotifyCallback);

// Protected auth routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', authenticateToken, refreshToken);

export default router;
