'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'lazyjam' && password === 'lazyjam2024') {
      sessionStorage.setItem('lazyjam_admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-4xl text-charcoal">LazyJam</p>
          <p className="mt-1 text-sm text-taupe">Admin CMS</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-xl bg-warm-oat p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-xs text-taupe">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone/40 bg-linen px-3 py-2 text-sm text-charcoal"
              placeholder="lazyjam"
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs text-taupe">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone/40 bg-linen px-3 py-2 text-sm text-charcoal"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-accent py-2 text-sm text-white transition hover:bg-accent/90">
            登录
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-taupe/60">
          LazyJam Admin CMS · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}