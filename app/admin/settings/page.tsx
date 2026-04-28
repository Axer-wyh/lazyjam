"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { SiteConfig } from "@/lib/types";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<SiteConfig>("/api/pages").then(setConfig);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSave = async (payload: Partial<SiteConfig>) => {
    if (!config) return;
    setSaving(true);
    try {
      const nextConfig: SiteConfig = { ...config, ...payload };
      const saved = await apiRequest<SiteConfig>("/api/pages", {
        method: "PUT",
        body: JSON.stringify(nextConfig),
      });
      setConfig(saved);
      showToast("全局配置已保存");
    } catch {
      showToast("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return (
      <div style={{ textAlign: "center", padding: 48, color: "var(--weathered-taupe)" }}>
        加载中...
      </div>
    );
  }

  return (
    <div>
      <SiteConfigForm config={config} onSave={handleSave} saving={saving} />
      {toast && <div className="toast is-showing">{toast}</div>}
    </div>
  );
}

function SiteConfigForm({
  config,
  onSave,
  saving,
}: {
  config: SiteConfig;
  onSave: (p: Partial<SiteConfig>) => void;
  saving: boolean;
}) {
  const [siteName, setSiteName] = useState(config.siteName);
  const [tagline, setTagline] = useState(config.tagline);
  const [announcement, setAnnouncement] = useState(config.announcement);
  const [contactEmail, setContactEmail] = useState(config.contactEmail);
  const [instagram, setInstagram] = useState(config.instagram);

  useEffect(() => {
    setSiteName(config.siteName);
    setTagline(config.tagline);
    setAnnouncement(config.announcement);
    setContactEmail(config.contactEmail);
    setInstagram(config.instagram);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ siteName, tagline, announcement, contactEmail, instagram });
  };

  const fieldStyle = { display: "grid", gap: 7 };

  return (
    <div className="admin-panel">
      <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(201,191,175,0.58)" }}>
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, color: "var(--charcoal-clay)" }}>
          全局配置
        </h2>
        <p style={{ margin: "6px 0 0", color: "var(--weathered-taupe)", fontSize: 13 }}>
          网站基础信息将显示在首页和页面底部。
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
            <label className="admin-label">网站名称</label>
            <input
              className="admin-input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
          </div>
          <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
            <label className="admin-label">品牌标语</label>
            <input
              className="admin-input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="粘土手作与串珠首饰，给慢下来的日子一点温度。"
            />
          </div>
          <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
            <label className="admin-label">网站公告</label>
            <textarea
              className="admin-textarea"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={3}
              placeholder="春夏小批量手作更新中，每一件都带着自然纹理与手工痕迹。"
            />
          </div>
          <div className="field" style={fieldStyle}>
            <label className="admin-label">联系邮箱</label>
            <input
              className="admin-input"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@lazyjam.studio"
            />
          </div>
          <div className="field" style={fieldStyle}>
            <label className="admin-label">Instagram</label>
            <input
              className="admin-input"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@lazyjam.studio"
            />
          </div>
        </div>
        <div style={{ padding: "0 22px 22px", display: "flex", gap: 10 }}>
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存配置"}
          </button>
        </div>
      </form>
      <style>{`.field { display: grid; gap: 7px; }`}</style>
    </div>
  );
}
