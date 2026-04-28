'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('lazyjam_admin_auth');
    if (auth === 'true') {
      setIsAuthed(true);
    }
  }, []);

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen">
        <div className="text-center">
          <p className="font-serif text-4xl text-charcoal">LazyJam Admin</p>
          <a
            href="/admin/login"
            className="mt-6 inline-block bg-accent px-6 py-3 text-sm text-white transition hover:bg-accent/90"
          >
            请先登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-linen">
      <div className="mx-auto grid max-w-7xl border-x border-charcoal/10 md:grid-cols-[240px_1fr]">
        <aside className="bg-clay px-5 py-7 text-linen md:min-h-screen">
          <p className="font-serif text-3xl">LazyJam CMS</p>
          <p className="mt-2 text-xs leading-5 text-linen/60">JSON 文件存储后台</p>
          <nav className="mt-8 grid gap-2">
            <a href="/admin" className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">仪表盘</a>
            <a href="/admin/pages" className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">页面管理</a>
            <a href="/admin/sections" className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">板块管理</a>
            <a href="/admin/products" className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">商品管理</a>
            <a href="/admin/orders" className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">订单管理</a>
            <button
              onClick={() => { sessionStorage.removeItem('lazyjam_admin_auth'); window.location.href = '/admin/login'; }}
              className="mt-4 border border-linen/10 px-3 py-2 text-sm text-linen/60 transition hover:border-linen/35 hover:text-white"
            >
              退出登录
            </button>
          </nav>
        </aside>
        <div className="min-w-0 bg-linen px-4 py-7 sm:px-7">{children}</div>
      </div>
    </section>
  );
}