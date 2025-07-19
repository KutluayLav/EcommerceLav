"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get("http://localhost:5050/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err: any) {
        setError("Veriler alınamadı. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  if (!stats) {
    return null;
  }

  // Kartlar için veriler
  const statCards = [
    {
      title: "Toplam Satış",
      value: stats.totalSales ? `${stats.totalSales.toLocaleString("tr-TR")} ₺` : "-",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Toplam Sipariş",
      value: stats.orderCount,
      icon: ShoppingBag,
      trend: "up"
    },
    {
      title: "Toplam Müşteri",
      value: stats.customerCount,
      icon: Users,
      trend: "up"
    },
    {
      title: "Popüler Ürün",
      value: stats.popularProducts && stats.popularProducts[0] ? stats.popularProducts[0].name : "-",
      icon: Package,
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Yönetim Paneli</h1>
        <p className="text-sm md:text-base text-gray-600">Hoş geldiniz, Admin</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => {
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
                <div className={`p-2 md:p-3 rounded-lg bg-blue-50`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 text-blue-500`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Son Siparişler</h2>
          </div>
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs md:text-sm text-gray-500">
                  <th className="pb-3">Sipariş ID</th>
                  <th className="pb-3">Müşteri</th>
                  <th className="pb-3 hidden sm:table-cell">Tarih</th>
                  <th className="pb-3">Tutar</th>
                  <th className="pb-3">Durum</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {stats.recentOrders && stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="py-2 md:py-3">
                      <span className="text-xs md:text-xs text-gray-400 font-mono break-all">
                        {order._id.slice(0, 6)}...{order._id.slice(-4)}
                      </span>
                    </td>
                    <td className="py-2 md:py-3">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="py-2 md:py-3 hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td className="py-2 md:py-3">{order.totalPrice?.toLocaleString("tr-TR")} ₺</td>
                    <td className="py-2 md:py-3">
                      <span className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-400">Sipariş yok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popüler Ürünler */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Popüler Ürünler</h2>
          </div>
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs md:text-sm text-gray-500">
                  <th className="pb-3">Ürün</th>
                  <th className="pb-3">Satış</th>
                  <th className="pb-3">Stok</th>
                  <th className="pb-3">Fiyat</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {stats.popularProducts && stats.popularProducts.length > 0 ? stats.popularProducts.map((product: any, i: number) => (
                  <tr key={product._id || i} className="border-t border-gray-100">
                    <td className="py-2 md:py-3">{product.name}</td>
                    <td className="py-2 md:py-3">{product.sales ?? 0}</td>
                    <td className="py-2 md:py-3">{product.stock ?? '-'}</td>
                    <td className="py-2 md:py-3">{product.price?.toLocaleString("tr-TR")} ₺</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-400">Ürün yok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 