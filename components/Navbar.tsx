import Link from "next/link";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-linen/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-3xl font-semibold tracking-normal text-charcoal">
          LazyJam
        </Link>
        <nav className="flex items-center gap-4 text-sm text-charcoal/75 sm:gap-7">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-persimmon">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
