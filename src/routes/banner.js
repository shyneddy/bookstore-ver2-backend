
import { Router } from 'express';
const router = Router();
import bannerController from '../controllers/bannerController.js';
import { isLogin, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
// import cloudinary from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: 'dccufaric',
    api_key: '765784527863929',
    api_secret: '-4BVBunPltEYrGclnrpjmWqhF70'
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ height: 600, width: 600, crop: "limit" }],
    params: {
        folder: 'sach_online'
    }
});
const uploadCloud = multer({ storage });

router.get('/get-banner', bannerController.getBanner);
router.post('/add-banner', isAdmin, uploadCloud.fields([{ name: 'selectedFileBanner', maxCount: 1 }]), bannerController.addBanner);
router.post('/remove-banner', isAdmin, bannerController.removeBanner);


export default router;