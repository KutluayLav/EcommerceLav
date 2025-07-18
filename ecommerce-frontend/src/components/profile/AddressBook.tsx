'use client';

import { useState } from 'react';
import { Address } from '@/types';
import { addAddress, updateAddress, deleteAddress } from '@/services/userService';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

type AddressBookProps = {
  addresses?: Address[];
  onAddressChange?: () => void;
};

export function AddressBook({ addresses = [], onAddressChange }: AddressBookProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    label: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingAddress) {
        await updateAddress(editingAddress, formData);
      } else {
        await addAddress(formData);
      }
      
      setFormData({ street: '', city: '', state: '', postalCode: '', country: '', label: '', phone: '' });
      setShowAddForm(false);
      setEditingAddress(null);
      onAddressChange?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Adres işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!addressId || !confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;
    
    setLoading(true);
    setError('');

    try {
      await deleteAddress(addressId);
      onAddressChange?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Adres silinemedi.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address._id || address.id || '');
    setFormData({
      street: address.street || address.addressLine1 || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode || address.zipCode || '',
      country: address.country,
      label: address.label || '',
      phone: address.phone || ''
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({ street: '', city: '', state: '', postalCode: '', country: '', label: '', phone: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Adres Defteri</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adres Ekle
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            <button
              onClick={cancelForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Sokak Adresi *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Şehir *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  İl/İlçe
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Posta Kodu *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Ülke *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Adres Etiketi
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  placeholder="Ev, İş, vb."
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+90 555 123 45 67"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingAddress ? 'Güncelle' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr._id || addr.id || Math.random().toString()} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{addr.label || 'Adres'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.street || addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state ? addr.state + ', ' : ''}
                    {addr.postalCode || addr.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{addr.country}</p>
                  {addr.phone && <p className="text-sm text-gray-600">Telefon: {addr.phone}</p>}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(addr)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id || addr.id || '')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-2">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Henüz adres eklenmemiş</p>
          <p className="text-sm text-gray-500 mt-1">İlk adresinizi eklemek için yukarıdaki butona tıklayın</p>
        </div>
      )}
    </div>
  );
}
