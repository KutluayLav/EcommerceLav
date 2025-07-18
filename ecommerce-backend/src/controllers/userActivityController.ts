import { Request, Response } from 'express';
import UserActivity from '../models/UserActivity';
import Product from '../models/Product';

export const getRecentViews = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const activity = await UserActivity.findOne({ user: userId });
    if (!activity) {
      return res.json({ recentViews: [] });
    }
    // Son gezilen ürünleri ürün detaylarıyla birlikte getir
    const recentViews = await Promise.all(
      activity.recentViews
        .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
        .slice(0, 10)
        .map(async (view) => {
          const product = await (await import('../models/Product')).default.findById(view.product);
          return { product, viewedAt: view.viewedAt };
        })
    );
    res.json({ recentViews });
  } catch (err) {
    res.status(500).json({ message: 'Son görüntülenenler getirilemedi.' });
  }
};

export const addRecentView = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Ürün ID zorunludur.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    let activity = await UserActivity.findOne({ user: userId });
    if (!activity) {
      activity = await UserActivity.create({ user: userId, viewedProducts: [], recentViews: [], purchasedProducts: [] });
    }
    // Eğer daha önce görüntülendiyse tarihi güncelle, yoksa ekle
    const existing = activity.recentViews.find(v => v.product.toString() === productId);
    if (existing) {
      existing.viewedAt = new Date();
    } else {
      activity.recentViews.push({ product: productId, viewedAt: new Date() });
      // Son 10 kaydı tut
      if (activity.recentViews.length > 10) {
        activity.recentViews = activity.recentViews.slice(-10);
      }
    }
    await activity.save();
    res.json({ message: 'Görüntüleme kaydedildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Görüntüleme kaydedilemedi.' });
  }
};
