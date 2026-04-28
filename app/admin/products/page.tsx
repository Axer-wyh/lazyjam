"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { Product } from "@/lib/types";

const stockClass: Record<string, string> = {
  "Small Batch": "small-batch",
  "Made to Order": "made-order",
  "One of a Kind": "one-kind",
  "Sold Out": "sold-out",
};

const tagList = ["clay", "bead", "pearl", "linen", "earrings", "necklace", "bracelet", "one-off"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [modal, setModal] = useState<{ product: Product | null; isNew: boolean } | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    apiRequest<Product[]>("/api/products").then(setProducts);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const filtered = products
    .filter((p) => categoryFilter === "all" || p.category === categoryFilter)
    .filter((p) => stockFilter === "all" || p.stockTag === stockFilter);

  const handleSave = (payload: Partial<Product>) => {
    if (modal?.isNew) {
      setProducts((prev) => [
        {
          ...prev[0],
          id: String(Date.now()),
          name: "",
          category: "Clay Earrings",
          price: 0,
          imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80",
          description: "",
          materials: [],
          inventory: 0,
          featured: false,
          status: "draft",
          stockTag: "Small Batch",
          cycle: "5-7 days",
          material: "",
          size: "",
          care: "",
          note: "",
          tags: [],
          createdAt: new Date().toISOString(),
          ...payload,
        },
        ...prev,
      ]);
    } else if (modal?.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === modal.product!.id ? { ...p, ...payload } : p))
      );
    }
    setModal(null);
    showToast("商品已保存");
  };

  const handleDelete = (id: string) => {
    if (!confirm("确认删除这个商品？")) return;
    setProducts((p) => p.filter((x) => x.id !== id));
    showToast("商品已删除");
  };

  return (
    <div>
      <div className="toolbar">
        <div className="filters">
          <select className="admin-select filter-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="商品分类筛选">
            <option value="all">全部分类</option>
            {["Clay Earrings", "Bead Necklace", "Bracelet", "Mixed Pair"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="admin-select filter-control" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} aria-label="库存状态筛选">
            <option value="all">全部库存</option>
            {["Small Batch", "Made to Order", "One of a Kind", "Sold Out"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="admin-btn" type="button" onClick={() => setModal({ product: null, isNew: true })}>
          + 新增商品
        </button>
      </div>

      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>商品</th>
              <th>价格</th>
              <th>库存标签</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--weathered-taupe)", padding: 34 }}>
                  没有匹配的商品。
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="admin-thumb">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{product.name}</div>
                      <div style={{ color: "var(--weathered-taupe)", fontSize: 12 }}>{product.category}</div>
                    </div>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>
                  <span className={`status-badge status-${stockClass[product.stockTag] ?? product.stockTag}`}>
                    {product.stockTag}
                  </span>
                </td>
                <td>{product.status}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost" type="button" onClick={() => setModal({ product, isNew: false })}>
                    编辑
                  </button>
                  <button className="admin-btn admin-btn-ghost admin-btn-danger" type="button" onClick={() => handleDelete(product.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <ProductModal
          product={modal.product}
          isNew={modal.isNew}
          onClose={() => setModal(null)}
          onSave={handleSave}
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

function ProductModal({
  product,
  isNew,
  onClose,
  onSave,
}: {
  product: Product | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "Clay Earrings");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stockTag, setStockTag] = useState(product?.stockTag ?? "Small Batch");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [inventory, setInventory] = useState(product?.inventory ?? 0);
  const [cycle, setCycle] = useState(product?.cycle ?? "5-7 days");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [care, setCare] = useState(product?.care ?? "");
  const [note, setNote] = useState(product?.note ?? "");
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category, price, stockTag, status, inventory, cycle, material, size, care, note, tags });
  };

  const fieldStyle = { display: "grid", gap: 7 };

  return (
    <div className="modal-overlay is-open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal large">
        <div className="modal-header">
          <h2 className="modal-title">{isNew ? "新增商品" : "编辑商品"}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">商品名称</label>
                <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">分类</label>
                <select className="admin-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {["Clay Earrings", "Bead Necklace", "Bracelet", "Mixed Pair"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">价格</label>
                <input className="admin-input" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">库存</label>
                <input className="admin-input" type="number" min={0} value={inventory} onChange={(e) => setInventory(Number(e.target.value))} />
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">制作周期</label>
                <input className="admin-input" value={cycle} onChange={(e) => setCycle(e.target.value)} />
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">库存标签</label>
                <select className="admin-select" value={stockTag} onChange={(e) => setStockTag(e.target.value as Product["stockTag"])}>
                  {Object.keys(stockClass).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">状态</label>
                <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value as Product["status"])}>
                  {["已上架", "草稿", "售罄展示"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">材质</label>
                <textarea className="admin-textarea" value={material} onChange={(e) => setMaterial(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">尺寸</label>
                <textarea className="admin-textarea" value={size} onChange={(e) => setSize(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">护理说明</label>
                <textarea className="admin-textarea" value={care} onChange={(e) => setCare(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">手作差异说明</label>
                <textarea className="admin-textarea" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">标签选择</label>
                <div className="tag-options" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tagList.map((tag) => (
                    <label key={tag} className="check-pill" style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={tags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        style={{ display: "none" }}
                      />
                      {tags.includes(tag) && <span>✓ </span>}{tag}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="admin-btn admin-btn-secondary" type="button" onClick={onClose}>取消</button>
            <button className="admin-btn" type="submit">保存商品</button>
          </div>
        </form>
      </div>
    </div>
  );
}
