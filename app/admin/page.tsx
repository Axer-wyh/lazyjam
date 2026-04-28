"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { Order, Product, Section, SiteConfig } from "@/lib/types";

export default function AdminDashboard() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      apiRequest<SiteConfig>("/api/pages"),
      apiRequest<Section[]>("/api/sections"),
      apiRequest<Product[]>("/api/products"),
      apiRequest<Order[]>("/api/orders")
    ]).then(([siteConfig, sectionData, productData, orderData]) => {
      setConfig(siteConfig);
      setSections(sectionData);
      setProducts(productData);
      setOrders(orderData);
    });
  }, []);

  const stats = useMemo(
    () => [
      { label: "页面", value: config?.pages.length || 0 },
      { label: "启用板块", value: sections.filter((section) => section.isActive).length },
      { label: "在售商品", value: products.filter((product) => product.status === "active").length },
      { label: "订单", value: orders.length }
    ],
    [config, orders, products, sections]
  );

  return (
    <div>
      <p className="admin-label">Dashboard</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">后台首页</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-charcoal/12 bg-parchment p-5">
            <p className="text-sm text-charcoal/58">{stat.label}</p>
            <p className="mt-3 font-serif text-5xl text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 border border-charcoal/12 bg-parchment p-6">
        <h2 className="font-serif text-3xl text-charcoal">内容状态</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/66">
          页面、板块、商品和订单都通过 Next.js API routes 读写 `data/` 下的 JSON 文件。当前版本适合小体量内容管理，后续可平滑替换为数据库。
        </p>
      </div>
    </div>
  );
}
