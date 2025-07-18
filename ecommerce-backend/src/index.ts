import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';

// Route imports
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import customerRoutes from './routes/customerRoutes';
import newsletterRoutes from './routes/newsletterRoutes';
import cartRoutes from './routes/cartRoutes';
import userActivityRoutes from './routes/userActivityRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false, // JWT için false
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

console.log('Body parser ekleniyor');
app.use(express.json());

// Static dosya servisi - uploads klasörü için
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
console.log('Static dosya servisi eklendi: /uploads');

console.log('userRoutes ekleniyor');
app.use('/api/users', userRoutes);
console.log('adminRoutes ekleniyor');
app.use('/api/admin', adminRoutes);
console.log('productRoutes ekleniyor');
app.use('/api/products', productRoutes);
console.log('orderRoutes ekleniyor');
app.use('/api/orders', orderRoutes);
console.log('categoryRoutes ekleniyor');
app.use('/api/categories', categoryRoutes);
console.log('customerRoutes ekleniyor');
app.use('/api/customers', customerRoutes);
console.log('newsletterRoutes ekleniyor');
app.use('/api/newsletter', newsletterRoutes);
console.log('cartRoutes ekleniyor');
app.use('/api/cart', cartRoutes);
console.log('userActivityRoutes ekleniyor');
app.use('/api/user-activity', userActivityRoutes);

// Base test route
app.get('/', (req, res) => {
  res.send('Ecommerce Backend API Çalışıyor!');
});

// MongoDB bağlantısı
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
  });