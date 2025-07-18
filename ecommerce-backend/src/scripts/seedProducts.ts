import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product';
import Category from '../models/Category';

const sampleProducts = [
  // Electronics (3 ürün)
  {
    name: 'iPhone 15 Pro',
    description: 'Apple\'ın en yeni akıllı telefonu, A17 Pro işlemci ile.',
    price: 45000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop'],
    specifications: { ekran: '6.1 inç', batarya: '3650mAh', kamera: '48MP' },
    tags: ['elektronik', 'telefon', 'apple'],
    featured: true,
    popular: true,
    newArrival: true,
    variants: [{ color: 'Titanium', stock: 10 }, { color: 'Black', stock: 15 }]
  },
  {
    name: 'MacBook Air M2',
    description: 'M2 işlemcili ultra hafif dizüstü bilgisayar.',
    price: 35000,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'],
    specifications: { ram: '8GB', depolama: '256GB SSD', işlemci: 'M2' },
    tags: ['elektronik', 'bilgisayar', 'apple'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: [{ ram: '8GB', stock: 8 }, { ram: '16GB', stock: 7 }]
  },
  {
    name: 'Samsung 4K Smart TV',
    description: '55 inç 4K Ultra HD akıllı televizyon.',
    price: 12000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop'],
    specifications: { ekran: '55 inç', çözünürlük: '4K', hdmi: '4 port' },
    tags: ['elektronik', 'televizyon', 'samsung'],
    featured: false,
    popular: true,
    newArrival: false,
    variants: [{ size: '55 inç', stock: 20 }, { size: '65 inç', stock: 10 }]
  },

  // Clothing (3 ürün)
  {
    name: 'Nike Air Max 270',
    description: 'Rahat ve şık günlük ayakkabı.',
    price: 1800,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
    specifications: { numara: '39-45', malzeme: 'File ve deri' },
    tags: ['giyim', 'ayakkabı', 'nike'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: [{ size: '42', stock: 15 }, { size: '44', stock: 20 }, { size: '45', stock: 15 }]
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Klasik kesim kot pantolon.',
    price: 450,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop'],
    specifications: { beden: '28-36', malzeme: '100% Pamuk' },
    tags: ['giyim', 'pantolon', 'levis'],
    featured: false,
    popular: true,
    newArrival: false,
    variants: [{ size: '30', stock: 20 }, { size: '32', stock: 30 }, { size: '34', stock: 30 }]
  },
  {
    name: 'Zara Blazer Ceket',
    description: 'Şık ofis ceketi.',
    price: 850,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop'],
    specifications: { beden: 'XS-L', malzeme: 'Polyester' },
    tags: ['giyim', 'ceket', 'zara'],
    featured: true,
    popular: false,
    newArrival: true,
    variants: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }]
  },

  // Home and Garden (3 ürün)
  {
    name: 'IKEA Malm Yatak Odası Takımı',
    description: 'Modern yatak odası mobilyası.',
    price: 2800,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop'],
    specifications: { malzeme: 'MDF', renk: 'Beyaz' },
    tags: ['ev', 'mobilya', 'ikea'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: [{ size: '160x200', stock: 10 }, { size: '180x200', stock: 10 }]
  },
  {
    name: 'Bahçe Çiçek Tohumu Seti',
    description: '10 farklı çiçek tohumu seti.',
    price: 75,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800&fit=crop'],
    specifications: { içerik: '10 farklı çiçek', miktar: 'Her paket 50 tohum' },
    tags: ['bahçe', 'çiçek', 'tohum'],
    featured: false,
    popular: false,
    newArrival: true,
    variants: []
  },
  {
    name: 'Philips Hue Akıllı Ampul Seti',
    description: '3\'lü akıllı LED ampul seti.',
    price: 650,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop'],
    specifications: { güç: '9W', renk: '16 milyon renk', bağlantı: 'WiFi' },
    tags: ['ev', 'aydınlatma', 'akıllı'],
    featured: true,
    popular: true,
    newArrival: true,
    variants: [{ pack: '3\'lü', stock: 25 }, { pack: '5\'li', stock: 15 }]
  },

  // Sports (2 ürün)
  {
    name: 'Adidas Predator Futbol Topu',
    description: 'Profesyonel futbol topu.',
    price: 320,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop'],
    specifications: { boyut: '5', malzeme: 'Sentetik deri' },
    tags: ['spor', 'futbol', 'adidas'],
    featured: false,
    popular: true,
    newArrival: false,
    variants: [{ size: '4', stock: 20 }, { size: '5', stock: 40 }]
  },
  {
    name: 'Under Armour Spor Çantası',
    description: 'Büyük kapasiteli spor çantası.',
    price: 280,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
    specifications: { kapasite: '50L', malzeme: 'Su geçirmez' },
    tags: ['spor', 'çanta', 'under armour'],
    featured: true,
    popular: false,
    newArrival: true,
    variants: [{ color: 'Siyah', stock: 25 }, { color: 'Gri', stock: 20 }]
  },

  // Books (2 ürün)
  {
    name: 'Harry Potter ve Felsefe Taşı',
    description: 'J.K. Rowling\'in çok satan romanı.',
    price: 85,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop'],
    specifications: { yazar: 'J.K. Rowling', sayfa: 223, dil: 'Türkçe' },
    tags: ['kitap', 'roman', 'fantastik'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: []
  },
  {
    name: 'Python Programlama Kitabı',
    description: 'Sıfırdan Python öğrenme rehberi.',
    price: 120,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop'],
    specifications: { yazar: 'Ahmet Yılmaz', sayfa: 450, seviye: 'Başlangıç' },
    tags: ['kitap', 'programlama', 'python'],
    featured: false,
    popular: true,
    newArrival: true,
    variants: []
  },

  // Health and Beauty (2 ürün)
  {
    name: 'La Roche Posay Güneş Kremi',
    description: 'SPF 50+ yüksek korumalı güneş kremi.',
    price: 180,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop'],
    specifications: { spf: '50+', miktar: '50ml', tip: 'Su geçirmez' },
    tags: ['sağlık', 'güneş kremi', 'la roche posay'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: []
  },
  {
    name: 'Oral-B Elektrikli Diş Fırçası',
    description: 'Sesli diş fırçası, 3 farklı mod.',
    price: 450,
    stock: 75,
    images: ['https://images.unsplash.com/photo-1559591935-c6c92c6c2c8c?w=800&h=800&fit=crop'],
    specifications: { mod: '3 farklı', şarj: 'Kablosuz', süre: '2 dakika' },
    tags: ['sağlık', 'diş bakımı', 'oral-b'],
    featured: false,
    popular: true,
    newArrival: true,
    variants: [{ color: 'Beyaz', stock: 40 }, { color: 'Mavi', stock: 35 }]
  },

  // Toys (2 ürün)
  {
    name: 'LEGO Star Wars X-Wing Fighter',
    description: 'Star Wars temalı LEGO seti.',
    price: 280,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop'],
    specifications: { parça: '730 adet', yaş: '9+', tema: 'Star Wars' },
    tags: ['oyuncak', 'lego', 'star wars'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: []
  },
  {
    name: 'Barbie Dreamhouse',
    description: '3 katlı Barbie evi.',
    price: 850,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop'],
    specifications: { kat: '3 kat', oda: '8 oda', yaş: '3+' },
    tags: ['oyuncak', 'barbie', 'ev'],
    featured: true,
    popular: false,
    newArrival: true,
    variants: []
  },

  // Food (3 ürün)
  {
    name: 'Starbucks Kahve Çekirdeği',
    description: 'Özel harmanlanmış kahve çekirdeği.',
    price: 95,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop'],
    specifications: { miktar: '250g', tip: 'Espresso', köken: 'Brezilya' },
    tags: ['gıda', 'kahve', 'starbucks'],
    featured: true,
    popular: true,
    newArrival: false,
    variants: []
  },
  {
    name: 'Lindt Excellence Çikolata',
    description: '%70 kakao oranlı bitter çikolata.',
    price: 45,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop'],
    specifications: { kakao: '%70', miktar: '100g', tip: 'Bitter' },
    tags: ['gıda', 'çikolata', 'lindt'],
    featured: false,
    popular: true,
    newArrival: false,
    variants: []
  },
  {
    name: 'Organik Bal',
    description: 'Doğal organik çiçek balı.',
    price: 120,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop'],
    specifications: { miktar: '500g', tip: 'Çiçek balı', organik: 'Evet' },
    tags: ['gıda', 'bal', 'organik'],
    featured: true,
    popular: false,
    newArrival: true,
    variants: []
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const categories = await Category.find();
    if (categories.length === 0) throw new Error('Kategori yok!');
    
    // Kategori mapping'i
    const categoryMap: { [key: string]: any } = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });
    
    // Her ürünü doğru kategoriye ata
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      let categoryId;
      
      // İlk 3 ürün Electronics
      if (i < 3) {
        categoryId = categoryMap['electronics'];
      }
      // Sonraki 3 ürün Clothing
      else if (i < 6) {
        categoryId = categoryMap['clothing'];
      }
      // Sonraki 3 ürün Home and Garden
      else if (i < 9) {
        categoryId = categoryMap['home and garden'];
      }
      // Sonraki 2 ürün Sports
      else if (i < 11) {
        categoryId = categoryMap['sports'];
      }
      // Sonraki 2 ürün Books
      else if (i < 13) {
        categoryId = categoryMap['books'];
      }
      // Sonraki 2 ürün Health and Beauty
      else if (i < 15) {
        categoryId = categoryMap['health and beauty'];
      }
      // Sonraki 2 ürün Toys
      else if (i < 17) {
        categoryId = categoryMap['toys'];
      }
      // Son 3 ürün Food
      else {
        categoryId = categoryMap['food'];
      }
      
      await Product.create({ ...product, category: categoryId });
    }
    console.log('Ürünler başarıyla eklendi!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
