"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { apiRequest } from "@/lib/client-api";
import type { Product } from "@/lib/types";

const filters = [
  { value: "all", label: "全部" },
  { value: "clay", label: "粘土手作" },
  { value: "beads", label: "串珠首饰" },
  { value: "mixed", label: "混合材质" }
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiRequest<Product[]>("/api/products").then((data) =>
      setProducts(data.filter((product) => product.status === "active"))
    );
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((product) => filter === "all" || product.category === filter),
    [filter, products]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-persimmon">Shop</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-charcoal sm:text-7xl">小批量手作</h1>
        <p className="mt-5 text-base leading-8 text-charcoal/68">
          这里展示当前可售的 LazyJam 商品。后台新增、编辑或删除商品后，刷新此页即可同步。
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`border px-4 py-2 text-sm transition ${
              filter === item.value
                ? "border-charcoal bg-charcoal text-linen"
                : "border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal"
            }`}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
