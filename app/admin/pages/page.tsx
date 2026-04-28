"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";

type Page = {
  id: number;
  name: string;
  path: string;
  status: "draft" | "published";
  updated: string;
};

const stockClass: Record<string, string> = {
  "Small Batch": "small-batch",
  "Made to Order": "made-order",
  "One of a Kind": "one-kind",
  "Sold Out": "sold-out",
};

const statusClass: Record<string, string> = {
  draft: "draft",
  published: "published",
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<{ page: Page | null; isNew: boolean } | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    apiRequest<{ pages: Page[] }>("/api/pages").then((d) => setPages(d.pages ?? []));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const filtered = pages.filter(
    (p) => statusFilter === "all" || p.status === statusFilter
  );

  const handleSave = (payload: Partial<Page> & { name: string; path: string; status: "draft" | "published" }) => {
    if (modal?.isNew) {
      setPages((prev) => [
        { id: Date.now(), ...payload, updated: new Date().toISOString().slice(0, 16).replace("T", " ") },
        ...prev,
      ]);
    } else if (modal?.page) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === modal.page!.id
            ? { ...p, ...payload, updated: new Date().toISOString().slice(0, 16).replace("T", " ") }
            : p
        )
      );
    }
    setModal(null);
    showToast("页面已保存");
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
              <th>路径</th>
              <th>状态</th>
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
              <tr key={page.id}>
                <td style={{ fontWeight: 700 }}>{page.name}</td>
                <td style={{ color: "var(--weathered-taupe)", fontFamily: "monospace", fontSize: 13 }}>{page.path}</td>
                <td>
                  <span className={`status-badge status-${statusClass[page.status] ?? page.status}`}>
                    {page.status === "published" ? "已发布" : "草稿"}
                  </span>
                </td>
                <td>{page.updated}</td>
                <td>
                  <button
                    className="admin-btn admin-btn-ghost"
                    type="button"
                    onClick={() => setModal({ page, isNew: false })}
                  >
                    编辑
                  </button>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-danger"
                    type="button"
                    onClick={() => {
                      if (confirm("确认删除这个页面？")) {
                        setPages((p) => p.filter((x) => x.id !== page.id));
                        showToast("页面已删除");
                      }
                    }}
                  >
                    删除
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
}: {
  page: Page | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Partial<Page> & { name: string; path: string; status: "draft" | "published" }) => void;
}) {
  const [name, setName] = useState(page?.name ?? "");
  const [path, setPath] = useState(page?.path ?? "/");
  const [status, setStatus] = useState<"draft" | "published">(page?.status ?? "draft");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.startsWith("/")) {
      alert("路径必须以 / 开头");
      return;
    }
    onSave({ name, path, status });
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
                <label className="admin-label">页面名称</label>
                <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label className="admin-label">路径</label>
                <input className="admin-input" value={path} onChange={(e) => setPath(e.target.value)} required />
              </div>
              <div className="field">
                <label className="admin-label">状态</label>
                <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="admin-btn admin-btn-secondary" type="button" onClick={onClose}>取消</button>
            <button className="admin-btn" type="submit">保存页面</button>
          </div>
        </form>
      </div>
      <style>{`.field { display: grid; gap: 7px; }`}</style>
    </div>
  );
}
