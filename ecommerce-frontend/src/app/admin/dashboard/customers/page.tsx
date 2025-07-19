'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, Edit, X, Check, Ban } from 'lucide-react';
import axios from 'axios';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  emailVerified: boolean;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }>;
  orders?: number;
  totalSpent?: number;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  // Müşterileri getir
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      console.log('Token:', token); // Debug için
      const response = await axios.get(`http://localhost:5050/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setCustomers(response.data.customers);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Müşteriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Müşteri siparişlerini getir
  const fetchCustomerStats = async (customerId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:5050/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        orders: response.data.orders.length,
        totalSpent: response.data.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)
      };
    } catch (err) {
      return { orders: 0, totalSpent: 0 };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAllCustomers = () => {
    setSelectedCustomers(prev =>
      prev.length === customers.length ? [] : customers.map(c => c._id)
    );
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
    setEditedCustomer(null);
  };

  const handleEditCustomer = async () => {
    if (!editedCustomer) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5050/api/users/${editedCustomer._id}`, {
        firstName: editedCustomer.firstName,
        lastName: editedCustomer.lastName,
        phone: editedCustomer.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers(); // Listeyi yenile
      closeEditModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Müşteri güncellenirken hata oluştu');
    }
  };

  const handleStatusChange = async (customerId: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5050/api/users/${customerId}`, {
        emailVerified: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers(); // Listeyi yenile
    } catch (err: any) {
      setError(err.response?.data?.message || 'Durum değiştirilirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getFullName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`;
  };

  const getPrimaryAddress = (customer: Customer) => {
    return customer.addresses.length > 0 
      ? `${customer.addresses[0].street}, ${customer.addresses[0].city}`
      : 'Adres bilgisi yok';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Müşteriler</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
            <Mail className="h-5 w-5 mr-2" />
            Seçilenlere Email Gönder
          </button>
          {selectedCustomers.length > 0 && (
            <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full sm:w-auto">
              <Ban className="h-5 w-5 mr-2" />
              Seçilenleri Deaktif Et
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filtreler
          </button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-auto">
            <option value="">Tüm Durumlar</option>
            <option value="verified">Email Doğrulanmış</option>
            <option value="unverified">Email Doğrulanmamış</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Müşteriler yükleniyor...</span>
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={toggleAllCustomers}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Kayıt Tarihi
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Durumu
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Adres
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={() => toggleCustomerSelection(customer._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{getFullName(customer)}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone || 'Telefon yok'}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{formatDate(customer.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{formatDate(customer.createdAt)}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer.emailVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {getPrimaryAddress(customer)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(customer)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-blue-600"
                        title="Görüntüle"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(customer._id, !customer.emailVerified)}
                        className={`${
                          customer.emailVerified 
                            ? 'text-gray-400 hover:text-red-600' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                        title={customer.emailVerified ? 'Deaktif Et' : 'Aktif Et'}
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Önceki
          </button>
          <span className="px-3 py-2 text-gray-700">
            Sayfa {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sonraki
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Müşteri Düzenle</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  type="text"
                  value={editedCustomer.firstName}
                  onChange={(e) => setEditedCustomer({...editedCustomer, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  type="text"
                  value={editedCustomer.lastName}
                  onChange={(e) => setEditedCustomer({...editedCustomer, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editedCustomer.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={editedCustomer.phone || ''}
                  onChange={(e) => setEditedCustomer({...editedCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Doğrulama Durumu
                </label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  editedCustomer.emailVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {editedCustomer.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleEditCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Check className="h-5 w-5 mr-2" />
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage; 