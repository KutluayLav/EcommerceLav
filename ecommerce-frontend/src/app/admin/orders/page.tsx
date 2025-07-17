'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Eye, Download, MoreVertical, Edit, Trash, Package, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Örnek veri
const orders = [
  {
    id: 'ORD001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    date: '2024-03-20',
    total: 156.00,
    status: 'Completed',
    payment: 'Credit Card',
    items: 3
  },
  {
    id: 'ORD002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    date: '2024-03-19',
    total: 245.00,
    status: 'Processing',
    payment: 'PayPal',
    items: 2
  },
  {
    id: 'ORD003',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    date: '2024-03-19',
    total: 89.00,
    status: 'Pending',
    payment: 'Credit Card',
    items: 1
  },
  {
    id: 'ORD004',
    customer: {
      name: 'Sarah Williams',
      email: 'sarah@example.com'
    },
    date: '2024-03-18',
    total: 432.00,
    status: 'Completed',
    payment: 'Credit Card',
    items: 4
  },
  {
    id: 'ORD005',
    customer: {
      name: 'David Brown',
      email: 'david@example.com'
    },
    date: '2024-03-17',
    total: 178.50,
    status: 'Shipped',
    payment: 'Credit Card',
    items: 2
  },
  {
    id: 'ORD006',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    date: '2024-03-17',
    total: 95.00,
    status: 'Pending',
    payment: 'PayPal',
    items: 1
  },
  {
    id: 'ORD007',
    customer: {
      name: 'Robert Wilson',
      email: 'robert@example.com'
    },
    date: '2024-03-16',
    total: 320.00,
    status: 'Processing',
    payment: 'Credit Card',
    items: 3
  },
  {
    id: 'ORD008',
    customer: {
      name: 'Lisa Anderson',
      email: 'lisa@example.com'
    },
    date: '2024-03-16',
    total: 145.75,
    status: 'Completed',
    payment: 'PayPal',
    items: 2
  }
];

const OrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
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

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || order.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    const currentOrderIds = currentOrders.map(o => o.id);
    setSelectedOrders(prev =>
      prev.length === currentOrderIds.length 
        ? prev.filter(id => !currentOrderIds.includes(id))
        : [...prev.filter(id => !currentOrderIds.includes(id)), ...currentOrderIds]
    );
  };

  const toggleActionMenu = (orderId: string) => {
    setOpenActionMenu(openActionMenu === orderId ? null : orderId);
  };

  const handleDeleteOrder = (orderId: string) => {
    // Burada silme işlemi yapılacak
    console.log('Deleting order:', orderId);
    setOpenActionMenu(null);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Burada durum güncelleme işlemi yapılacak
    console.log('Updating order status:', orderId, newStatus);
    setOpenActionMenu(null);
  };

  const handleDeleteSelected = () => {
    // Burada seçili siparişleri silme işlemi yapılacak
    console.log('Deleting selected orders:', selectedOrders);
    setSelectedOrders([]);
  };

  const handleStatusChangeSelected = (newStatus: string) => {
    // Burada seçili siparişlerin durumunu güncelleme işlemi yapılacak
    console.log('Updating status for selected orders:', selectedOrders, 'to', newStatus);
    setSelectedOrders([]);
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

  // Generate page numbers
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                  <option value="Pending">Mark as Pending</option>
                  <option value="Processing">Mark as Processing</option>
                  <option value="Shipped">Mark as Shipped</option>
                  <option value="Completed">Mark as Completed</option>
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
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
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
                  checked={currentOrders.length > 0 && selectedOrders.length === currentOrders.length}
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
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items} items
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative">
                    <button 
                      onClick={() => toggleActionMenu(order.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openActionMenu === order.id && (
                      <div className={`absolute right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 ${
                        order.id === currentOrders[currentOrders.length - 1].id ? 'bottom-full mb-2' : 'top-full mt-2'
                      }`} ref={actionMenuRef}>
                        <div className="py-1">
                          <Link
                            href={`/admin/orders/view/${order.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View Details
                          </Link>
                          <Link
                            href={`/admin/orders/edit/${order.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Order
                          </Link>
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'Processing')}
                              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                            >
                              <Package className="h-4 w-4 mr-3" />
                              Mark as Processing
                            </button>
                          )}
                          {order.status === 'Processing' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'Shipped')}
                              className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
                            >
                              <Truck className="h-4 w-4 mr-3" />
                              Mark as Shipped
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'Completed')}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                            >
                              <CheckCircle className="h-4 w-4 mr-3" />
                              Mark as Completed
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} results
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