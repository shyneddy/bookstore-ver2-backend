import { Router } from 'express';
const router = Router();
import orderController from '../controllers/orderController.js';
import { isLogin, isAdmin } from '../middleware/auth.js';
// import {initPassportLocal, Dadangnhap} from '../config/passport.js';

// import { newsController } from '../app/controllers/NewsControllers';



router.post('/add-item', isLogin, orderController.addItem);
router.get('/get-items', isLogin, orderController.getOrder);
router.get('/get-notify', isLogin, orderController.getNumberOrderbyUser);

router.get('/get-user-order', isLogin, orderController.getUserOrder);

router.get('/confirm', isLogin, orderController.confirm);
router.post('/confirm', isLogin, orderController.PostConfirm);

router.post('/update-item', isLogin, orderController.updateItem);
router.post('/delete-item', isLogin, orderController.deleteItem);

router.get('/get-totle-price', isLogin, orderController.getPriceOrder);
router.get('/get-detail-order-by-user', isLogin, orderController.getDetailOrderByUser);

//admin
router.get('/admin-fullorder', isAdmin, orderController.getOrderAll);
router.post('/admin-editorder', isAdmin, orderController.editOrderAll);
router.get('/admin-ordernew', isAdmin, orderController.getOrderNew);
router.get('/admin-dashboard-status', isAdmin, orderController.dashboardStatus);






// console.log(typeof(newsController.index));// module.exports = router;

export default router;