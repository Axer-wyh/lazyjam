import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

const categoryLabel: Record<Product["category"], string> = {
  clay: "粘土手作",
  beads: "串珠首饰",
  mixed: "混合材质"
};

export default function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.status === "sold_out" || product.inventory <= 0;

  return (
    <article className="group">
      <div className="ex-libris-frame overflow-hidden bg-parchment p-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-persimmon">
            {categoryLabel[product.category]}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-charcoal">{product.name}</h3>
        </div>
        <p className="shrink-0 text-sm font-semibold text-charcoal">¥{product.price}</p>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/68">{product.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-charcoal/55">
        <span>{product.materials.join(" / ")}</span>
        <span>{isSoldOut ? "已售罄" : `库存 ${product.inventory}`}</span>
      </div>
    </article>
  );
}
