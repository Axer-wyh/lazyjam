import type { Product } from "@/lib/types";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

type ProductCardProps = {
  product: Product;
};

const categoryLabel: Record<string, string> = {
  "Clay Earrings": "粘土手作",
  "Bead Necklace": "串珠首饰",
  "Bracelet": "手绑",
  "Mixed Pair": "混合材质"
};

export default function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.status === "sold_out" || product.inventory <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    // Visual feedback
    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = "✓ 已加入";
    setTimeout(() => { btn.textContent = "加入购物车"; }, 1800);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <article>
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
      {!isSoldOut && (
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          type="button"
        >
          加入购物车
        </button>
      )}

      <style>{`
        .add-to-cart-btn {
          margin-top: 12px;
          width: 100%;
          min-height: 38px;
          border: 1px solid var(--charcoal-clay);
          border-radius: 6px;
          background: transparent;
          color: var(--charcoal-clay);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease;
        }
        .add-to-cart-btn:hover {
          background: var(--charcoal-clay);
          color: var(--raw-linen);
        }
      `}</style>
    </article>
    </Link>
  );
}