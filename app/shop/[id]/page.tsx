"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/client-api";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  "Clay Earrings": "粘土手作",
  "Bead Necklace": "串珠首饰",
  "Bracelet": "手绑",
  "Mixed Pair": "混合材质"
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiRequest<Product[]>(`/api/products`)
      .then((products) => {
        const found = products.find((p) => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          setError("商品未找到");
        }
      })
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || isSoldOut) return;
    addToCart({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-charcoal/60">加载中...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-red-600">{error || "商品未找到"}</p>
        <a href="/shop" className="mt-4 inline-block text-sm text-persimmon hover:underline">
          返回商店
        </a>
      </div>
    );
  }

  const isSoldOut = product.status === "sold_out" || product.inventory <= 0;

  return (
    <>
      <div style={{ height: "var(--header-height)" }} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <a href="/shop" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal">
          ← 返回商店
        </a>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="ex-libris-frame overflow-hidden bg-parchment p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-persimmon">
            {categoryLabel[product.category] || product.category}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-charcoal sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 text-3xl font-semibold text-charcoal">¥{product.price}</p>

          <div className="mt-8 space-y-4 border-t border-charcoal/10 pt-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-charcoal/50">库存</span>
                <p className="mt-1 font-semibold text-charcoal">
                  {isSoldOut ? "已售罄" : `${product.inventory} 件`}
                </p>
              </div>
              <div>
                <span className="text-charcoal/50">材质</span>
                <p className="mt-1 font-semibold text-charcoal">
                  {product.materials.join(" / ")}
                </p>
              </div>
              {product.material && (
                <div>
                  <span className="text-charcoal/50">规格</span>
                  <p className="mt-1 font-semibold text-charcoal">{product.material}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <span className="text-charcoal/50">尺寸</span>
                  <p className="mt-1 font-semibold text-charcoal">{product.size}</p>
                </div>
              )}
              <div>
                <span className="text-charcoal/50">工期</span>
                <p className="mt-1 font-semibold text-charcoal">{product.cycle}</p>
              </div>
              <div>
                <span className="text-charcoal/50">标签</span>
                <p className="mt-1 font-semibold text-charcoal">{product.stockTag}</p>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/50">
                商品描述
              </h2>
              <p className="mt-3 leading-7 text-charcoal/80">{product.description}</p>
            </div>
          )}

          {product.care && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/50">
                保养说明
              </h2>
              <p className="mt-3 leading-7 text-charcoal/80">{product.care}</p>
            </div>
          )}

          {product.note && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/50">
                备注
              </h2>
              <p className="mt-3 leading-7 text-charcoal/80">{product.note}</p>
            </div>
          )}

          {/* Action buttons */}
          {!isSoldOut ? (
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 min-h-[48px] rounded-lg border border-charcoal-clay bg-transparent text-charcoal-clay font-semibold text-sm tracking-wide transition-colors hover:bg-charcoal-clay hover:text-raw-linen"
                type="button"
              >
                {addedToCart ? "✓ 已加入购物车" : "加入购物车"}
              </button>
              <a
                href="/shop"
                className="flex-1 min-h-[48px] rounded-lg bg-charcoal-clay text-raw-linen font-semibold text-sm tracking-wide flex items-center justify-center transition-opacity hover:opacity-80"
              >
                继续逛逛
              </a>
            </div>
          ) : (
            <div className="mt-8 py-4 text-center text-sm text-charcoal/45">此商品已售罄</div>
          )}
        </div>
      </div>
    </section>
  );
}