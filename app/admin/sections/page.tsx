'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/client-api';
import type { Section } from '@/lib/types';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState<Section | null>(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (payload: Partial<Section>) => {
    if (!modal) return;
    setSaving(true);
    try {
      const updated: Section = { ...modal, ...payload };
      const nextSections = sections.map((s) => (s.id === modal.id ? updated : s));
      await apiRequest<Section[]>('/api/sections', {
        method: 'PUT',
        body: JSON.stringify(nextSections),
      });
      setSections(nextSections);
      setModal(null);
      showToast('板块配置已保存');
    } catch {
      showToast('保存失败，请重试');
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
  saving,
}: {
  section: Section;
  onClose: () => void;
  onSave: (p: Partial<Section>) => void;
  saving?: boolean;
}) {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle);
  const [description, setDescription] = useState(section.description);
  const [imageUrl, setImageUrl] = useState(section.imageUrl);
  const [imagePreview, setImagePreview] = useState(section.imageUrl);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512000) {
      alert("图片建议小于 500KB，当前图片可能较大，上传后可能导致数据文件过大。");
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };
  const [href, setHref] = useState(section.href);
  const [ctaLabel, setCtaLabel] = useState(section.ctaLabel);
  const [order, setOrder] = useState(section.order);
  const [isActive, setIsActive] = useState(section.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, subtitle, description, imageUrl, href, ctaLabel, order: Number(order), isActive });
  };

  return (
    <div className="modal-overlay is-open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal large">
        <div className="modal-header">
          <h2 className="modal-title">编辑 {section.title}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: 14 }}>
              <p className="admin-label" style={{ marginBottom: 8 }}>当前背景图</p>
              <div className="admin-thumb" style={{ width: '100%', height: 180, borderRadius: 6 }}>
                <img src={imagePreview} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer' }}>
                  选择本地图片
                  <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: 12, color: 'var(--weathered-taupe)' }}>或</span>
                <input
                  className="admin-input"
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="粘贴图片 URL"
                  style={{ flex: 1, minWidth: 200 }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <label className="admin-label">板块标题</label>
                <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <label className="admin-label">副标题</label>
                <input className="admin-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <label className="admin-label">描述</label>
                <textarea className="admin-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="field">
                <label className="admin-label">链接 URL</label>
                <input className="admin-input" value={href} onChange={(e) => setHref(e.target.value)} />
              </div>
              <div className="field">
                <label className="admin-label">按钮文字</label>
                <input className="admin-input" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
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
            <button className="admin-btn" type="submit" disabled={saving}>{saving ? '保存中...' : '保存配置'}</button>
          </div>
        </form>
      </div>
      <style>{`.field { display: grid; gap: 7px; }`}</style>
    </div>
  );
}
