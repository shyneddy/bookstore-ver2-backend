
import { Router } from 'express';
const router = Router();
import ratingController from '../controllers/ratingController.js';
import { isLogin, isAdmin } from '../middleware/auth.js';

router.get('/get-all-rating', isAdmin, ratingController.getAllRating);
router.post('/remove-rating', isAdmin, ratingController.removeRating);


export default router;