import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Order from '../models/Order';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, specifications, tags, featured, popular, newArrival, variants } = req.body;
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
      variants
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Ürün eklenemedi.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, specifications, tags, featured, popular, newArrival, variants } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
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
    // Görsel güncelleme (isteğe bağlı)
    if (req.files && Array.isArray(req.files)) {
      product.images = req.files.map((file: any) => file.filename);
    } else if (req.file) {
      product.images = [req.file.filename];
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Ürün güncellenemedi.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
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
    const { productIds, active } = req.body;
    if (!Array.isArray(productIds) || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Geçersiz istek.' });
    }
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { active } }
    );
    res.json({ message: 'Ürünler güncellendi.', result });
  } catch (err) {
    res.status(500).json({ message: 'Toplu güncelleme başarısız.' });
  }
};


