import mongoose from 'mongoose';
import 'dotenv/config';
import Review from '../models/Review';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

const sampleComments = [
  'Ürün çok kaliteli, tavsiye ederim!',
  'Beklediğimden hızlı geldi.',
  'Fiyat/performans ürünü.',
  'Kargo biraz gecikti ama ürün güzel.',
  'Paketleme çok iyiydi.',
  'Rengi görseldeki gibi.',
  'Biraz daha ucuz olabilirdi.',
  'Kullanımı çok rahat.',
  'Satıcı ilgiliydi.',
  'Tekrar alırım.'
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const orders = await Order.find()
      .populate({ path: 'user', model: User })
      .populate({ path: 'items.product', model: Product });
    for (const order of orders) {
      for (const item of order.items) {
        // Her sipariş ürünü için %60 ihtimalle yorum ekle
        if (Math.random() < 0.6) {
          const rating = Math.floor(Math.random() * 5) + 1;
          const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          await Review.create({
            product: (item.product as any)._id,
            user: (order.user as any)._id,
            rating,
            comment,
            approved: true
          });
        }
      }
    }
    console.log('Yorumlar başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
