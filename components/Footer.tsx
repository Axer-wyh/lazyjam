import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-linen">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl">LazyJam</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-linen/72">
            粘土手作、串珠首饰和慢速制作的日常小物。每一件都保留手工痕迹，不追求完全一致。
          </p>
        </div>
        <div className="text-sm leading-7 text-linen/72">
          <p className="font-medium text-linen">Visit</p>
          <Link href="/shop" className="block hover:text-white">
            Shop
          </Link>
          <Link href="/about" className="block hover:text-white">
            About
          </Link>
          <Link href="/journal" className="block hover:text-white">
            Journal
          </Link>
        </div>
        <div className="text-sm leading-7 text-linen/72">
          <p className="font-medium text-linen">Studio</p>
          <p>hello@lazyjam.studio</p>
          <p>@lazyjam.studio</p>
          <p className="mt-4 text-xs">© 2026 LazyJam</p>
        </div>
      </div>
    </footer>
  );
}
