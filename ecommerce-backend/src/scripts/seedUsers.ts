import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'admin',
    email: 'admin@ecommerce.com',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    emailVerified: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    for (const user of users) {
      const exists = await User.findOne({ username: user.username });
      if (!exists) {
        const hashed = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashed });
      }
    }
    console.log('Admin kullanıcısı başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
