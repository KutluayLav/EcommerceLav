import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Toplam satış
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    // Sipariş sayısı
    const orderCount = await Order.countDocuments();
    // Müşteri sayısı
    const customerCount = await User.countDocuments({ role: 'customer' });
    // Son 5 sipariş
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user');
    // Popüler ürünler (en çok sipariş edilen ilk 5)
    const popularProductsAgg = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const popularProducts = await Product.find({ _id: { $in: popularProductsAgg.map(p => p._id) } });
    const popularProductsWithSales = popularProducts.map(product => {
      const salesInfo = popularProductsAgg.find(p => String(p._id) === String(product._id));
      return {
        ...product.toObject(),
        sales: salesInfo ? salesInfo.count : 0
      };
    });
    // Satış trendi (son 12 ay)
    const salesTrend = await Order.aggregate([
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$totalPrice' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    // Sipariş durumu dağılımı
    const statusDist = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({
      totalSales,
      orderCount,
      customerCount,
      recentOrders,
      popularProducts: popularProductsWithSales,
      salesTrend,
      statusDist
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard verileri alınamadı.' });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
    }
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.' });
  }
};
