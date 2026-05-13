export default function AboutPage() {
  return (
    <section className="soft-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-persimmon">About</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-charcoal sm:text-7xl">Hands, texture, patience.</h1>
        </div>
        <div className="space-y-7 text-base leading-relaxed text-charcoal/72">
          <p>
            LazyJam 从粘土和珠子开始。我们喜欢材料自然留下的痕迹：被手指推开的边缘、烧制后细小的色差、串珠间轻微的节奏变化。
          </p>
          <p>
            品牌视觉受到 Wabi-sabi、亚麻织物和 Ex Libris 藏书票启发。作品不会被修整到完全一致，因为细微的不规则才让物件像是被慢慢保存下来的记忆。
          </p>
          <p>
            每次更新都以小批量进行，先完成试色、佩戴测试和包装纸签，再放入商店。定制需求可以从色系、材质和用途开始讨论。
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Clay", "手捏、压纹、打磨，让粘土保留自然边界。"],
            ["Beads", "玻璃珠、天然石和黄铜扣组成低饱和首饰。"],
            ["Linen", "包装与摄影使用亚麻、旧纸和炭色调。"]
          ].map(([title, text]) => (
            <div key={title} className="border-t border-charcoal/20 py-6">
              <h2 className="font-serif text-3xl text-charcoal">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-charcoal/66">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
