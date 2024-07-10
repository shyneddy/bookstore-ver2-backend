import { Router } from 'express';
const router = Router();
import homeController from '../controllers/homeController.js';
import { isAdmin } from '../middleware/auth.js';




router.get('/list-product-new', homeController.newBooks);
router.get('/list-product-rating', homeController.topBooksRating);


router.get('/admin-index', isAdmin, homeController.Adminindex);




export default router;