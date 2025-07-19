import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import fs from 'fs';
import path from 'path';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, sortOrder, active, slug, metaTitle, metaDescription, featured, parentCategory } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
    }
    let image = '';
    if (req.file) {
      image = req.file.filename;
    }
    const category = await Category.create({
      name,
      description,
      image,
      sortOrder: sortOrder || 0,
      active: active !== undefined ? active : true,
      slug,
      metaTitle,
      metaDescription,
      featured: featured || false,
      parentCategory
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Kategori eklenemedi.' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, sortOrder, active, slug, metaTitle, metaDescription, featured, parentCategory } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
    if (name) category.name = name;
    if (description) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (active !== undefined) category.active = active;
    if (slug) category.slug = slug;
    if (metaTitle) category.metaTitle = metaTitle;
    if (metaDescription) category.metaDescription = metaDescription;
    if (featured !== undefined) category.featured = featured;
    if (parentCategory) category.parentCategory = parentCategory;
    if (req.file) {
      category.image = req.file.filename;
    }
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Kategori güncellenemedi.' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    // Kategori resmini sil
    if (category.image) {
      const imagePath = path.join(__dirname, '../uploads/categories', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Kategori silinirken resim de silindi: ${category.image}`);
      }
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Kategori silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Kategori silinemedi.' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Kategori getirilemedi.' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { search, active, sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.sortOrder = 1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const categories = await Category.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    const total = await Category.countDocuments(filter);
    res.json({ categories, total });
  } catch (err) {
    res.status(500).json({ message: 'Kategoriler listelenemedi.' });
  }
};

export const uploadCategoryImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi.' });
    }
    res.json({ filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Görsel yüklenemedi.' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, sortBy, sortOrder } = req.query;
    const filter = { category: id };
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
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ message: 'Kategoriye göre ürünler getirilemedi.' });
  }
};

export const bulkUpdateCategories = async (req: Request, res: Response) => {
  try {
    const { categoryIds, active } = req.body;
    if (!Array.isArray(categoryIds) || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Geçersiz istek.' });
    }
    
    const result = await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $set: { active } }
    );
    
    res.json({ 
      message: `${result.modifiedCount} kategori güncellendi.`, 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ message: 'Toplu güncelleme başarısız.' });
  }
};
