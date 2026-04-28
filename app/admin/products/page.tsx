'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  stock: number;
  status: string;
  image: string;
  description: string;
  material: string;
  dimensions: string;
  care: string;
  notes: string;
}

const tagColors: Record<string, string> = {
  'Small Batch': 'bg-sage/20 text-sage',
  'Made to Order': 'bg-blue-100 text-blue-700',
  'One of a Kind': 'bg-accent/20 text-accent',
  'Sold Out': 'bg-gray-200 text-gray-500',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  const filtered = filter === 'all' ? products : products.filter(p => p.tags.includes(filter));

  const handleSave = async (product: Product) => {
    const method = product.id ? 'PUT' : 'POST';
    const url = product.id ? `/api/products?id=${product.id}` : '/api/products';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该商品？')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">商品管理</h1>
          <p className="mt-1 text-sm text-taupe">管理商品列表、价格、库存和上下架状态</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-accent px-4 py-2 text-sm text-white transition hover:bg-accent/90"
        >
          + 新增商品
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'Small Batch', 'Made to Order', 'One of a Kind', 'Sold Out'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs ${filter === f ? 'bg-charcoal text-linen' : 'bg-warm-oat text-taupe'}`}
          >
            {f === 'all' ? '全部' : f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone bg-warm-oat text-left">
              <th className="px-4 py-3 font-medium text-taupe">商品</th>
              <th className="px-4 py-3 font-medium text-taupe">价格</th>
              <th className="px-4 py-3 font-medium text-taupe">分类</th>
              <th className="px-4 py-3 font-medium text-taupe">标签</th>
              <th className="px-4 py-3 font-medium text-taupe">库存</th>
              <th className="px-4 py-3 font-medium text-taupe">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => (
              <tr key={product.id} className={`border-b border-stone/30 hover:bg-warm-oat/50 ${i % 2 === 0 ? 'bg-linen' : 'bg-warm-oat/20'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-12 w-12 rounded object-cover" />
                    <div>
                      <p className="font-medium text-charcoal">{product.name}</p>
                      <p className="text-xs text-taupe line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal">¥{product.price}</td>
                <td className="px-4 py-3 text-taupe">{product.category}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map(t => (
                      <span key={t} className={`rounded px-2 py-0.5 text-xs ${tagColors[t] || 'bg-gray-100 text-gray-600'}`}>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-taupe">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(product)} className="text-xs text-accent hover:underline">编辑</button>
                    <button onClick={() => handleDelete(product.id)} className="text-xs text-red-500 hover:underline">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingProduct || isAdding) && (
        <ProductModal
          product={editingProduct || {
            id: '', name: '', price: 0, category: '', tags: [], stock: 0, status: 'draft',
            image: '/images/product-placeholder.jpg', description: '', material: '', dimensions: '', care: '', notes: ''
          }}
          onSave={handleSave}
          onClose={() => { setEditingProduct(null); setIsAdding(false); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }: { product: Product; onSave: (p: Product) => void; onClose: () => void }) {
  const [form, setForm] = useState(product);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50">
      <div className="w-full max-w-2xl rounded-xl bg-linen p-6 shadow-lg">
        <h2 className="mb-4 font-serif text-2xl text-charcoal">{form.id ? '编辑商品' : '新增商品'}</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-xs text-taupe">商品名称</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-taupe">价格 (¥)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
            <div>
              <label className="block text-xs text-taupe">分类</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-taupe">图片 URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div>
            <label className="block text-xs text-taupe">描述</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-taupe">库存</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
            <div>
              <label className="block text-xs text-taupe">材质</label>
              <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
            <div>
              <label className="block text-xs text-taupe">尺寸</label>
              <input value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-taupe">护理说明</label>
            <textarea value={form.care} onChange={e => setForm({ ...form, care: e.target.value })} rows={2} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div>
            <label className="block text-xs text-taupe">手作差异说明</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div>
            <label className="block text-xs text-taupe">标签（用逗号分隔）</label>
            <input value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-taupe hover:text-charcoal">取消</button>
          <button onClick={() => onSave(form)} className="bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90">保存</button>
        </div>
      </div>
    </div>
  );
}