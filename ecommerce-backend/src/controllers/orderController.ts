import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import Cart from '../models/Cart';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { search, status, sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      // Kullanıcı email veya isim ile arama
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      filter.user = { $in: users.map(u => u._id) };
    }
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('user')
      .populate('items.product');
    const total = await Order.countDocuments(filter);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: 'Siparişler listelenemedi.' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user')
      .populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Sipariş getirilemedi.' });
  }
};

// Kullanıcının kendi siparişlerini getir (ürün adıyla birlikte)
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Siparişler getirilemedi.' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Sipariş öğeleri gereklidir.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({ message: 'Teslimat adresi gereklidir.' });
    }

    // Toplam fiyatı hesapla
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product) {
        return res.status(404).json({ message: `Ürün bulunamadı: ${item.product._id || item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Yetersiz stok: ${product.name}` });
      }

      const itemPrice = item.price || product.price;
      totalPrice += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant
      });

      // Stok güncelle
      product.stock -= item.quantity;
      await product.save();
    }

    // KDV ve kargo ekle
    const tax = totalPrice * 0.18; // %18 KDV
    const shipping = 15.00; // Sabit kargo ücreti
    const finalTotal = totalPrice + tax + shipping;

    // Sipariş oluştur
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice: finalTotal,
      shippingAddress,
      status: 'pending'
    });

    // Sepeti temizle
    await Cart.findOneAndDelete({ user: userId });

    // Siparişi ürünlerle birlikte populate et
    const populatedOrder = await Order.findById(order._id).populate('items.product');

    res.status(201).json({
      message: 'Sipariş başarıyla oluşturuldu.',
      order: populatedOrder
    });

  } catch (err) {
    console.error('Sipariş oluşturma hatası:', err);
    res.status(500).json({ message: 'Sipariş oluşturulamadı.' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Sipariş durumu güncellenemedi.' });
  }
};
