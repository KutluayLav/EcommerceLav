'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const EditProductPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [popular, setPopular] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [variants, setVariants] = useState<{ size?: string; color?: string; stock: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:5050/api/products/${productId}`),
          axios.get('http://localhost:5050/api/categories')
        ]);
        
        setProduct(productResponse.data);
        setImages(productResponse.data.images || []);
        setCategories(categoriesResponse.data.categories || []);
        
        // Ek bilgileri ayarla
        if (productResponse.data.specifications) {
          const specs = Object.entries(productResponse.data.specifications).map(([key, value]) => ({ key, value: String(value) }));
          setSpecifications(specs);
        }
        setTags(productResponse.data.tags || []);
        setFeatured(productResponse.data.featured || false);
        setPopular(productResponse.data.popular || false);
        setNewArrival(productResponse.data.newArrival || false);
        setVariants(productResponse.data.variants || []);
      } catch (err) {
        setError('Ürün yüklenirken hata oluştu');
      }
      setLoading(false);
    };
    fetchData();
  }, [productId]);

  const handleFileSelect = async (files: FileList) => {
    setUploadingImages(true);
    setError('');
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin token bulunamadı');
      setUploadingImages(false);
      return;
    }

    try {
      console.log('Resim yükleme başlıyor...', files.length, 'dosya');
      const uploadPromises = Array.from(files).map(async (file) => {
        console.log('Yüklenen dosya:', file.name, file.size, file.type);
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('http://localhost:5050/api/products/upload', formData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload response:', response.data);
        return response.data.filename;
      });

      const uploadedFilenames = await Promise.all(uploadPromises);
      console.log('Yüklenen dosya adları:', uploadedFilenames);
      setImages(prev => {
        const newImages = [...prev, ...uploadedFilenames];
        console.log('Güncel resim listesi:', newImages);
        return newImages;
      });
    } catch (err: any) {
      console.error('Resim yükleme hatası:', err);
      setError(`Resim yüklenirken hata oluştu: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: any) => {
    setProduct((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin token bulunamadı');
      setSaving(false);
      return;
    }

    try {
      console.log('Kaydedilecek resimler:', images);
      const saveData = {
        name: product.name,
        description: product.description,
        category: product.category,
        status: product.status,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        images,
        specifications: Object.fromEntries(specifications.map(s => [s.key, s.value])),
        tags,
        featured,
        popular,
        newArrival,
        variants,
      };
      console.log('Gönderilecek veri:', saveData);

      await axios.put(`http://localhost:5050/api/products/${productId}`, saveData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Ürün başarıyla güncellendi');
      router.push('/admin/dashboard/products');
    } catch (err: any) {
      console.error('Ürün güncelleme hatası:', err);
      setError(`Ürün güncellenemedi: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/dashboard/products"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-center font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your images here, or{' '}
                  <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                    browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PNG, JPG, GIF up to 5MB
                </p>
                {uploadingImages && (
                  <div className="mt-4 text-blue-600">Resimler yükleniyor...</div>
                )}
              </div>
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:5050/uploads/products/${image}`}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Ek Bilgiler</h2>
            <div className="space-y-4">
              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={e => {
                        const arr = [...specifications];
                        arr[idx].key = e.target.value;
                        setSpecifications(arr);
                      }}
                      placeholder="Key"
                      className="w-1/3 px-2 py-1 border rounded"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={e => {
                        const arr = [...specifications];
                        arr[idx].value = e.target.value;
                        setSpecifications(arr);
                      }}
                      placeholder="Value"
                      className="w-2/3 px-2 py-1 border rounded"
                    />
                    <button type="button" onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))} className="text-red-500">Sil</button>
                  </div>
                ))}
                <button type="button" onClick={() => setSpecifications([...specifications, { key: '', value: '' }])} className="text-blue-600 text-sm mt-1">+ Özellik Ekle</button>
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={tags.join(',')}
                  onChange={e => setTags(e.target.value.split(',').map(t => t.trim()))}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              {/* Boolean flags */}
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={popular} onChange={e => setPopular(e.target.checked)} /> Popular
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={newArrival} onChange={e => setNewArrival(e.target.checked)} /> New Arrival
                </label>
              </div>
              {/* Variants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variants</label>
                {variants.map((variant, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={variant.size || ''}
                      onChange={e => {
                        const arr = [...variants];
                        arr[idx].size = e.target.value;
                        setVariants(arr);
                      }}
                      placeholder="Size"
                      className="w-1/4 px-2 py-1 border rounded"
                    />
                    <input
                      type="text"
                      value={variant.color || ''}
                      onChange={e => {
                        const arr = [...variants];
                        arr[idx].color = e.target.value;
                        setVariants(arr);
                      }}
                      placeholder="Color"
                      className="w-1/4 px-2 py-1 border rounded"
                    />
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={e => {
                        const arr = [...variants];
                        arr[idx].stock = parseInt(e.target.value) || 0;
                        setVariants(arr);
                      }}
                      placeholder="Stock"
                      className="w-1/4 px-2 py-1 border rounded"
                    />
                    <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="text-red-500">Sil</button>
                  </div>
                ))}
                <button type="button" onClick={() => setVariants([...variants, { size: '', color: '', stock: 0 }])} className="text-blue-600 text-sm mt-1">+ Varyant Ekle</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select 
                  value={product.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  value={product.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage; 