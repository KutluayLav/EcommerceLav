import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';
import Order from '../models/Order';
import fs from 'fs';
import path from 'path';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email ile zaten bir kullanıcı var.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      emailVerificationToken,
      emailVerified: false,
      role: 'customer',
    });
    // Email gönder
    console.log('🔐 REGISTER: Email verification process started');
    console.log('User created with ID:', user._id);
    console.log('Email verification token:', emailVerificationToken);
    
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${emailVerificationToken}&email=${email}`;
    console.log('Verification URL:', verifyUrl);
    
    try {
      await sendEmail(
        email,
        'Email Doğrulama',
        `<p>Merhaba ${firstName},</p><p>Email adresinizi doğrulamak için <a href="${verifyUrl}">buraya tıklayın</a>.</p>`
      );
      console.log('✅ REGISTER: Email sent successfully');
      res.status(201).json({ message: 'Kayıt başarılı! Lütfen emailinizi doğrulayın.' });
    } catch (emailError) {
      console.log('❌ REGISTER: Email sending failed');
      console.log('Email Error:', emailError);
      // Email gönderilemese bile kullanıcı kaydı başarılı, sadece uyarı ver
      res.status(201).json({ 
        message: 'Kayıt başarılı! Ancak doğrulama emaili gönderilemedi. Lütfen daha sonra tekrar deneyin.',
        warning: 'Email gönderilemedi'
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Email adresiniz doğrulanmamış.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) {
      return res.status(400).json({ message: 'Eksik doğrulama bilgisi.' });
    }
    const user = await User.findOne({ email, emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz doğrulama linki.' });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ message: 'Email başarıyla doğrulandı.' });
  } catch (err) {
    res.status(500).json({ message: 'Email doğrulama sırasında hata oluştu.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    // 1. Şifre sıfırlama isteği (email ile)
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Bu email ile kullanıcı bulunamadı.' });
      }
      const passwordResetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 dk geçerli
      await user.save();
      console.log('🔑 RESET PASSWORD: Process started for email:', email);
      console.log('Password reset token:', passwordResetToken);
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${passwordResetToken}&email=${email}`;
      console.log('Reset URL:', resetUrl);
      
      try {
        await sendEmail(
          email,
          'Şifre Sıfırlama',
          `<p>Şifrenizi sıfırlamak için <a href="${resetUrl}">buraya tıklayın</a>.</p>`
        );
        console.log('✅ RESET PASSWORD: Email sent successfully');
        return res.json({ message: 'Şifre sıfırlama linki email adresinize gönderildi.' });
      } catch (emailError) {
        console.log('❌ RESET PASSWORD: Email sending failed');
        console.log('Email Error:', emailError);
        return res.status(500).json({ message: 'Şifre sıfırlama emaili gönderilemedi.' });
      }
    }
    // 2. Şifre sıfırlama işlemi (token ve yeni şifre ile)
    if (email && token && newPassword) {
      const user = await User.findOne({ email, passwordResetToken: token });
      if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.json({ message: 'Şifreniz başarıyla güncellendi.' });
    }
    return res.status(400).json({ message: 'Eksik veya hatalı istek.' });
  } catch (err) {
    res.status(500).json({ message: 'Şifre sıfırlama sırasında hata oluştu.' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profil bilgisi alınamadı.' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ message: 'Profil güncellendi.', user });
  } catch (err) {
    res.status(500).json({ message: 'Profil güncellenemedi.' });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Adresler alınamadı.' });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { street, city, state, postalCode, country, label, phone } = req.body;
    if (!street || !city || !postalCode || !country) {
      return res.status(400).json({ message: 'Tüm adres alanları zorunludur.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    user.addresses.push({ street, city, state, postalCode, country, label, phone });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Adres eklenemedi.' });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { addressId } = req.params;
    const { street, city, state, postalCode, country, label, phone } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    // @ts-ignore
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Adres bulunamadı.' });
    }
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;
    if (label !== undefined) address.label = label;
    if (phone !== undefined) address.phone = phone;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Adres güncellenemedi.' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    // @ts-ignore
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Adres bulunamadı.' });
    }
    address.remove();
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Adres silinemedi.' });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Favori ürünler alınamadı.' });
  }
};

export const addWishlist = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Ürün ID zorunludur.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Favori ürüne eklenemedi.' });
  }
};

export const removeWishlist = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { productId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Favori üründen çıkarılamadı.' });
  }
};

export const getOrderHistory = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Sipariş geçmişi alınamadı.' });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    // Şimdilik boş array döndür, daha sonra Review modeli ile entegre edilecek
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcı yorumları alınamadı.' });
  }
};

// Kullanıcı profil resmi yükleme
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Resim dosyası yüklenmedi.' });
    }
    // Eski resmi sil (varsa)
    if (user.image) {
      const oldPath = path.join(__dirname, '../uploads/users', user.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    user.image = req.file.filename;
    await user.save();
    res.json({ message: 'Profil resmi güncellendi.', image: user.image });
  } catch (err) {
    res.status(500).json({ message: 'Profil resmi yüklenemedi.' });
  }
};
