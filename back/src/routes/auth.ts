import { Router } from 'express';
import { spotifyLogin, spotifyCallback, logout } from '@/controllers/authController.js';
import { authLimiter } from '@/middleware/rateLimiter.js';

const router: Router = Router();

router.post('/spotify/login', authLimiter, spotifyLogin);
router.get('/spotify/callback', authLimiter, spotifyCallback);
router.post('/logout', logout);

export default router;
