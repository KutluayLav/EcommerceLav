import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const users = [
  {
    email: 'admin@ecommerce.com',
    password: 'Admin1234!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    emailVerified: true
  },
  ...Array.from({ length: 8 }).map((_, i) => ({
    email: `user${i + 1}@mail.com`,
    password: `User${i + 1}pass!`,
    firstName: `User${i + 1}`,
    lastName: 'Test',
    role: 'customer',
    emailVerified: true
  }))
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const hashed = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashed });
      }
    }
    console.log('Kullanıcılar başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
