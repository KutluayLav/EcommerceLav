import mongoose from 'mongoose';
import 'dotenv/config';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const users = await User.find({ role: 'customer' });
    const products = await Product.find();
    if (users.length === 0 || products.length === 0) throw new Error('Kullanıcı veya ürün yok!');
    for (const user of users) {
      const orderCount = Math.floor(Math.random() * 3) + 1; // Her kullanıcıya 1-3 sipariş
      for (let i = 0; i < orderCount; i++) {
        const itemCount = Math.floor(Math.random() * 3) + 1; // Her siparişte 1-3 ürün
        const orderItems = [];
        let totalPrice = 0;
        for (let j = 0; j < itemCount; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          orderItems.push({
            product: product._id,
            quantity,
            price: product.price,
            variant: product.variants && product.variants.length > 0 ? product.variants[0] : undefined
          });
          totalPrice += product.price * quantity;
        }
        await Order.create({
          user: user._id,
          items: orderItems,
          totalPrice,
          shippingAddress: {
            street: 'Test Cad. No: ' + (i + 1),
            city: 'İstanbul',
            state: 'İstanbul',
            postalCode: '34000',
            country: 'Türkiye'
          },
          status: 'delivered'
        });
      }
    }
    console.log('Siparişler başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
