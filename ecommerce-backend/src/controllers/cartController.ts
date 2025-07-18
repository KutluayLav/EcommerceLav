import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const getCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.json({ 
        _id: null,
        user: userId,
        items: [], 
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Her item için price hesapla
    const itemsWithPrice = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: (item.product as any)?.price || 0,
      variant: item.variant
    }));
    
    // Toplam hesapla
    const total = itemsWithPrice.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      _id: cart._id,
      user: cart.user,
      items: itemsWithPrice,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Sepet getirilemedi.' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { productId, quantity = 1, variant } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Ürün ID zorunludur.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    // Aynı ürün ve varyant varsa miktarı güncelle
    const item = cart.items.find(i => i.product.toString() === productId && JSON.stringify(i.variant) === JSON.stringify(variant || {}));
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, variant });
    }
    await cart.save();
    await cart.populate('items.product');
    
    // Response formatını düzenle
    const itemsWithPrice = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: (item.product as any)?.price || 0,
      variant: item.variant
    }));
    
    const total = itemsWithPrice.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      _id: cart._id,
      user: cart.user,
      items: itemsWithPrice,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Sepete eklenemedi.' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Geçerli bir miktar giriniz.' });
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Sepet bulunamadı.' });
    }
    // @ts-ignore
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Ürün sepetinizde bulunamadı.' });
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    // Response formatını düzenle
    const itemsWithPrice = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: (item.product as any)?.price || 0,
      variant: item.variant
    }));
    
    const total = itemsWithPrice.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      _id: cart._id,
      user: cart.user,
      items: itemsWithPrice,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Miktar güncellenemedi.' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Sepet bulunamadı.' });
    }
    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(item => item._id && item._id.toString() !== itemId);
    if (cart.items.length === beforeCount) {
      return res.status(404).json({ message: 'Ürün sepetinizde bulunamadı.' });
    }
    await cart.save();
    await cart.populate('items.product');
    
    // Response formatını düzenle
    const itemsWithPrice = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: (item.product as any)?.price || 0,
      variant: item.variant
    }));
    
    const total = itemsWithPrice.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      _id: cart._id,
      user: cart.user,
      items: itemsWithPrice,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ message: 'Ürün sepetten çıkarılamadı.' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Sepet bulunamadı.' });
    }
    cart.items = [];
    await cart.save();
    res.json({ message: 'Sepet temizlendi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sepet temizlenemedi.' });
  }
};
