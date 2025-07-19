# 🛒 E-commerce 

Modern bir e-ticaret uygulaması ve yönetim paneli. React/Next.js frontend ve Node.js/Express backend ile geliştirilmiştir.

## 🚀 Teknolojiler

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - İkonlar

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📋 Kurulum

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd Ecommerce
```

### 2. Backend Kurulumu
```bash
cd ecommerce-backend
npm install
```

### 3. Frontend Kurulumu
```bash
cd ecommerce-frontend
npm install
```

## ⚙️ Environment Ayarları

### Backend (.env)
```env
# Server
PORT=5050
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email (Opsiyonel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```
```

## 📧 Email Aktivasyonu

### Test Ortamı Email Ayarları
```env
# Gmail SMTP Ayarları (Test için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=test-email@gmail.com
SMTP_PASS=your-app-password
```

### Test Ortamında Email Aktivasyonu
**⚠️ Önemli:** Test ortamında tüm email aktivasyonları `.env` dosyasında belirtilen tek bir mail adresine gönderilir.
# SMTP Ayarları (Ethereal ile test için)

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=ornek@ethereal.email
SMTP_PASS=ornek
SMTP_FROM=Ecommerce <ornek@ethereal.email>

#### Test Süreci:
1. **Müşteri kayıt olur** → Doğrulama emaili test mailine gönderilir
2. **Test mailini kontrol edin** → Aktivasyon linkini bulun
3. **Linke tıklayın** → Hesap aktif edilir
4. **Aktif olmayan hesaplar giriş yapamaz**

#### Production Ortamı İçin:
- Her kullanıcı kendi email adresine doğrulama maili alır
- `.env` dosyasındaki `SMTP_USER` kendi mail adresinizle değiştirin
- Gmail App Password oluşturun

### Test İçin
- İstediğiniz kadar müşteri kaydı yapabilirsiniz
- Tüm aktivasyon mailleri test mailinize gelir
- Test mailinizi kontrol ederek hesapları aktif edebilirsiniz
- Admin panelinden müşteri durumlarını kontrol edebilirsiniz

## 🗄️ Database Kurulumu

### MongoDB Kurulumu
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin
2. MongoDB'yi başlatın: `mongod`
3. Database otomatik oluşturulacak

### Alternatif: MongoDB Atlas
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

## 🌱 Seed Scriptleri

### Admin Kullanıcısı Oluşturma
```bash
cd ecommerce-backend
npm run seed:users
```

### Örnek Ürünler Ekleme
```bash
npm run seed:products
```

### Örnek Kategoriler Ekleme
```bash
npm run seed:categories
```

### Örnek Siparişler Ekleme
```bash
npm run seed:orders
```

## 🚀 Çalıştırma

### 1. Backend'i Başlatın
```bash
cd ecommerce-backend
npm start
# veya development için
npm run dev
```

### 2. Frontend'i Başlatın
```bash
cd ecommerce-frontend
npm run dev
```

### 3. Tarayıcıda Açın
- Frontend: http://localhost:3000
- Backend API: http://localhost:5050

## 🔐 Giriş İşlemleri

### Admin Girişi
1. **Admin kullanıcısı oluşturun:**
   ```bash
   cd ecommerce-backend
   npm run seed:users
   ```

2. **Admin paneline giriş yapın:**
   - URL: http://localhost:3000/auth/login
   - username: admin
   - Şifre: admin

### Müşteri Kaydı ve Girişi
1. **Müşteri kaydı yapın:**
   - URL: http://localhost:3000/auth/signup
   - Formu doldurun ve kayıt olun

2. **Email doğrulama (Test Ortamı):**
   - **⚠️ Önemli:** Tüm aktivasyon mailleri `.env` dosyasındaki test mailine gönderilir
   - Test mailinizi kontrol edin
   - Aktivasyon linkine tıklayın
   - Hesap aktif edilir

3. **Giriş yapın:**
   - URL: http://localhost:3000/auth/login
   - Email ve şifrenizle giriş yapın

**Not:** Email doğrulanmadan giriş yapılamaz!
**Test Ortamı:** Tüm mailler tek bir test mailine gelir, kendi mailinizi `.env` dosyasında ayarlayın.

## 📁 Proje Yapısı

```
Ecommerce/
├── ecommerce-backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth & validation
│   │   ├── scripts/        # Seed scripts
│   │   └── uploads/        # Uploaded files
│   └── package.json
├── ecommerce-frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── features/      # Redux slices
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Auth
- `POST /api/users/register` - Kullanıcı kaydı (email doğrulama gönderir)
- `POST /api/users/login` - Giriş (sadece doğrulanmış hesaplar)
- `POST /api/users/verify-email` - Email doğrulama
- `POST /api/users/reset-password` - Şifre sıfırlama

### Admin
- `GET /api/admin/dashboard` - Dashboard istatistikleri
- `GET /api/customers` - Müşteri listesi
- `GET /api/products` - Ürün listesi
- `GET /api/categories` - Kategori listesi
- `GET /api/orders` - Sipariş listesi

### Products
- `POST /api/products` - Ürün ekleme
- `PUT /api/products/:id` - Ürün güncelleme
- `DELETE /api/products/:id` - Ürün silme
- `POST /api/products/upload` - Resim yükleme

### Categories
- `POST /api/categories` - Kategori ekleme
- `PUT /api/categories/:id` - Kategori güncelleme
- `DELETE /api/categories/:id` - Kategori silme
- `PUT /api/categories/bulk` - Toplu güncelleme

## 🛡️ Güvenlik

- **JWT Authentication** - Tüm admin endpoint'leri korunur
- **Password Hashing** - bcryptjs ile şifre hashleme
- **File Upload Validation** - Güvenli dosya yükleme
- **CORS Protection** - Cross-origin request koruması
- **Input Validation** - Giriş verisi doğrulama

## 📝 Özellikler

### Admin Panel
- ✅ Dashboard istatistikleri
- ✅ Ürün yönetimi (CRUD)
- ✅ Kategori yönetimi
- ✅ Müşteri yönetimi
- ✅ Sipariş takibi
- ✅ Resim yükleme
- ✅ Toplu işlemler
- ✅ Arama ve filtreleme
- ✅ Pagination

### Kullanıcı Özellikleri
- ✅ Kayıt ve giriş
- ✅ Email doğrulama (zorunlu)
- ✅ Profil yönetimi
- ✅ Adres yönetimi
- ✅ Sipariş geçmişi
- ✅ Wishlist

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# MongoDB servisini kontrol edin
brew services list | grep mongodb
# veya
sudo systemctl status mongod
```

### Port Çakışması
```bash
# Kullanılan portları kontrol edin
lsof -i :3000
lsof -i :5050
```

### JWT Hatası
- `.env` dosyasında `JWT_SECRET` olduğundan emin olun
- Token'ın geçerli olduğunu kontrol edin

### Email Gönderim Hatası
- Gmail App Password doğru olduğundan emin olun
- 2 Adımlı Doğrulama aktif olmalı
- SMTP ayarlarını kontrol edin
- Spam klasörünü kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

**Not:** Bu proje geliştirme amaçlıdır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.
