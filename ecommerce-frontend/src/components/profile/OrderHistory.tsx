import type { Order } from '@/types';
import { useState, useEffect } from 'react';

type OrderHistoryProps = {
  ordersHistory?: Order[];
};

export function OrderHistory({ ordersHistory }: OrderHistoryProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null; // veya bir skeleton

  if (!ordersHistory || ordersHistory.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <ul className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-4 bg-gray-50">
        {ordersHistory.map((order) => (
          <li key={order._id} className="flex justify-between items-center border-b last:border-b-0 pb-2">
            <div>
              <p className="font-semibold">Order #{order._id}</p>
              <p className="text-sm text-gray-600">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
              </p>
              <ul className="text-xs text-gray-700 mt-1">
                {order.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name || 'Ürün adı yok'} ({item.quantity} adet)
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <p>₺{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</p>
              <p className="text-sm text-primary font-semibold">{order.status || '-'}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
