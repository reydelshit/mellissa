import { Router } from 'express';
import { userRouter } from '../api/login';
import { mediaGalleryRouter } from '../api/media-gallery';
import { productRouter } from '../api/products';
import { promotionRouter } from '../api/promotion';
import { storeOwnerRouter } from '../api/store-owner';
import { cartsRouter } from '../api/carts';
import { ordersRouter } from '../api/order';
import { orderItemsRouter } from '../api/orderItems';
import { favoritesRouter } from '../api/favorites';
import { ratingRouter } from '../api/review';
import { graphsRouter } from '../api/graphs';

const router = Router();

router.use('/user', userRouter);
router.use('/store-owner', storeOwnerRouter);
router.use('/media-gallery', mediaGalleryRouter);
router.use('/products', productRouter);
router.use('/promotions', promotionRouter);

router.use('/carts', cartsRouter);
router.use('/orders', ordersRouter);
router.use('/order-items', orderItemsRouter);
router.use('/favorites', favoritesRouter);
router.use('/review', ratingRouter);

router.use('/graphs', graphsRouter);

export default router;
