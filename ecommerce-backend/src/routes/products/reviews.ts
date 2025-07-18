import express from 'express';
import { getProductReviews } from '../../controllers/reviewController';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);

export default router;
