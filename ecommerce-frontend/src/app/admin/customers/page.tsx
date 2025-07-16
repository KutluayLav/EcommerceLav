'use client';
import React, { useState } from 'react';
import { Search, Filter, Eye, Mail, Edit, X, Check, Ban } from 'lucide-react';

// Örnek veri
const customers = [
  {
    id: 'CUS001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+90 555 123 4567',
    joinDate: '2024-01-15',
    orders: 12,
    totalSpent: 1245.00,
    status: 'Active',
    address: '123 Main St, Istanbul, Turkey'
  },
  {
    id: 'CUS002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+90 555 234 5678',
    joinDate: '2024-02-20',
    orders: 8,
    totalSpent: 876.50,
    status: 'Active',
    address: '456 Park Ave, Ankara, Turkey'
  },
  {
    id: 'CUS003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+90 555 345 6789',
    joinDate: '2024-03-05',
    orders: 3,
    totalSpent: 234.00,
    status: 'Inactive',
    address: '789 Oak St, Izmir, Turkey'
  }
];

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: string;
  address: string;
}

const CustomersPage = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAllCustomers = () => {
    setSelectedCustomers(prev =>
      prev.length === customers.length ? [] : customers.map(c => c.id)
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

  const handleEditCustomer = () => {
    if (!editedCustomer) return;
    // Burada API çağrısı yapılacak
    console.log('Saving customer:', editedCustomer);
    closeEditModal();
  };

  const handleStatusChange = (customerId: string, newStatus: string) => {
    // Burada API çağrısı yapılacak
    console.log('Changing status:', customerId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
            <Mail className="h-5 w-5 mr-2" />
            Email Selected
          </button>
          {selectedCustomers.length > 0 && (
            <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full sm:w-auto">
              <Ban className="h-5 w-5 mr-2" />
              Deactivate Selected
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
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
          </button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-auto">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === customers.length}
                  onChange={toggleAllCustomers}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Join Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Total Spent
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => toggleCustomerSelection(customer.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{customer.joinDate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">{customer.joinDate}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.orders}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">${customer.totalSpent.toFixed(2)}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => openEditModal(customer)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(customer.id, customer.status === 'Active' ? 'Inactive' : 'Active')}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Ban className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Edit Customer</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editedCustomer.name}
                  onChange={(e) => setEditedCustomer({...editedCustomer, name: e.target.value})}
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
                  onChange={(e) => setEditedCustomer({...editedCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editedCustomer.phone}
                  onChange={(e) => setEditedCustomer({...editedCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editedCustomer.status}
                  onChange={(e) => setEditedCustomer({...editedCustomer, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={editedCustomer.address}
                  onChange={(e) => setEditedCustomer({...editedCustomer, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Check className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage; 