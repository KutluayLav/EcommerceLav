'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ReviewList from '@/components/reviews/ReviewList';
import { getProduct, getProducts } from '@/services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import { AppDispatch } from '@/store';
import { Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getProduct(id as string);
        setProduct(response.data);
        
        // Related products
        if (response.data.category) {
          const relatedResponse = await getProducts({ 
            category: response.data.category, 
            limit: 3 
          });
          setRelatedProducts(relatedResponse.data.products?.filter((p: Product) => p._id !== id) || []);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ürün yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16 mt-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Ürün yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-darkgray mt-12">Ürün bulunamadı.</p>;
  }

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 99));
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(true);
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // 2 saniye göster
    } catch (error) {
      // Hata yönetimi (isteğe bağlı)
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-20" style={{ color: 'var(--color-darkgray)' }}>
      {showNotification && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
          Ürün sepete eklendi!
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Image Gallery - For now only main image */}
        <div className="lg:w-1/2 rounded-lg overflow-hidden shadow-lg">
          <img
            src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
            alt={product.name || product.title || 'Ürün'}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: 'var(--color-blackheading)' }}
            >
              {product.name || product.title}
            </h1>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-primary)' }}>
                ₺{product.price.toFixed(2)}
              </p>
              <div className="text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  product.stock && product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock && product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
                </span>
              </div>
            </div>

            <p className="mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Ürün Özellikleri</h3>
                <ul className="list-disc list-inside text-darkgray space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity selector and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-semibold">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="text"
                id="quantity"
                value={quantity}
                readOnly
                className="w-12 text-center border-x border-gray-300"
              />
              <button
                onClick={increaseQty}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(product._id || product.id || '')}
              disabled={!product.stock || product.stock <= 0 || addingToCart}
              className={`ml-auto font-semibold px-6 py-2 rounded transition flex items-center gap-2 cursor-pointer ${
                product.stock && product.stock > 0 && !addingToCart
                  ? 'bg-primary text-bgwhite hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                product.stock && product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'
              )}
            </button>
          </div>



          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Benzer Ürünler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProducts.slice(0, 2).map((related) => {
                  const relatedId = related._id || related.id;
                  const relatedName = related.name || related.title || 'Ürün';
                  const relatedImage = related.images?.[0] || related.image || '/placeholder-product.jpg';
                  
                  return (
                    <Link
                      key={relatedId}
                      href={`/products/${relatedId}`}
                      className="block border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    >
                      <img
                        src={relatedImage}
                        alt={relatedName}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <p className="font-semibold">{relatedName}</p>
                      <p className="text-primary font-semibold">₺{related.price.toFixed(2)}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 sm:pt-12">
        <ReviewList productId={product._id || product.id || ''} />
      </section>
    </main>
  );
}
