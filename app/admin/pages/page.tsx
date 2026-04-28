"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { SiteConfig, PageConfig } from "@/lib/types";

export default function AdminPagesPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<{ page: PageConfig | null; isNew: boolean } | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<SiteConfig>("/api/pages").then(setConfig);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const filtered = (config?.pages ?? []).filter(
    (p) => statusFilter === "all" || p.status === statusFilter
  );

  const handleSave = async (payload: Partial<PageConfig> & { slug: string; title: string }) => {
    if (!config) return;
    setSaving(true);
    try {
      let nextPages: PageConfig[];
      if (modal?.isNew) {
        nextPages = [
          {
            slug: payload.slug,
            title: payload.title,
            eyebrow: payload.eyebrow ?? "",
            description: payload.description ?? "",
            updatedAt: new Date().toISOString(),
          },
          ...config.pages,
        ];
      } else if (modal?.page) {
        nextPages = config.pages.map((p) =>
          p.slug === modal.page!.slug
            ? { ...p, ...payload, updatedAt: new Date().toISOString() }
            : p
        );
      } else {
        setModal(null);
        setSaving(false);
        return;
      }
      const nextConfig: SiteConfig = { ...config, pages: nextPages };
      await apiRequest<SiteConfig>("/api/pages", {
        method: "PUT",
        body: JSON.stringify(nextConfig),
      });
      setConfig(nextConfig);
      setModal(null);
      showToast("页面已保存");
    } catch {
      showToast("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div className="filters">
          <select
            className="admin-select filter-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="页面状态筛选"
          >
            <option value="all">全部状态</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>
        <button className="admin-btn" type="button" onClick={() => setModal({ page: null, isNew: true })}>
          + 新建页面
        </button>
      </div>

      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>页面名称</th>
              <th>Slug</th>
              <th>描述</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--weathered-taupe)", padding: 34 }}>
                  没有匹配的页面。
                </td>
              </tr>
            )}
            {filtered.map((page) => (
              <tr key={page.slug}>
                <td style={{ fontWeight: 700 }}>{page.title}</td>
                <td style={{ color: "var(--weathered-taupe)", fontFamily: "monospace", fontSize: 13 }}>{page.slug}</td>
                <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.description}</td>
                <td>{page.updatedAt?.split("T")[0] ?? page.updatedAt}</td>
                <td>
                  <button
                    className="admin-btn admin-btn-ghost"
                    type="button"
                    onClick={() => setModal({ page, isNew: false })}
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <PageModal
          page={modal.page}
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
        .filter-control {
          height: 38px;
          min-width: 154px;
          padding: 0 10px;
        }
      `}</style>
    </div>
  );
}

function PageModal({
  page,
  isNew,
  onClose,
  onSave,
  saving,
}: {
  page: PageConfig | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Partial<PageConfig> & { slug: string; title: string }) => void;
  saving?: boolean;
}) {
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [title, setTitle] = useState(page?.title ?? "");
  const [eyebrow, setEyebrow] = useState(page?.eyebrow ?? "");
  const [description, setDescription] = useState(page?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ slug, title, eyebrow, description });
  };

  return (
    <div className="modal-overlay is-open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isNew ? "新建页面" : "编辑页面"}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field">
                <label className="admin-label">Slug</label>
                <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value)} required={isNew} disabled={!isNew} />
              </div>
              <div className="field">
                <label className="admin-label">页面标题</label>
                <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label className="admin-label">Eyebrow（小标题）</label>
                <input className="admin-input" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label className="admin-label">描述</label>
                <textarea className="admin-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="admin-btn admin-btn-secondary" type="button" onClick={onClose}>取消</button>
            <button className="admin-btn" type="submit" disabled={saving}>{saving ? "保存中..." : "保存页面"}</button>
          </div>
        </form>
      </div>
      <style>{`.field { display: grid; gap: 7px; }`}</style>
    </div>
  );
}
