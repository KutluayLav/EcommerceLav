'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { clearCart } from '@/features/cart/cartSlice';
import { createOrder, getUserAddresses, ShippingAddress } from '@/services/orderService';
import { Loader2, MapPin, Plus, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CartItem } from '@/types/index';

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems, total: cartTotal } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Türkiye',
    label: '',
    phone: '',
    paymentMethod: 'creditCard',
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userAddresses, setUserAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Kullanıcının adreslerini getir
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getUserAddresses();
        setUserAddresses(response.addresses || []);
      } catch (error) {
        console.error('Adresler yüklenemedi:', error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Sepet boşsa ana sayfaya yönlendir
  useEffect(() => {
    if (cartItems.length === 0) {
      window.location.href = '/cart';
    }
  }, [cartItems]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (address: ShippingAddress, index: number) => {
    const addressId = `address-${index}`;
    
    // Eğer aynı adres zaten seçiliyse, seçimi kaldır
    if (selectedAddressId === addressId) {
      setSelectedAddressId('');
      setForm({
        ...form,
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Türkiye',
        label: '',
        phone: '',
      });
    } else {
      // Yeni adres seç
      setForm({
        ...form,
        address: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        label: address.label || '',
        phone: address.phone || '',
      });
      setSelectedAddressId(addressId);
    }
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Adres seçimi kontrolü
    if (!form.address || !form.city || !form.state || !form.postalCode) {
      setError('Lütfen teslimat adresini seçin veya yeni adres girin.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Sepet öğelerini order formatına çevir
      const orderItems = cartItems.map((item: CartItem) => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.price,
          images: item.product.images
        },
        quantity: item.quantity,
        price: item.price
      }));

      // Shipping address oluştur
      const shippingAddress: ShippingAddress = {
        street: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country
      };

      // Sipariş oluştur
      await createOrder({
        items: orderItems,
        shippingAddress,
        paymentMethod: form.paymentMethod
      });

      // Sepeti temizle
      dispatch(clearCart());
      
      setOrderConfirmed(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Sipariş oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <main className="max-w-2xl mx-auto p-6 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <Check className="h-12 w-12 text-green-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-blackheading">
          Siparişiniz alındı!
        </h1>
        <p className="mb-6 text-darkgray">
          Siparişiniz başarıyla oluşturuldu ve işleme alındı.
        </p>
        <Link
          href="/"
          className="bg-primary text-bgwhite px-6 py-3 rounded hover:bg-red-700 transition font-semibold"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 mt-20">
      {/* Geri Dön Linki */}
      <div className="mb-6">
        <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Sepete Dön</span>
        </Link>
      </div>
      <h1 className="text-4xl font-extrabold mb-10 text-blackheading">Ödeme</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* SHIPPING */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-blackheading">Teslimat Adresi</h2>
            
            {/* Kayıtlı Adresler */}
            {userAddresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Kayıtlı Adresleriniz</h3>
                <p className="text-sm text-gray-600 mb-4">Teslimat için bir adres seçin:</p>
                <div className="space-y-3">
                  {userAddresses.map((address, index) => {
                    const addressId = `address-${index}`;
                    return (
                      <div
                        key={index}
                        onClick={() => handleAddressSelect(address, index)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === addressId
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            {address.label && (
                              <p className="text-sm font-medium text-primary mb-1">{address.label}</p>
                            )}
                            <p className="font-medium text-gray-900">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            {address.phone && (
                              <p className="text-sm text-gray-500 mt-1">📞 {address.phone}</p>
                            )}
                          </div>
                          {selectedAddressId === addressId && (
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Adres Ekle
                  </button>
                  {showNewAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      İptal
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Yeni Adres Formu */}
            {(showNewAddressForm || userAddresses.length === 0) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="label"
                    placeholder="Adres Etiketi (örn: Ev, İş)"
                    value={form.label}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Ad Soyad"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-posta"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Adres"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="Şehir"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="İl"
                    required
                    value={form.state}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Posta Kodu"
                    required
                    value={form.postalCode}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Ülke"
                    required
                    value={form.country}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT & ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h2 className="text-2xl font-semibold mb-6 text-blackheading">Sipariş Özeti</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item: CartItem) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">₺{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Ara Toplam</span>
                  <span>₺{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>KDV (%18)</span>
                  <span>₺{(cartTotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kargo</span>
                  <span>₺15.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Toplam</span>
                  <span>₺{(cartTotal * 1.18 + 15).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Ödeme Yöntemi</h3>
                <div className="space-y-2">
                  {[
                    { id: 'creditCard', label: 'Kredi Kartı' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'cash', label: 'Kapıda Ödeme' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer transition ${
                        form.paymentMethod === option.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={form.paymentMethod === option.id}
                        onChange={handleChange}
                        className="mr-2 accent-primary"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sipariş Oluşturuluyor...
                  </>
                ) : (
                  'Siparişi Onayla'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
