import express from 'express';
import { getProductReviews, addProductReview } from '../../controllers/reviewController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', authMiddleware, addProductReview);

export default router;
