import mongoose from 'mongoose';
import 'dotenv/config';
import Category from '../models/Category';

const categories = [
  {
    name: 'Electronics',
    description: 'Elektronik ürünler',
    image: 'electronics.jpg',
    sortOrder: 1,
  },
  {
    name: 'Clothing',
    description: 'Giyim ve aksesuarlar',
    image: 'clothing.jpg',
    sortOrder: 2,
  },
  {
    name: 'Home and Garden',
    description: 'Ev ve bahçe ürünleri',
    image: 'home_garden.jpg',
    sortOrder: 3,
  },
  {
    name: 'Sports',
    description: 'Spor ve outdoor ürünleri',
    image: 'sports.jpg',
    sortOrder: 4,
  },
  {
    name: 'Books',
    description: 'Kitaplar ve yayınlar',
    image: 'books.jpg',
    sortOrder: 5,
  },
  {
    name: 'Health and Beauty',
    description: 'Sağlık ve güzellik ürünleri',
    image: 'health_beauty.jpg',
    sortOrder: 6,
  },
  {
    name: 'Toys',
    description: 'Oyuncaklar ve çocuk ürünleri',
    image: 'toys.jpg',
    sortOrder: 7,
  },
  {
    name: 'Food',
    description: 'Gıda ve market ürünleri',
    image: 'food.jpg',
    sortOrder: 8,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('Kategoriler başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
