import Link from "next/link";
import type { Section } from "@/lib/types";

type HeroProps = {
  section: Section;
};

export default function Hero({ section }: HeroProps) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.88fr_1.12fr] md:py-20 lg:px-8">
      <div className="order-2 md:order-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-persimmon">
          {section.subtitle}
        </p>
        <h1 className="mt-5 font-serif text-6xl font-semibold leading-none text-charcoal sm:text-7xl lg:text-8xl">
          {section.title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-charcoal/72 sm:text-lg">
          {section.description}
        </p>
        <Link
          href={section.href}
          className="mt-8 inline-flex border border-charcoal bg-charcoal px-6 py-3 text-sm font-medium text-linen transition hover:bg-clay"
        >
          {section.ctaLabel}
        </Link>
      </div>
      <div className="order-1 md:order-2">
        <div className="ex-libris-frame bg-parchment p-4 shadow-soft">
          <img src={section.imageUrl} alt={section.title} className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
