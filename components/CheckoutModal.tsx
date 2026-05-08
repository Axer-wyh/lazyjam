"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { PaymentConfig } from "@/app/api/payments/route";
import type { CartItem } from "@/lib/cart";

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "shipping" | "payment" | "confirm";

export default function CheckoutModal({ isOpen, cart, total, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("shipping");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    apiRequest<PaymentConfig>("/api/payments").then(setPaymentConfig);
  }, [isOpen]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !phone.trim() || !shipping.trim()) {
      setError("请填写完整的收货信息");
      return;
    }
    setError("");
    setStep("payment");
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      // Create order with status=paid (simulating payment success)
      await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customer,
          email: "",
          shipping: `${customer} ${phone} ${shipping}`,
          payment: selectedPayment,
          productId: cart[0]?.id ?? "",
          productName: cart.map((i) => i.name).join(", "),
          quantity: cart.reduce((s, i) => s + i.quantity, 0),
          total,
          status: "paid",
          note: "",
        }),
      });
      setStep("confirm");
      onSuccess();
    } catch {
      setError("订单创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--parchment)",
        borderRadius: 12,
        width: "min(540px, 100%)",
        maxHeight: "92vh",
        overflowY: "auto",
        boxShadow: "0 24px 64px rgba(46,42,37,0.22)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(201,191,175,0.5)",
          position: "sticky", top: 0, background: "var(--parchment)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🧵</span>
            <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 700, color: "var(--charcoal-clay)" }}>
              {step === "shipping" ? "填写收货信息" : step === "payment" ? "选择支付方式" : "订单确认"}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "var(--charcoal-clay)", lineHeight: 1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 24px" }}>
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {(["shipping", "payment", "confirm"] as Step[]).map((s, i) => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step === s ? "var(--persimmon)" : stepOrder(s) < stepOrder(step) ? "var(--warm-oat)" : "rgba(201,191,175,0.35)" }} />
            ))}
          </div>

          {/* Step: Shipping */}
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit}>
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal-clay)" }}>收货人姓名</label>
                  <input className="checkout-input" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="请输入收货人姓名" required />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal-clay)" }}>手机号</label>
                  <input className="checkout-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" required />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal-clay)" }}>收货地址</label>
                  <textarea className="checkout-input" value={shipping} onChange={(e) => setShipping(e.target.value)} placeholder="请输入详细收货地址" rows={3} required />
                </div>
              </div>
              {error && <p style={{ color: "var(--persimmon)", fontSize: 13, marginTop: 8 }}>{error}</p>}
              <button type="submit" className="checkout-submit-btn" style={{ marginTop: 20 }}>
                下一步：选择支付方式
              </button>
            </form>
          )}

          {/* Step: Payment */}
          {step === "payment" && paymentConfig && (
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--weathered-taupe)" }}>
                收货信息：{customer} · {phone} · {shipping}
              </p>

              {/* Payment methods */}
              <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                {paymentConfig.wechat.enabled && (
                  <PaymentOption
                    id="wechat"
                    label="微信支付"
                    icon="💚"
                    selected={selectedPayment === "wechat"}
                    onSelect={setSelectedPayment}
                  />
                )}
                {paymentConfig.alipay.enabled && (
                  <PaymentOption
                    id="alipay"
                    label="支付宝"
                    icon="💙"
                    selected={selectedPayment === "alipay"}
                    onSelect={setSelectedPayment}
                  />
                )}
                {paymentConfig.bankCard.enabled && (
                  <PaymentOption
                    id="bankCard"
                    label={`银行卡（${paymentConfig.bankCard.bankName ?? "银行转账"}）`}
                    icon="💳"
                    selected={selectedPayment === "bankCard"}
                    onSelect={setSelectedPayment}
                  />
                )}
              </div>

              {/* Payment info display */}
              {selectedPayment && paymentConfig && (
                <div style={{ padding: "14px 16px", borderRadius: 8, background: "rgba(243,239,230,0.6)", border: "1px solid rgba(201,191,175,0.4)", marginBottom: 16 }}>
                  {selectedPayment === "wechat" && paymentConfig.wechat.qrCode && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--charcoal-clay)" }}>请使用微信扫描下方二维码付款</p>
                      <img src={paymentConfig.wechat.qrCode} alt="微信支付码" style={{ width: 180, height: 180, objectFit: "contain", borderRadius: 8 }} />
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--weathered-taupe)" }}>备注：{paymentConfig.wechat.accountName}</p>
                    </div>
                  )}
                  {selectedPayment === "alipay" && paymentConfig.alipay.qrCode && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--charcoal-clay)" }}>请使用支付宝扫描下方二维码付款</p>
                      <img src={paymentConfig.alipay.qrCode} alt="支付宝付款码" style={{ width: 180, height: 180, objectFit: "contain", borderRadius: 8 }} />
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--weathered-taupe)" }}>备注：{paymentConfig.alipay.accountName}</p>
                    </div>
                  )}
                  {selectedPayment === "bankCard" && paymentConfig.bankCard.enabled && (
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--charcoal-clay)", fontWeight: 600 }}>银行转账信息</p>
                      <div style={{ fontSize: 13, color: "var(--charcoal-clay)", display: "grid", gap: 4 }}>
                        <p style={{ margin: 0 }}>开户行：{paymentConfig.bankCard.bankName || "—"}</p>
                        <p style={{ margin: 0 }}>卡号：{paymentConfig.bankCard.accountNumber || "—"}</p>
                        <p style={{ margin: 0 }}>户名：{paymentConfig.bankCard.accountName || "—"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "var(--charcoal-clay)", color: "var(--raw-linen)" }}>
                <span style={{ fontSize: 14 }}>合计支付</span>
                <span style={{ fontSize: 22, fontWeight: 700 }}>¥{total}</span>
              </div>

              {error && <p style={{ color: "var(--persimmon)", fontSize: 13, marginBottom: 8 }}>{error}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("shipping")} className="checkout-back-btn">
                  返回
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedPayment || loading}
                  className="checkout-submit-btn"
                  style={{ flex: 1, opacity: (!selectedPayment || loading) ? 0.55 : 1 }}
                >
                  {loading ? "处理中..." : "确认付款"}
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "var(--charcoal-clay)", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                订单已确认！
              </h3>
              <p style={{ margin: "0 0 6px", fontSize: 14, color: "var(--weathered-taupe)" }}>
                感谢您的购买，{customer}！
              </p>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--weathered-taupe)" }}>
                我们会尽快为您制作并发货。收货地址：{shipping}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--charcoal-clay)", background: "rgba(243,239,230,0.5)", padding: "14px 16px", borderRadius: 8, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--weathered-taupe)" }}>支付方式</span>
                  <span style={{ fontWeight: 600 }}>
                    {selectedPayment === "wechat" ? "微信支付" : selectedPayment === "alipay" ? "支付宝" : "银行卡"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--weathered-taupe)" }}>订单金额</span>
                  <span style={{ fontWeight: 700, color: "var(--persimmon)" }}>¥{total}</span>
                </div>
              </div>
              <button onClick={onClose} className="checkout-submit-btn" style={{ marginTop: 20 }}>
                完成
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .checkout-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(201,191,175,0.6);
          border-radius: 6px;
          background: rgba(255,252,245,0.8);
          font-size: 14px;
          color: var(--charcoal-clay);
          outline: none;
          transition: border-color 200ms ease;
          box-sizing: border-box;
          font-family: inherit;
        }
        .checkout-input:focus {
          border-color: var(--charcoal-clay);
        }
        .checkout-submit-btn {
          width: 100%;
          min-height: 48px;
          border: none;
          border-radius: 8px;
          background: var(--charcoal-clay);
          color: var(--raw-linen);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 200ms ease;
        }
        .checkout-submit-btn:hover { opacity: 0.88; }
        .checkout-back-btn {
          min-height: 48px;
          padding: 0 20px;
          border: 1px solid rgba(201,191,175,0.6);
          border-radius: 8px;
          background: transparent;
          color: var(--charcoal-clay);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function stepOrder(s: Step): number {
  return { shipping: 0, payment: 1, confirm: 2 }[s];
}

function PaymentOption({
  id, label, icon, selected, onSelect,
}: {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px",
        borderRadius: 8,
        border: `2px solid ${selected ? "var(--charcoal-clay)" : "rgba(201,191,175,0.45)"}`,
        background: selected ? "rgba(243,239,230,0.7)" : "transparent",
        cursor: "pointer",
        fontSize: 14, fontWeight: 600, color: "var(--charcoal-clay)",
        textAlign: "left",
        transition: "border-color 200ms ease, background 200ms ease",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "var(--charcoal-clay)" : "rgba(201,191,175,0.5)"}`, display: "grid", placeItems: "center" }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--charcoal-clay)", display: "block" }} />}
      </span>
    </button>
  );
}