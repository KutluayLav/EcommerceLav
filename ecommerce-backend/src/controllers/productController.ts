import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Order from '../models/Order';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, specifications, tags, featured, popular, newArrival, variants, status } = req.body;
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
    }
    // Kategori kontrolü
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Kategori bulunamadı.' });
    }
    // Görsel yükleme
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file: any) => file.filename);
    } else if (req.file) {
      images = [req.file.filename];
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      specifications,
      tags,
      featured: !!featured,
      popular: !!popular,
      newArrival: !!newArrival,
      variants,
      status: status || 'active',
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Ürün eklenemedi.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, specifications, tags, featured, popular, newArrival, variants, status, images } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Eski resimleri kaydet
    const oldImages = [...product.images];

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (specifications) product.specifications = specifications;
    if (tags) product.tags = tags;
    if (featured !== undefined) product.featured = featured;
    if (popular !== undefined) product.popular = popular;
    if (newArrival !== undefined) product.newArrival = newArrival;
    if (variants) product.variants = variants;
    if (status !== undefined) product.status = status;
    
    // Görsel güncelleme
    if (images && Array.isArray(images)) {
      product.images = images;
    } else if (req.files && Array.isArray(req.files)) {
      product.images = req.files.map((file: any) => file.filename);
    } else if (req.file) {
      product.images = [req.file.filename];
    }

    await product.save();

    // Silinen resimlerin dosyalarını sil
    const newImages = product.images;
    const deletedImages = oldImages.filter(img => !newImages.includes(img));
    
    deletedImages.forEach(imageName => {
      const imagePath = path.join(__dirname, '../uploads/products', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Silinen resim: ${imageName}`);
      }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Ürün güncellenemedi.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Ürünün resimlerini sil
    if (product.images && product.images.length > 0) {
      product.images.forEach(imageName => {
        const imagePath = path.join(__dirname, '../uploads/products', imageName);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Ürün silinirken resim de silindi: ${imageName}`);
        }
      });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Ürün silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Ürün silinemedi.' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Ürün getirilemedi.' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 20, featured, popular, newArrival } = req.query;
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (popular === 'true') {
      filter.popular = true;
    }
    if (newArrival === 'true') {
      filter.newArrival = true;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('category');
    const total = await Product.countDocuments(filter);
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ message: 'Ürünler listelenemedi.' });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi.' });
    }
    res.json({ filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Görsel yüklenemedi.' });
  }
};

export const bulkUpdateProducts = async (req: Request, res: Response) => {
  try {
    const { productIds, status } = req.body;
    if (!Array.isArray(productIds) || !status) {
      return res.status(400).json({ message: 'Geçersiz istek.' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status } }
    );
    
    res.json({ 
      message: `${result.modifiedCount} ürün güncellendi.`, 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ message: 'Toplu güncelleme başarısız.' });
  }
};


