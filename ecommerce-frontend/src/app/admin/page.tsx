'use client';
import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';

const stats = [
  {
    title: 'Total Sales',
    value: '$12,426',
    change: '+12%',
    icon: DollarSign,
    trend: 'up'
  },
  {
    title: 'Total Orders',
    value: '156',
    change: '+8%',
    icon: ShoppingBag,
    trend: 'up'
  },
  {
    title: 'Total Customers',
    value: '2,245',
    change: '+23%',
    icon: Users,
    trend: 'up'
  },
  {
    title: 'Products in Stock',
    value: '540',
    change: '-5%',
    icon: Package,
    trend: 'down'
  }
];

const recentOrders = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    date: '2024-03-20',
    amount: '$156.00',
    status: 'Completed'
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    date: '2024-03-19',
    amount: '$245.00',
    status: 'Processing'
  },
  {
    id: 'ORD003',
    customer: 'Mike Johnson',
    date: '2024-03-19',
    amount: '$89.00',
    status: 'Pending'
  },
  {
    id: 'ORD004',
    customer: 'Sarah Williams',
    date: '2024-03-18',
    amount: '$432.00',
    status: 'Completed'
  }
];

const popularProducts = [
  {
    id: 'PRD001',
    name: 'Wireless Headphones',
    sales: 45,
    stock: 120,
    price: '$89.99'
  },
  {
    id: 'PRD002',
    name: 'Smart Watch',
    sales: 38,
    stock: 85,
    price: '$199.99'
  },
  {
    id: 'PRD003',
    name: 'Bluetooth Speaker',
    sales: 32,
    stock: 95,
    price: '$79.99'
  }
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${
                  stat.trend === 'up' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-xs md:text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs md:text-sm text-gray-500"> vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs md:text-sm text-gray-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3 hidden sm:table-cell">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="py-2 md:py-3">{order.id}</td>
                    <td className="py-2 md:py-3">{order.customer}</td>
                    <td className="py-2 md:py-3 hidden sm:table-cell">{order.date}</td>
                    <td className="py-2 md:py-3">{order.amount}</td>
                    <td className="py-2 md:py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Popular Products</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs md:text-sm text-gray-500">
                  <th className="pb-3">Product</th>
                  <th className="pb-3 hidden sm:table-cell">Sales</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Price</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {popularProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100">
                    <td className="py-2 md:py-3">{product.name}</td>
                    <td className="py-2 md:py-3 hidden sm:table-cell">{product.sales}</td>
                    <td className="py-2 md:py-3">{product.stock}</td>
                    <td className="py-2 md:py-3">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 