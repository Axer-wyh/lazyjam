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
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (payload: Partial<Product>) => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.isNew) {
        const saved = await apiRequest<Product[]>("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setProducts(saved);
      } else {
        const updated = { ...modal.product!, ...payload };
        const saved = await apiRequest<Product[]>("/api/products", {
          method: "PUT",
          body: JSON.stringify(updated),
        });
        setProducts(saved);
      }
      setModal(null);
      showToast("商品已保存");
    } catch {
      showToast("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除这个商品？")) return;
    try {
      const saved = await apiRequest<Product[]>("/api/products?id=" + id, {
        method: "DELETE",
      });
      setProducts(saved);
      showToast("商品已删除");
    } catch {
      showToast("删除失败，请重试");
    }
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
                <td>¥{product.price}</td>
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
          saving={saving}
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
  saving,
}: {
  product: Product | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
  saving?: boolean;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "Clay Earrings");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stockTag, setStockTag] = useState(product?.stockTag ?? "Small Batch");
  const [status, setStatus] = useState<Product["status"]>(product?.status ?? "draft");
  const [inventory, setInventory] = useState(product?.inventory ?? 0);
  const [cycle, setCycle] = useState(product?.cycle ?? "5-7 days");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [care, setCare] = useState(product?.care ?? "");
  const [note, setNote] = useState(product?.note ?? "");
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [materialsInput, setMaterialsInput] = useState(product?.materials?.join(", ") ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Product> = {
      name,
      category,
      price: Number(price),
      stockTag: stockTag as Product["stockTag"],
      status,
      inventory: Number(inventory),
      cycle,
      material,
      size,
      care,
      note,
      tags,
      imageUrl,
      description,
      materials: materialsInput.split(",").map((m) => m.trim()).filter(Boolean),
      featured,
    };
    onSave(payload);
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
            {/* Image preview + URL input */}
            <div style={{ marginBottom: 14 }}>
              <p className="admin-label" style={{ marginBottom: 8 }}>商品图片</p>
              {imageUrl && (
                <div className="admin-thumb" style={{ width: 120, height: 120, marginBottom: 8, borderRadius: 6, overflow: "hidden" }}>
                  <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <input
                className="admin-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="粘贴图片 URL https://images.unsplash.com/..."
                style={{ width: "100%" }}
              />
            </div>

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
                <label className="admin-label">库存数量</label>
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
                  <option value="active">上架</option>
                  <option value="draft">草稿</option>
                  <option value="sold_out">售罄</option>
                </select>
              </div>
              <div className="field" style={fieldStyle}>
                <label className="admin-label">精选商品</label>
                <select className="admin-select" value={featured ? "true" : "false"} onChange={(e) => setFeatured(e.target.value === "true")}>
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">商品描述</label>
                <textarea className="admin-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">材质（用逗号分隔）</label>
                <input className="admin-input" value={materialsInput} onChange={(e) => setMaterialsInput(e.target.value)} placeholder="Polymer clay, brass post" />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", display: "grid", gap: 7 }}>
                <label className="admin-label">材质详情</label>
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
            <button className="admin-btn" type="submit" disabled={saving}>{saving ? "保存中..." : "保存商品"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
