"use client";

import type { Section } from "@/lib/types";

type SectionEditorProps = {
  section: Section;
  onChange: (section: Section) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
};

export default function SectionEditor({ section, onChange, onClose, onSave, saving }: SectionEditorProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/55 px-4">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-auto bg-linen p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="admin-label">Section editor</p>
            <h2 className="mt-2 font-serif text-3xl text-charcoal">{section.title || "新板块"}</h2>
          </div>
          <button onClick={onClose} className="admin-button-secondary" type="button">
            关闭
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="admin-label">标题</span>
            <input className="admin-input mt-2" value={section.title} onChange={(event) => onChange({ ...section, title: event.target.value })} />
          </label>
          <label className="block">
            <span className="admin-label">副标题</span>
            <input className="admin-input mt-2" value={section.subtitle} onChange={(event) => onChange({ ...section, subtitle: event.target.value })} />
          </label>
          <label className="block sm:col-span-2">
            <span className="admin-label">描述</span>
            <textarea className="admin-input mt-2 min-h-28" value={section.description} onChange={(event) => onChange({ ...section, description: event.target.value })} />
          </label>
          <label className="block">
            <span className="admin-label">图片 URL</span>
            <input className="admin-input mt-2" value={section.imageUrl} onChange={(event) => onChange({ ...section, imageUrl: event.target.value })} />
          </label>
          <label className="block">
            <span className="admin-label">链接</span>
            <input className="admin-input mt-2" value={section.href} onChange={(event) => onChange({ ...section, href: event.target.value })} />
          </label>
          <label className="block">
            <span className="admin-label">按钮文字</span>
            <input className="admin-input mt-2" value={section.ctaLabel} onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })} />
          </label>
          <label className="block">
            <span className="admin-label">排序</span>
            <input className="admin-input mt-2" type="number" value={section.order} onChange={(event) => onChange({ ...section, order: Number(event.target.value) })} />
          </label>
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input type="checkbox" checked={section.isActive} onChange={(event) => onChange({ ...section, isActive: event.target.checked })} />
            前台显示
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button onClick={onClose} className="admin-button-secondary" type="button">
            取消
          </button>
          <button onClick={onSave} className="admin-button" type="button" disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
