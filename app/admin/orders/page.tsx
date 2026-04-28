'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
  notes: string;
}

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-100 text-yellow-700',
  'paid': 'bg-blue-100 text-blue-700',
  'making': 'bg-purple-100 text-purple-700',
  'shipped': 'bg-green-100 text-green-700',
  'completed': 'bg-gray-100 text-gray-500',
  'refunded': 'bg-red-100 text-red-600',
};

const statusLabels: Record<string, string> = {
  'pending': '待付款',
  'paid': '已付款',
  'making': '制作中',
  'shipped': '已发货',
  'completed': '已完成',
  'refunded': '已退款',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data.orders || []));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-charcoal">订单管理</h1>
        <p className="mt-1 text-sm text-taupe">查看和处理所有订单，筛选和导出订单数据</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'pending', 'paid', 'making', 'shipped', 'completed', 'refunded'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs ${filter === f ? 'bg-charcoal text-linen' : 'bg-warm-oat text-taupe hover:bg-stone/50'}`}
          >
            {f === 'all' ? '全部' : statusLabels[f]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone/40">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone bg-warm-oat text-left">
              <th className="px-4 py-3 font-medium text-taupe">订单号</th>
              <th className="px-4 py-3 font-medium text-taupe">客户</th>
              <th className="px-4 py-3 font-medium text-taupe">金额</th>
              <th className="px-4 py-3 font-medium text-taupe">状态</th>
              <th className="px-4 py-3 font-medium text-taupe">日期</th>
              <th className="px-4 py-3 font-medium text-taupe">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, i) => (
              <tr key={order.id} className={`border-b border-stone/30 hover:bg-warm-oat/50 ${i % 2 === 0 ? 'bg-linen' : 'bg-warm-oat/20'}`}>
                <td className="px-4 py-3 font-mono text-xs text-charcoal">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-charcoal">{order.customer}</p>
                    <p className="text-xs text-taupe">{order.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal">¥{order.total}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-taupe">{order.createdAt}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedOrder(order)} className="text-xs text-accent hover:underline">查看详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-taupe">暂无订单</div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50">
      <div className="w-full max-w-2xl rounded-xl bg-linen p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal">订单详情</h2>
          <button onClick={onClose} className="text-taupe hover:text-charcoal">✕</button>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-charcoal">{order.orderNumber}</p>
            <p className="mt-1 text-xs text-taupe">{order.createdAt}</p>
          </div>
          <span className={`rounded px-3 py-1 text-sm ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-taupe">客户信息</p>
            <p className="mt-1 text-sm text-charcoal">{order.customer}</p>
            <p className="text-xs text-taupe">{order.email}</p>
            <p className="text-xs text-taupe">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs text-taupe">收货地址</p>
            <p className="mt-1 text-sm text-charcoal">{order.address}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs text-taupe">商品明细</p>
          <div className="rounded-lg border border-stone/30 bg-warm-oat/50">
            {order.items.map((item, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-stone/20' : ''}`}>
                <div>
                  <p className="text-sm text-charcoal">{item.name}</p>
                  <p className="text-xs text-taupe">× {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-charcoal">¥{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-stone/30 px-4 py-3 bg-linen">
              <p className="text-sm font-medium text-charcoal">合计</p>
              <p className="text-base font-semibold text-accent">¥{order.total}</p>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mb-5">
            <p className="text-xs text-taupe">备注</p>
            <p className="mt-1 text-sm text-charcoal">{order.notes}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-charcoal px-5 py-2 text-sm text-linen hover:bg-charcoal/90">关闭</button>
        </div>
      </div>
    </div>
  );
}