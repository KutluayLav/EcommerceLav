import { Request, Response } from 'express';
import Review from '../models/Review';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const filter = { product: id, approved: true };
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Review.countDocuments(filter);
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: 'Yorumlar getirilemedi.' });
  }
};
