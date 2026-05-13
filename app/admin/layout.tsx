"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin": "页面管理",
    "/admin/products": "商品管理",
    "/admin/sections": "板块管理",
    "/admin/pages": "页面编辑",
    "/admin/orders": "订单管理",
    "/admin/settings": "全局配置"
  };
  return map[pathname] ?? "Dashboard";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("lazyjam_admin_auth");
    const authed = auth === "true";
    setIsAuthed(authed);
    setChecking(false);
    if (!authed) {
      push("/admin/login");
    }
  }, [push]);

  if (checking) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LJ</span>
          <span>LazyJam Admin</span>
        </div>
        <nav className="nav">
          <Link href="/admin" className={`nav-button${pathname === "/admin" ? " is-active" : ""}`}>
            <span className="nav-icon">P</span>页面管理
          </Link>
          <Link href="/admin/sections" className={`nav-button${pathname === "/admin/sections" ? " is-active" : ""}`}>
            <span className="nav-icon">S</span>板块管理
          </Link>
          <Link href="/admin/products" className={`nav-button${pathname === "/admin/products" ? " is-active" : ""}`}>
            <span className="nav-icon">G</span>商品管理
          </Link>
          <Link href="/admin/orders" className={`nav-button${pathname === "/admin/orders" ? " is-active" : ""}`}>
            <span className="nav-icon">O</span>订单管理
          </Link>
          <Link href="/admin/settings" className={`nav-button${pathname === "/admin/settings" ? " is-active" : ""}`}>
            <span className="nav-icon">C</span>全局配置
          </Link>
          <Link href="/admin/payments" className={`nav-button${pathname === "/admin/payments" ? " is-active" : ""}`}>
            <span className="nav-icon">¥</span>支付管理
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-button"
            type="button"
            onClick={() => {
              sessionStorage.removeItem("lazyjam_admin_auth");
              window.location.href = "/admin/login";
            }}
          >
            <span className="nav-icon">↩</span>退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="topbar">
          <div className="topbar-logo">
            <span className="topbar-logo-mark">LJ</span>
            <span className="topbar-logo-name">LazyJam Admin</span>
          </div>
          <h1 className="topbar-title">{getPageTitle(pathname ?? '')}</h1>
          <button
            className="topbar-logout"
            type="button"
            onClick={() => {
              sessionStorage.removeItem("lazyjam_admin_auth");
              window.location.href = "/admin/login";
            }}
          >
            <span aria-hidden>↩</span> 退出登录
          </button>
        </header>
        <main className="content">{children}</main>
      </div>

      <style>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
        }
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 20;
          width: 240px;
          display: flex;
          flex-direction: column;
          background: var(--smoked-umber);
          color: var(--raw-linen);
          box-shadow: 12px 0 28px rgba(46,42,37,0.08);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 78px;
          padding: 0 20px;
          border-bottom: 1px solid rgba(243,239,230,0.14);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }
        .brand-mark {
          width: 34px;
          height: 34px;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          display: grid;
          place-items: center;
        }
        .nav {
          display: grid;
          gap: 6px;
          padding: 18px 12px;
        }
        .nav-button {
          width: 100%;
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: rgba(243,239,230,0.78);
          padding: 0 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .nav-button:hover,
        .nav-button.is-active {
          background: rgba(243,239,230,0.12);
          color: var(--raw-linen);
        }
        .nav-icon {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(243,239,230,0.22);
          border-radius: 50%;
          font-size: 12px;
        }
        .sidebar-footer {
          margin-top: auto;
          padding: 14px 12px 18px;
          border-top: 1px solid rgba(243,239,230,0.14);
        }
        .logout-button {
          width: 100%;
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: rgba(243,239,230,0.78);
          padding: 0 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .logout-button:hover {
          background: rgba(243,239,230,0.12);
          color: var(--raw-linen);
        }
        .admin-main {
          margin-left: 240px;
          flex: 1;
          min-width: 0;
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 15;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 26px;
          border-bottom: 1px solid rgba(201,191,175,0.62);
          background: rgba(243,239,230,0.9);
          backdrop-filter: blur(12px);
        }
        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--charcoal-clay);
          white-space: nowrap;
        }
        .topbar-logo-mark {
          width: 34px;
          height: 34px;
          border: 1px solid var(--charcoal-clay);
          border-radius: 50%;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          display: grid;
          place-items: center;
        }
        .topbar-title {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(20px, 3vw, 32px);
          line-height: 1;
          font-weight: 700;
          color: var(--charcoal-clay);
          text-align: center;
        }
        .topbar-logout {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(61,47,42,0.3);
          border-radius: 6px;
          background: transparent;
          color: var(--charcoal-clay);
          padding: 8px 16px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 180ms ease;
        }
        .topbar-logout:hover {
          background: rgba(61,47,42,0.08);
        }
        .content {
          padding: 24px 26px 36px;
        }
        @media (max-width: 860px) {
          .sidebar {
            position: sticky;
            top: 0;
            width: 100%;
            max-height: none;
          }
          .admin-layout { flex-direction: column; }
          .admin-main { margin-left: 0; }
          .brand { min-height: 62px; }
          .nav {
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            overflow-x: auto;
            padding: 10px 12px;
          }
          .nav-button { white-space: nowrap; }
          .sidebar-footer { display: none; }
        }
      `}</style>
    </div>
  );
}
