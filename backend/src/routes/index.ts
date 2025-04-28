import { Router } from 'express';
import { designRouter } from '../api/design';
import { ordersRouter } from '../api/orders';
import { notificationRouter } from '../api/notification';
import { userRouter } from '../api/login';
import { storeOwnerRouter } from '../api/store-owner';
import { mediaGalleryRouter } from '../api/media-gallery';

const router = Router();

router.use('/user', userRouter);
router.use('/store-owner', storeOwnerRouter);
router.use('/media-gallery', mediaGalleryRouter);
router.use('/designs', designRouter);
router.use('/orders', ordersRouter);
router.use('/notif', notificationRouter);

export default router;
