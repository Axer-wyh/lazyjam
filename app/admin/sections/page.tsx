'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/client-api';
import type { Section } from '@/lib/types';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState<Section | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    apiRequest<Section[]>('/api/sections').then(setSections);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const filtered = sections
    .filter((s) => statusFilter === 'all' || (statusFilter === 'active' ? s.isActive : !s.isActive))
    .sort((a, b) => a.order - b.order);

  const handleSave = (payload: Partial<Section>) => {
    if (!modal) return;
    setSections((prev) =>
      prev.map((s) => (s.id === modal.id ? { ...s, ...payload } : s))
    );
    setModal(null);
    showToast('板块配置已保存');
  };

  return (
    <div>
      <div className="toolbar">
        <div className="filters">
          <select
            className="admin-select filter-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="板块显示状态筛选"
          >
            <option value="all">全部板块</option>
            <option value="active">显示中</option>
            <option value="hidden">已隐藏</option>
          </select>
        </div>
      </div>

      <div className="section-grid">
        {filtered.map((section) => (
          <div key={section.id} className="section-card">
            <div className="section-preview">
              <img src={section.imageUrl} alt={section.title} loading="lazy" />
            </div>
            <div className="section-body">
              <div className="section-head">
                <h2 className="section-title" style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 25, lineHeight: 1.05 }}>
                  {section.title}
                </h2>
                <span className={`status-badge status-${section.isActive ? 'active' : 'hidden'}`}>
                  {section.isActive ? '显示中' : '已隐藏'}
                </span>
              </div>
              <p className="section-meta">
                <span>链接：{section.href}</span>
                <span>顺序：{section.order}</span>
              </p>
              <button
                className="admin-btn admin-btn-secondary"
                type="button"
                style={{ marginTop: 14 }}
                onClick={() => setModal(section)}
              >
                编辑配置
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <SectionModal
          section={modal}
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
        .section-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .section-card {
          overflow: hidden;
          border: 1px solid rgba(201,191,175,0.72);
          border-radius: 6px;
          background: rgba(255,252,245,0.74);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .section-preview {
          height: 150px;
          background: var(--warm-oat);
          overflow: hidden;
        }
        .section-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .section-body { padding: 14px; }
        .section-head {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .section-meta {
          display: grid;
          gap: 5px;
          margin: 0;
          color: var(--weathered-taupe);
          font-size: 12px;
        }
        @media (max-width: 1080px) {
          .section-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .section-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function SectionModal({
  section,
  onClose,
  onSave,
}: {
  section: Section;
  onClose: () => void;
  onSave: (p: Partial<Section>) => void;
}) {
  const [url, setUrl] = useState(section.href);
  const [order, setOrder] = useState(section.order);
  const [isActive, setIsActive] = useState(section.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ href: url, order: Number(order), isActive });
  };

  return (
    <div className="modal-overlay is-open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">编辑 {section.title}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: 14 }}>
              <p className="admin-label" style={{ marginBottom: 8 }}>当前背景图</p>
              <div className="admin-thumb" style={{ width: '100%', height: 180, borderRadius: 6 }}>
                <img src={section.imageUrl} alt={section.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div className="field">
                <label className="admin-label">链接 URL</label>
                <input className="admin-input" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div className="field">
                <label className="admin-label">显示顺序</label>
                <input className="admin-input" type="number" min={1} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
              </div>
              <div className="field">
                <label className="admin-label">状态</label>
                <select className="admin-select" value={isActive ? 'active' : 'hidden'} onChange={(e) => setIsActive(e.target.value === 'active')}>
                  <option value="active">显示中</option>
                  <option value="hidden">已隐藏</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="admin-btn admin-btn-secondary" type="button" onClick={onClose}>取消</button>
            <button className="admin-btn" type="submit">保存配置</button>
          </div>
        </form>
      </div>
      <style>{`.field { display: grid; gap: 7px; }`}</style>
    </div>
  );
}