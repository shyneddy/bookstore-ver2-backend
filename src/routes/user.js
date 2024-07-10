import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import { isLogin, isAdmin } from '../middleware/auth.js';
// import {initPassportLocal, Dadangnhap} from '../config/passport.js';

// import { newsController } from '../app/controllers/NewsControllers';



router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/identify', userController.Identify);
router.get('/identify', userController.getIdentify);
router.post('/forget-password', userController.forgetPassword);


router.post('/updateinfo', userController.updateInfo);
router.post('/updatepassword', userController.updatePassword);


router.get('/islogin', userController.islogin)
router.get('/sigout', userController.sigout);
router.get('/getinfo', userController.getInfo);


//admin

router.post('/admin-login', userController.adminLogin);
router.get('/admin-allUser', isAdmin, userController.getAllUser);





// console.log(typeof(newsController.index));// module.exports = router;

export default router;