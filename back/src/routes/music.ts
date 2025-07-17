import { Router } from 'express';
import { apiLimiter } from '@/middleware/rateLimiter.js';

const router: Router = Router();

// Public demo endpoints
router.get('/demo', apiLimiter);

// Protected user endpoints
router.get('/user/top-tracks', apiLimiter);
router.get('/user/top-artists', apiLimiter);
router.get('/user/audio-features', apiLimiter);

export default router;
