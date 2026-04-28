"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("请输入管理员密码");
      return;
    }
    // Simple mock auth — any non-empty password works
    sessionStorage.setItem("lazyjam_admin_auth", "true");
    router.push("/admin");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">LJ</span>
          <span>LazyJam Admin</span>
        </div>
        <h1 className="login-title">管理员登录</h1>
        <p className="login-sub">输入管理员密码以访问后台。</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="admin-label">密码</label>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入管理员密码"
              autoFocus
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="admin-btn" type="submit" style={{ width: "100%" }}>
            登录
          </button>
        </form>
        <p className="login-hint">演示模式：任意密码即可登录</p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--raw-linen);
          padding: 20px;
        }
        .login-card {
          width: min(420px, 100%);
          border: 1px solid rgba(201,191,175,0.72);
          border-radius: 12px;
          background: rgba(255,252,245,0.74);
          box-shadow: 0 24px 80px rgba(46,42,37,0.14);
          padding: 36px 32px;
        }
        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--charcoal-clay);
          margin-bottom: 28px;
        }
        .brand-mark {
          width: 34px;
          height: 34px;
          border: 1px solid var(--charcoal-clay);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 12px;
        }
        .login-title {
          margin: 0 0 8px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          color: var(--charcoal-clay);
        }
        .login-sub {
          margin: 0 0 24px;
          color: var(--weathered-taupe);
          font-size: 14px;
        }
        .login-form {
          display: grid;
          gap: 14px;
        }
        .field {
          display: grid;
          gap: 7px;
        }
        .error-msg {
          color: #9f3d35;
          font-size: 13px;
          margin: 0;
        }
        .login-hint {
          margin: 16px 0 0;
          color: var(--weathered-taupe);
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
