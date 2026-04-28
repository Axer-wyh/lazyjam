"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { apiRequest } from "@/lib/client-api";
import type { Product, Section, SiteConfig } from "@/lib/types";

export default function HomePage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<SiteConfig>("/api/pages"),
      apiRequest<Section[]>("/api/sections"),
      apiRequest<Product[]>("/api/products")
    ])
      .then(([siteConfig, sectionData, productData]) => {
        setConfig(siteConfig);
        setSections(sectionData.filter((section) => section.isActive));
        setProducts(productData.filter((product) => product.status === "active"));
      })
      .finally(() => setLoading(false));
  }, []);

  const hero = sections.find((section) => section.type === "hero");
  const contentSections = sections.filter((section) => section.type !== "hero");
  const featuredProducts = useMemo(() => products.filter((product) => product.featured).slice(0, 4), [products]);

  if (loading || !hero) {
    return <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-20 text-charcoal/60">LazyJam 正在整理工作台...</div>;
  }

  return (
    <>
      <Hero section={hero} />
      <section className="border-y border-charcoal/10 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-charcoal/68 sm:px-6 lg:px-8">
          {config?.announcement}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-persimmon">Selected objects</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-charcoal sm:text-5xl">本期手作小物</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-charcoal/65">
            以低饱和色、自然边缘和可触摸的纹理为主。每个商品库存来自 JSON 数据，可在后台实时维护。
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="soft-paper bg-linen py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {contentSections.map((section) => (
            <a
              key={section.id}
              href={section.href}
              className="grid gap-6 border-t border-charcoal/18 py-8 md:grid-cols-[220px_1fr]"
            >
              <div className="ex-libris-frame bg-parchment p-3">
                <img src={section.imageUrl} alt={section.title} className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-persimmon">{section.subtitle}</p>
                <h3 className="mt-3 font-serif text-3xl text-charcoal">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/68">{section.description}</p>
                <span className="mt-5 inline-flex text-sm font-medium text-charcoal underline decoration-charcoal/30 underline-offset-4">
                  {section.ctaLabel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
