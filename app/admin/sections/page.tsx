'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  linkText: string;
  order: number;
  enabled: boolean;
}

const sectionInfo: Record<string, { name: string; desc: string }> = {
  hero: { name: 'Hero 大图', desc: '首页顶部横幅区域' },
  featured: { name: '精选商品', desc: '首页精选商品展示' },
  craft: { name: '材料与工艺', desc: '工艺介绍图文区域' },
  collections: { name: 'Collections', desc: '产品系列入口' },
  journal: { name: 'Journal 日记', desc: '最新文章列表' },
  about: { name: 'About 关于', desc: '品牌故事区域' },
  newsletter: { name: 'Newsletter', desc: '邮件订阅区域' },
};

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<Section | null>(null);

  useEffect(() => {
    fetch('/api/sections')
      .then(res => res.json())
      .then(data => setSections(data.sections || []));
  }, []);

  const handleSave = async (section: Section) => {
    await fetch('/api/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(section),
    });
    const res = await fetch('/api/sections');
    const data = await res.json();
    setSections(data.sections || []);
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-charcoal">板块管理</h1>
        <p className="mt-1 text-sm text-taupe">配置网站各区域的背景图片和链接，点击卡片进入编辑</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(section => {
          const info = sectionInfo[section.key] || { name: section.key, desc: '' };
          return (
            <div
              key={section.id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-stone/40 bg-warm-oat transition hover:border-accent/50 hover:shadow-md"
              onClick={() => setEditing(section)}
            >
              <div className="relative h-36 overflow-hidden bg-linen">
                <img
                  src={section.image || '/images/product-placeholder.jpg'}
                  alt={info.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-charcoal">{info.name}</h3>
                    <p className="mt-0.5 text-xs text-taupe">{info.desc}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs ${section.enabled ? 'bg-sage/30 text-sage' : 'bg-gray-200 text-gray-500'}`}>
                    {section.enabled ? '已启用' : '已禁用'}
                  </span>
                </div>
                <div className="mt-3 text-xs text-taupe">
                  <p>标题：{section.title || '-'}</p>
                  <p>链接：{section.link ? section.link.slice(0, 30) + (section.link.length > 30 ? '...' : '') : '-'}</p>
                </div>
                <button className="mt-3 w-full rounded border border-stone bg-linen py-1.5 text-xs text-charcoal transition hover:border-accent hover:text-accent">
                  编辑配置
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <SectionModal
          section={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function SectionModal({ section, onSave, onClose }: { section: Section; onSave: (s: Section) => void; onClose: () => void }) {
  const [form, setForm] = useState(section);
  const info = sectionInfo[section.key] || { name: section.key, desc: '' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50">
      <div className="w-full max-w-xl rounded-xl bg-linen p-6 shadow-lg">
        <h2 className="mb-1 font-serif text-2xl text-charcoal">编辑板块：{info.name}</h2>
        <p className="mb-5 text-sm text-taupe">{info.desc}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-taupe">板块标题</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal"
            />
          </div>
          <div>
            <label className="block text-xs text-taupe">副标题</label>
            <input
              value={form.subtitle}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal"
            />
          </div>
          <div>
            <label className="block text-xs text-taupe">背景图片 URL</label>
            <input
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal"
            />
          </div>
          <div className="h-32 overflow-hidden rounded-lg border border-stone/50 bg-warm-oat">
            <img src={form.image || '/images/product-placeholder.jpg'} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <label className="block text-xs text-taupe">跳转链接 URL</label>
            <input
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
              placeholder="https://"
              className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal"
            />
          </div>
          <div>
            <label className="block text-xs text-taupe">按钮文字</label>
            <input
              value={form.linkText}
              onChange={e => setForm({ ...form, linkText: e.target.value })}
              className="mt-1 w-full rounded border border-stone bg-warm-oat px-3 py-2 text-sm text-charcoal"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked={form.enabled}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="h-4 w-4 accent-accent"
            />
            <label htmlFor="enabled" className="text-sm text-charcoal">启用此板块</label>
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