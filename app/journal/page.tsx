const posts = [
  {
    title: "柿色试色：从太亮到刚刚好",
    date: "2026.04.28",
    excerpt: "Burnt Persimmon 需要压低明度，才能和 Raw Linen、Charcoal Clay 放在一起时保持安静。"
  },
  {
    title: "藏书票边框如何进入首饰",
    date: "2026.04.22",
    excerpt: "把 Ex Libris 的边框语言拆成线、点和留白，再用细珠做出轻微的秩序感。"
  },
  {
    title: "一次失败的粘土小碟",
    date: "2026.04.18",
    excerpt: "边缘开裂的小碟没有进入商品页，但留下了更好的厚度参考。"
  }
];

export default function JournalPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-persimmon">Journal</p>
      <h1 className="mt-4 font-serif text-5xl font-semibold text-charcoal sm:text-7xl">手作日记</h1>
      <div className="mt-12 divide-y divide-charcoal/14">
        {posts.map((post) => (
          <article key={post.title} className="grid gap-5 py-8 md:grid-cols-[160px_1fr]">
            <time className="text-sm text-charcoal/48">{post.date}</time>
            <div>
              <h2 className="font-serif text-3xl text-charcoal">{post.title}</h2>
              <p className="mt-3 text-base leading-8 text-charcoal/68">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
