"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { PageConfig, SiteConfig } from "@/lib/types";

export default function AdminPagesPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [editing, setEditing] = useState<PageConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<SiteConfig>("/api/pages").then(setConfig);
  }, []);

  function updatePage(page: PageConfig) {
    if (!config) return;
    setConfig({
      ...config,
      pages: config.pages.map((item) => (item.slug === page.slug ? page : item))
    });
    setEditing(page);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    const saved = await apiRequest<SiteConfig>("/api/pages", {
      method: "PUT",
      body: JSON.stringify(config)
    });
    setConfig(saved);
    setEditing(null);
    setSaving(false);
  }

  return (
    <div>
      <p className="admin-label">Pages</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">页面管理</h1>
      <div className="mt-8 overflow-x-auto border border-charcoal/12 bg-parchment">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-charcoal/12 text-charcoal/58">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">Eyebrow</th>
              <th className="px-4 py-3">更新时间</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {config?.pages.map((page) => (
              <tr key={page.slug} className="border-b border-charcoal/8">
                <td className="px-4 py-3">{page.slug}</td>
                <td className="px-4 py-3">{page.title}</td>
                <td className="px-4 py-3">{page.eyebrow}</td>
                <td className="px-4 py-3">{new Date(page.updatedAt).toLocaleString("zh-CN")}</td>
                <td className="px-4 py-3 text-right">
                  <button className="admin-button-secondary" onClick={() => setEditing(page)} type="button">
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/55 px-4">
          <div className="w-full max-w-2xl bg-linen p-6">
            <h2 className="font-serif text-3xl text-charcoal">编辑 {editing.slug}</h2>
            <div className="mt-6 grid gap-4">
              <label>
                <span className="admin-label">标题</span>
                <input className="admin-input mt-2" value={editing.title} onChange={(event) => updatePage({ ...editing, title: event.target.value })} />
              </label>
              <label>
                <span className="admin-label">Eyebrow</span>
                <input className="admin-input mt-2" value={editing.eyebrow} onChange={(event) => updatePage({ ...editing, eyebrow: event.target.value })} />
              </label>
              <label>
                <span className="admin-label">描述</span>
                <textarea className="admin-input mt-2 min-h-28" value={editing.description} onChange={(event) => updatePage({ ...editing, description: event.target.value })} />
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button className="admin-button-secondary" onClick={() => setEditing(null)} type="button">
                取消
              </button>
              <button className="admin-button" onClick={save} disabled={saving} type="button">
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
