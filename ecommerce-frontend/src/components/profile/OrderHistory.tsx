import type { Order } from '@/types';

type OrderHistoryProps = {
  ordersHistory?: Order[];
};

export function OrderHistory({ ordersHistory }: OrderHistoryProps) {
  if (!ordersHistory || ordersHistory.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <ul className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-4 bg-gray-50">
        {ordersHistory.map((order) => (
          <li
            key={order.id}
            className="flex justify-between items-center border-b last:border-b-0 pb-2"
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p>${order.total.toFixed(2)}</p>
              <p className="text-sm text-primary font-semibold">{order.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
