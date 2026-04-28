import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/pages", label: "页面管理" },
  { href: "/admin/sections", label: "板块管理" },
  { href: "/admin/products", label: "商品管理" },
  { href: "/admin/orders", label: "订单管理" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-linen">
      <div className="mx-auto grid max-w-7xl border-x border-charcoal/10 md:grid-cols-[240px_1fr]">
        <aside className="bg-clay px-5 py-7 text-linen md:min-h-screen">
          <p className="font-serif text-3xl">LazyJam CMS</p>
          <p className="mt-2 text-xs leading-5 text-linen/60">JSON 文件存储后台</p>
          <nav className="mt-8 grid gap-2">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="border border-linen/10 px-3 py-2 text-sm text-linen/78 transition hover:border-linen/35 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 bg-linen px-4 py-7 sm:px-7">{children}</div>
      </div>
    </section>
  );
}
