'use client';

import { useState, useEffect } from 'react';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => setPages(data.pages || []));
  }, []);

  const filtered = filter === 'all' ? pages : pages.filter(p => p.status === filter);

  const handleSave = async (page: Page) => {
    const method = page.id ? 'PUT' : 'POST';
    const url = page.id ? `/api/pages?id=${page.id}` : '/api/pages';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    const res = await fetch('/api/pages');
    const data = await res.json();
    setPages(data.pages || []);
    setEditingPage(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该页面？')) return;
    await fetch(`/api/pages?id=${id}`, { method: 'DELETE' });
    const res = await fetch('/api/pages');
    const data = await res.json();
    setPages(data.pages || []);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">页面管理</h1>
          <p className="mt-1 text-sm text-taupe">管理网站各页面，创建、编辑和发布页面</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-accent px-4 py-2 text-sm text-white transition hover:bg-accent/90"
        >
          + 新建页面
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'draft', 'published'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs ${filter === f ? 'bg-charcoal text-linen' : 'bg-warm-oat text-taupe'}`}
          >
            {f === 'all' ? '全部' : f === 'draft' ? '草稿' : '已发布'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone/40">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone bg-warm-oat text-left">
              <th className="px-4 py-3 font-medium text-taupe">页面名称</th>
              <th className="px-4 py-3 font-medium text-taupe">路径</th>
              <th className="px-4 py-3 font-medium text-taupe">状态</th>
              <th className="px-4 py-3 font-medium text-taupe">最后更新</th>
              <th className="px-4 py-3 font-medium text-taupe">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((page, i) => (
              <tr key={page.id} className={`border-b border-stone/30 hover:bg-warm-oat/50 ${i % 2 === 0 ? 'bg-linen' : 'bg-warm-oat/20'}`}>
                <td className="px-4 py-3 font-medium text-charcoal">{page.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-taupe">/{page.slug}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs ${page.status === 'published' ? 'bg-sage/20 text-sage' : 'bg-gray-200 text-gray-500'}`}>
                    {page.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-4 py-3 text-taupe">{page.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => setEditingPage(page)} className="text-xs text-accent hover:underline">编辑</button>
                    <button onClick={() => handleDelete(page.id)} className="text-xs text-red-500 hover:underline">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-taupe">暂无页面</div>
        )}
      </div>

      {(editingPage || isAdding) && (
        <PageModal
          page={editingPage || { id: '', title: '', slug: '', status: 'draft', updatedAt: new Date().toISOString().split('T')[0] }}
          onSave={handleSave}
          onClose={() => { setEditingPage(null); setIsAdding(false); }}
        />
      )}
    </div>
  );
}

function PageModal({ page, onSave, onClose }: { page: Page; onSave: (p: Page) => void; onClose: () => void }) {
  const [form, setForm] = useState(page);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50">
      <div className="w-full max-w-md rounded-xl bg-linen p-6 shadow-lg">
        <h2 className="mb-4 font-serif text-2xl text-charcoal">{form.id ? '编辑页面' : '新建页面'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-taupe">页面名称</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
          </div>
          <div>
            <label className="block text-xs text-taupe">路径（slug）</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-taupe">/</span>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.replace(/\s/g, '-').toLowerCase() })} className="mt-1 flex-1 rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-taupe">状态</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal">
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-taupe hover:text-charcoal">取消</button>
          <button onClick={() => onSave({ ...form, updatedAt: new Date().toISOString().split('T')[0] })} className="bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90">保存</button>
        </div>
      </div>
    </div>
  );
}