"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";

interface PaymentMethod {
  enabled: boolean;
  qrCode: string;
  accountName: string;
}

interface PaymentConfig {
  wechat: PaymentMethod;
  alipay: PaymentMethod;
  bankCard: {
    enabled: boolean;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const defaultConfig: PaymentConfig = {
  wechat: { enabled: false, qrCode: "", accountName: "" },
  alipay: { enabled: false, qrCode: "", accountName: "" },
  bankCard: { enabled: false, bankName: "", accountNumber: "", accountName: "" },
};

function QrCodeUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512000) {
      alert("图片建议小于 500KB");
    }
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img src={value} alt={label} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(201,191,175,0.4)" }} />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ display: "block", marginTop: 4, background: "none", border: "none", fontSize: 11, color: "var(--persimmon)", cursor: "pointer", textDecoration: "underline" }}
          >
            移除图片
          </button>
        </div>
      )}
      <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer" }}>
        {value ? "更换二维码" : `上传${label}二维码`}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </label>
      <input
        className="admin-input"
        value={value.startsWith("data:") ? "(Base64 图片)" : value}
        onChange={(e) => {
          const v = e.target.value;
          if (v.startsWith("http")) onChange(v);
        }}
        placeholder="或粘贴图片 URL"
        style={{ marginTop: 6, width: "100%" }}
      />
    </div>
  );
}

export default function AdminPaymentsPage() {
  const [config, setConfig] = useState<PaymentConfig>(defaultConfig);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<PaymentConfig>("/api/payments").then((data) => {
      if (data && (data.wechat || data.alipay || data.bankCard)) {
        setConfig(data);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest("/api/payments", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      showToast("支付配置已保存");
    } catch {
      showToast("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const updateWechat = (patch: Partial<PaymentMethod>) =>
    setConfig((c) => ({ ...c, wechat: { ...c.wechat, ...patch } }));
  const updateAlipay = (patch: Partial<PaymentMethod>) =>
    setConfig((c) => ({ ...c, alipay: { ...c.alipay, ...patch } }));
  const updateBankCard = (patch: Partial<PaymentConfig["bankCard"]>) =>
    setConfig((c) => ({ ...c, bankCard: { ...c.bankCard, ...patch } }));

  const fieldStyle = { display: "grid", gap: 6 };

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28, fontWeight: 700, color: "var(--charcoal-clay)" }}>支付管理</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--weathered-taupe)" }}>配置前台可用的支付方式及收款信息</p>
        </div>
        <button className="admin-btn" type="button" onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存配置"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        {/* WeChat Pay */}
        <div className="admin-panel" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>💚</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--charcoal-clay)" }}>微信支付</h3>
                <p style={{ margin: 3, fontSize: 12, color: "var(--weathered-taupe)" }}>启用后用户可选择微信支付</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={config.wechat.enabled}
                onChange={(e) => updateWechat({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {config.wechat.enabled && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
                <label className="admin-label">收款二维码</label>
                <QrCodeUploader label="微信" value={config.wechat.qrCode} onChange={(v) => updateWechat({ qrCode: v })} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
                <label className="admin-label">收款人昵称/备注</label>
                <input
                  className="admin-input"
                  value={config.wechat.accountName}
                  onChange={(e) => updateWechat({ accountName: e.target.value })}
                  placeholder="出现在付款说明中"
                />
              </div>
            </div>
          )}
        </div>

        {/* Alipay */}
        <div className="admin-panel" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>💙</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--charcoal-clay)" }}>支付宝</h3>
                <p style={{ margin: 3, fontSize: 12, color: "var(--weathered-taupe)" }}>启用后用户可选择支付宝付款</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={config.alipay.enabled}
                onChange={(e) => updateAlipay({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {config.alipay.enabled && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
                <label className="admin-label">收款二维码</label>
                <QrCodeUploader label="支付宝" value={config.alipay.qrCode} onChange={(v) => updateAlipay({ qrCode: v })} />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
                <label className="admin-label">收款人昵称/备注</label>
                <input
                  className="admin-input"
                  value={config.alipay.accountName}
                  onChange={(e) => updateAlipay({ accountName: e.target.value })}
                  placeholder="出现在付款说明中"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bank Card */}
        <div className="admin-panel" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>💳</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--charcoal-clay)" }}>银行卡转账</h3>
                <p style={{ margin: 3, fontSize: 12, color: "var(--weathered-taupe)" }}>启用后用户可看到银行账户信息自行转账</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={config.bankCard.enabled}
                onChange={(e) => updateBankCard({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {config.bankCard.enabled && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ ...fieldStyle }}>
                <label className="admin-label">开户行</label>
                <input className="admin-input" value={config.bankCard.bankName} onChange={(e) => updateBankCard({ bankName: e.target.value })} placeholder="例：中国工商银行" />
              </div>
              <div className="field" style={{ ...fieldStyle }}>
                <label className="admin-label">户名</label>
                <input className="admin-input" value={config.bankCard.accountName} onChange={(e) => updateBankCard({ accountName: e.target.value })} placeholder="持卡人姓名" />
              </div>
              <div className="field" style={{ gridColumn: "1/-1", ...fieldStyle }}>
                <label className="admin-label">卡号</label>
                <input className="admin-input" value={config.bankCard.accountNumber} onChange={(e) => updateBankCard({ accountNumber: e.target.value })} placeholder="银行账号" />
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast is-showing">{toast}</div>}

      <style>{`
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          cursor: pointer;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: rgba(201,191,175,0.5);
          transition: background 220ms ease;
        }
        .toggle-slider::before {
          content: "";
          position: absolute;
          left: 3px;
          top: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 220ms ease;
        }
        .toggle-switch input:checked + .toggle-slider {
          background: var(--charcoal-clay);
        }
        .toggle-switch input:checked + .toggle-slider::before {
          transform: translateX(20px);
        }
        .field { display: grid; gap: 7px; }
      `}</style>
    </div>
  );
}