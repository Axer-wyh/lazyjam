"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { Order, Product, Section } from "@/lib/types";

export default function AdminDashboard() {
  const [pagesCount, setPagesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<{ pages: unknown[] }>("/api/pages"),
      apiRequest<Product[]>("/api/products"),
      apiRequest<Order[]>("/api/orders"),
    ]).then(([config, products, orderData]) => {
      setPagesCount((config as { pages?: unknown[] }).pages?.length ?? 0);
      setProductsCount(products.length);
      setOrdersCount(orderData.length);
      setOrders(orderData.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">页面</p>
          <p className="stat-value">{pagesCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">商品</p>
          <p className="stat-value">{productsCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">订单</p>
          <p className="stat-value">{ordersCount}</p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: 28 }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(201,191,175,0.58)" }}>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, color: "var(--charcoal-clay)" }}>
            最近订单
          </h2>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>客户</th>
                <th>金额</th>
                <th>状态</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 13 }}>{order.id}</td>
                  <td style={{ fontWeight: 700 }}>{order.customer}</td>
                  <td>¥{order.total}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status === "pending" ? "待付款" :
                       order.status === "paid" ? "已付款" :
                       order.status === "making" ? "制作中" :
                       order.status === "shipped" ? "已发货" :
                       order.status === "completed" ? "已完成" :
                       order.status === "refunded" ? "已退款" : order.status}
                    </span>
                  </td>
                  <td>{order.createdAt?.split("T")[0] ?? order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .stat-card {
          border: 1px solid rgba(201,191,175,0.72);
          border-radius: 6px;
          background: rgba(255,252,245,0.74);
          padding: 22px 20px;
        }
        .stat-label {
          margin: 0 0 8px;
          color: var(--weathered-taupe);
          font-size: 13px;
          font-weight: 600;
        }
        .stat-value {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 52px;
          font-weight: 600;
          line-height: 1;
          color: var(--charcoal-clay);
        }
        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }
        @media (max-width: 640px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
