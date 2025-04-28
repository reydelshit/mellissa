import { Router } from 'express';
import { designRouter } from '../api/design';
import { ordersRouter } from '../api/orders';
import { notificationRouter } from '../api/notification';
import { userRouter } from '../api/login';
import { storeOwnerRouter } from '../api/store-owner';
import { mediaGalleryRouter } from '../api/media-gallery';
import { productRouter } from '../api/products';
import { promotionRouter } from '../api/promotion';

const router = Router();

router.use('/user', userRouter);
router.use('/store-owner', storeOwnerRouter);
router.use('/media-gallery', mediaGalleryRouter);
router.use('/products', productRouter);
router.use('/promotions', promotionRouter);

router.use('/designs', designRouter);
router.use('/orders', ordersRouter);
router.use('/notif', notificationRouter);

export default router;
