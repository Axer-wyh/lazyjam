"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { Order } from "@/lib/types";

const orderClass: Record<string, string> = {
  pending: "pending",
  paid: "paid",
  making: "making",
  shipped: "shipped",
  completed: "completed",
  refunded: "refunded",
};

const statusLabels: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  making: "制作中",
  shipped: "已发货",
  completed: "已完成",
  refunded: "已退款",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [detailModal, setDetailModal] = useState<Order | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    apiRequest<Order[]>("/api/orders").then(setOrders);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const filtered = orders
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) => !startDate || o.createdAt >= startDate)
    .filter((o) => !endDate || o.createdAt <= endDate);

  const advanceOrder = async (id: string) => {
    const flow = ["pending", "paid", "making", "shipped", "completed"] as const;
    const order = orders.find((o) => o.id === id);
    if (!order || order.status === "refunded") return;
    const idx = flow.indexOf(order.status as typeof flow[number]);
    const nextStatus = flow[Math.min(idx + 1, flow.length - 1)];
    try {
      const updated = { ...order, status: nextStatus };
      const saved = await apiRequest<Order[]>("/api/orders", {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      setOrders(saved);
      showToast("订单状态已推进");
      // refresh detail modal if open
      if (detailModal?.id === id) {
        const refreshed = saved.find((o) => o.id === id);
        if (refreshed) setDetailModal(refreshed);
      }
    } catch {
      showToast("更新失败，请重试");
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div className="filters">
          <select
            className="admin-select filter-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="订单状态筛选"
          >
            <option value="all">全部订单</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input
            className="admin-input filter-control"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="开始日期"
          />
          <input
            className="admin-input filter-control"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="结束日期"
          />
        </div>
      </div>

      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>金额</th>
              <th>状态</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--weathered-taupe)", padding: 34 }}>
                  没有匹配的订单。
                </td>
              </tr>
            )}
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>
                  <button
                    className="admin-btn admin-btn-ghost"
                    type="button"
                    style={{ fontFamily: "monospace", fontSize: 12 }}
                    onClick={() => setDetailModal(order)}
                  >
                    {order.id}
                  </button>
                </td>
                <td style={{ fontWeight: 700 }}>{order.customer}</td>
                <td>${order.total}</td>
                <td>
                  <span className={`status-badge status-${orderClass[order.status] ?? order.status}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </td>
                <td>{order.createdAt?.split("T")[0] ?? order.createdAt}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost" type="button" onClick={() => setDetailModal(order)}>
                    查看
                  </button>
                  <button className="admin-btn admin-btn-ghost" type="button" onClick={() => advanceOrder(order.id)}>
                    推进
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailModal && (
        <OrderDetailModal
          order={detailModal}
          onClose={() => setDetailModal(null)}
          onAdvance={() => advanceOrder(detailModal.id)}
        />
      )}

      {toast && <div className="toast is-showing">{toast}</div>}

      <style>{`
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .filter-control { height: 38px; min-width: 154px; padding: 0 10px; }
      `}</style>
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onAdvance,
}: {
  order: Order;
  onClose: () => void;
  onAdvance: () => void;
}) {
  return (
    <div className="modal-overlay is-open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal large">
        <div className="modal-header">
          <h2 className="modal-title">{order.id}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <ul className="line-items">
            <li>
              <span>{order.productName} × {order.quantity}</span>
              <strong>${order.total}</strong>
            </li>
          </ul>
          <dl style={{ display: "grid", gap: 12, margin: 0 }}>
            <div className="detail-row">
              <dt>客户</dt>
              <dd>{order.customer}</dd>
            </div>
            <div className="detail-row">
              <dt>配送信息</dt>
              <dd>{order.shipping}</dd>
            </div>
            <div className="detail-row">
              <dt>支付状态</dt>
              <dd>{order.payment}</dd>
            </div>
            <div className="detail-row">
              <dt>订单状态</dt>
              <dd>
                <span className={`status-badge status-${orderClass[order.status] ?? order.status}`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
              </dd>
            </div>
            <div className="detail-row">
              <dt>备注</dt>
              <dd>{order.note}</dd>
            </div>
          </dl>
        </div>
        <div className="modal-footer">
          <button className="admin-btn admin-btn-secondary" type="button" onClick={onClose}>关闭</button>
          <button className="admin-btn" type="button" onClick={onAdvance}>推进状态</button>
        </div>
      </div>
    </div>
  );
}
