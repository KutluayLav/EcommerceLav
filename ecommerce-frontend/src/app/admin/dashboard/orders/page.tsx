'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Eye, Download, MoreVertical, Edit, Trash, Package, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Admin token bulunamadı.');
          setLoading(false);
          return;
        }

        const params: any = {
          page: currentPage,
          limit: itemsPerPage
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedStatus) params.status = selectedStatus;

        const response = await axios.get('http://localhost:5050/api/orders', {
          params,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setOrders(response.data.orders || []);
        setTotal(response.data.total || 0);
      } catch (err: any) {
        setError('Siparişler alınamadı.');
        console.error('Siparişler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, itemsPerPage, searchTerm, selectedStatus]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    const currentOrderIds = orders.map(o => o._id);
    setSelectedOrders(prev =>
      prev.length === currentOrderIds.length 
        ? prev.filter(id => !currentOrderIds.includes(id))
        : [...prev.filter(id => !currentOrderIds.includes(id)), ...currentOrderIds]
    );
  };

  const toggleActionMenu = (orderId: string) => {
    setOpenActionMenu(openActionMenu === orderId ? null : orderId);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.delete(`http://localhost:5050/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrders(prev => prev.filter(o => o._id !== orderId));
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      setOpenActionMenu(null);
      
      alert('Sipariş başarıyla silindi.');
    } catch (error: any) {
      console.error('Sipariş silinirken hata:', error);
      alert(error.response?.data?.message || 'Sipariş silinirken bir hata oluştu.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.put(`http://localhost:5050/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrders(prev => prev.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
      setOpenActionMenu(null);
      
      alert('Sipariş durumu güncellendi.');
    } catch (error: any) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      alert(error.response?.data?.message || 'Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;
    
    if (!confirm(`${selectedOrders.length} siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      for (const orderId of selectedOrders) {
        await axios.delete(`http://localhost:5050/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setOrders(prev => prev.filter(o => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      
      alert(`${selectedOrders.length} sipariş başarıyla silindi.`);
    } catch (error: any) {
      console.error('Siparişler silinirken hata:', error);
      alert(error.response?.data?.message || 'Siparişler silinirken bir hata oluştu.');
    }
  };

  const handleStatusChangeSelected = async (newStatus: string) => {
    if (selectedOrders.length === 0 || !newStatus) return;
    
    if (!confirm(`${selectedOrders.length} siparişin durumunu "${newStatus}" olarak güncellemek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.put(`http://localhost:5050/api/orders/bulk`, {
        orderIds: selectedOrders,
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrders(prev => prev.map(o => 
        selectedOrders.includes(o._id) ? { ...o, status: newStatus } : o
      ));
      setSelectedOrders([]);
      
      alert(`${selectedOrders.length} siparişin durumu başarıyla güncellendi.`);
    } catch (error: any) {
      console.error('Sipariş durumları güncellenirken hata:', error);
      alert(error.response?.data?.message || 'Sipariş durumları güncellenirken bir hata oluştu.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenActionMenu(null);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setOpenActionMenu(null);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header with Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {selectedOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-sm font-medium text-blue-800">
                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Selected
                </button>
                <select
                  onChange={(e) => e.target.value && handleStatusChangeSelected(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                  defaultValue=""
                >
                  <option value="" disabled>Update Status</option>
                  <option value="pending">Mark as Pending</option>
                  <option value="confirmed">Mark as Confirmed</option>
                  <option value="shipped">Mark as Shipped</option>
                  <option value="delivered">Mark as Delivered</option>
                </select>
              </div>
            </div>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
          </button>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedOrders.length === orders.length}
                  onChange={toggleAllOrders}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading orders...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-red-600">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleOrderSelection(order._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.firstName} {order.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button 
                        onClick={() => toggleActionMenu(order._id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openActionMenu === order._id && (
                        <div className={`absolute right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 ${
                          order._id === orders[orders.length - 1]?._id ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`} ref={actionMenuRef}>
                          <div className="py-1">
                            <Link
                              href={`/admin/dashboard/orders/view/${order._id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              View Details
                            </Link>
                            <Link
                              href={`/admin/dashboard/orders/edit/${order._id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit Order
                            </Link>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'confirmed')}
                                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                              >
                                <Package className="h-4 w-4 mr-3" />
                                Mark as Confirmed
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'shipped')}
                                className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
                              >
                                <Truck className="h-4 w-4 mr-3" />
                                Mark as Shipped
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'delivered')}
                                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                <CheckCircle className="h-4 w-4 mr-3" />
                                Mark as Delivered
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash className="h-4 w-4 mr-3" />
                              Delete Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 border rounded text-sm ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : page === '...'
                    ? 'border-gray-300 text-gray-500 cursor-default'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 