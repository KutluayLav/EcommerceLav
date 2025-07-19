import { Request, Response } from 'express';
import Review from '../models/Review';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const filter = { product: id, approved: true };
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Review.countDocuments(filter);
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: 'Yorumlar getirilemedi.' });
  }
};

// Ürün için yorum ekle
export const addProductReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // product id
    const { rating, comment } = req.body;
    // @ts-ignore
    const userId = req.user.userId;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Puan ve yorum zorunludur.' });
    }
    let review = await Review.create({
      product: id,
      user: userId,
      rating,
      comment,
      approved: true // Moderasyon isteniyorsa false yapılabilir
    });
    review = await review.populate('user', 'firstName lastName email');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Yorum eklenemedi.' });
  }
};
