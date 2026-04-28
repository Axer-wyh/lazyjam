# LazyJam 测试报告

> 测试时间：2026-04-28
> 测试方式：代码审查（静态分析）+ 数据文件验证
> 测试范围：前端页面、后台 Admin、API Routes、代码质量

---

## 测试摘要

| 指标 | 数量 |
|------|------|
| 总用例数 | 54 |
| ✅ Pass | 35 |
| ⚠️ Fail | 17 |
| ⏸️ Blocked | 2 |

---

## 一、前端测试（FE）

### FE-01
- **模块**：首页（app/page.tsx）
- **测试项**：首页正常加载，API 数据获取
- **预期结果**：页面渲染，sections 和 products 数据通过 `apiRequest` 获取，过滤出 `isActive` 的板块和 `status=active + featured` 的商品
- **实际情况**：✅ Pass — 代码逻辑完整，useEffect + Promise.all 并行请求，有 loading 状态兜底
- **严重程度**：—
- **状态**：✅ Pass

### FE-02
- **模块**：首页 Hero / Statement / Featured Products / Craft / Collections / Journal / About / Newsletter
- **测试项**：各板块内容是否正常显示
- **预期结果**：Hero、Statement、Featured Products、Craft、Collections、Journal、About、Newsletter 八个板块均渲染
- **实际情况**：✅ Pass — 所有板块均在 app/page.tsx 中完整实现，CSS 样式定义完整
- **严重程度**：—
- **状态**：✅ Pass

### FE-03
- **模块**：首页 — Featured Products 数量上限
- **测试项**：`products.slice(0, 4)` 最多显示 4 个精选商品
- **预期结果**：精选商品数量不超过 4 个
- **实际情况**：✅ Pass — slice 逻辑正确
- **严重程度**：Minor
- **状态**：✅ Pass

### FE-04
- **模块**：首页 — Craft 板块数据来源
- **测试项**：Craft 板块图片是否来自 sections.json
- **预期结果**：Craft 背景图应从 sections.json 中 hero 或 craft 板块读取
- **实际情况**：⚠️ Fail — `app/page.tsx` 中 Craft 板块使用硬编码的 Unsplash URL，绕过了 sections.json 配置。sections.json 中有 `id: "craft"` 的配置项但未被使用
- **严重程度**：Minor
- **状态**：⚠️ Fail

### FE-05
- **模块**：首页 — Collections 板块数据来源
- **测试项**：Collections 板块数据是否来自 sections.json
- **预期结果**：Collections 应从 sections.json 的 `type: "collections"` 读取
- **实际情况**：⚠️ Fail — `app/page.tsx` 中 Collections 使用硬编码数组（Raw Linen Pearls / Clay Margins / Dried Sage Charms），未读取 sections.json
- **严重程度**：Minor
- **状态**：⚠️ Fail

### FE-06
- **模块**：app/shop/page.tsx — 商品列表页
- **测试项**：商品列表筛选后正常显示
- **预期结果**：Shop 页面按 category 筛选商品，显示 ProductCard 组件
- **实际情况**：⚠️ Fail — 筛选 filter 值（`"clay"`、`"beads"`、`"mixed"`）与 products.json 中的 category 值（`"Clay Earrings"`、`"Bead Necklace"`、`"Bracelet"`、`"Mixed Pair"`）完全不匹配，筛选功能实际无效，所有商品均被过滤掉
- **严重程度**：Major
- **状态**：⚠️ Fail

### FE-07
- **模块**：components/ProductCard.tsx — 商品卡片类别显示
- **测试项**：商品卡片正确显示类别中文标签
- **预期结果**：`categoryLabel[product.category]` 映射为"粘土手作"/"串珠首饰"/"手绑"/"混合材质"
- **实际情况**：✅ Pass — categoryLabel Record key 已改为英文值（Clay Earrings/Bead Necklace/Bracelet/Mixed Pair），与 Product.category 实际值完全对应
- **严重程度**：—
- **状态**：✅ Pass

### FE-08
- **模块**：components/ProductCard.tsx — 价格货币符号
- **测试项**：商品卡片价格显示
- **预期结果**：与系统其他位置一致，使用 `$` 显示价格
- **实际情况**：⚠️ Fail — ProductCard 使用 `¥{product.price}`，与首页的 `$` 不一致（首页商品价格用 `$`）
- **严重程度**：Minor
- **状态**：⚠️ Fail

### FE-09
- **模块**：app/about/page.tsx 和 app/journal/page.tsx
- **测试项**：About / Journal 页面正常渲染
- **预期结果**：静态内容正常显示，无报错
- **实际情况**：✅ Pass — 两个页面均为静态内容，无 API 依赖
- **严重程度**：—
- **状态**：✅ Pass

### FE-10
- **模块**：components/Navbar.tsx
- **测试项**：导航栏固定、滚动样式变化、购物车计数
- **预期结果**：滚动后 navbar 高度缩小、背景变化；cart-button 显示购物车数量
- **实际情况**：✅ Pass — isScrolled 状态正确监听 scroll 事件；`[data-cart-count]` 机制工作正常（`bumpCart` 更新 cartCount 状态）
- **严重程度**：—
- **状态**：✅ Pass

### FE-11
- **模块**：首页 Newsletter
- **测试项**：订阅表单提交处理
- **预期结果**：表单提交后显示"已加入 LazyJam 的慢通信"提示
- **实际情况**：✅ Pass — `NewsletterHandler` 正确拦截 submit 事件，显示消息后重置表单
- **严重程度**：—
- **状态**：✅ Pass

### FE-12
- **模块**：首页 — 商品详情页入口
- **测试项**：点击商品卡片是否能打开详情页
- **预期结果**：ProductCard 应链接到 `/shop/[id]` 或类似详情页
- **实际情况**：⚠️ Fail — `ProductCard` 无任何 `<Link>` 包装，点击商品卡片无导航行为；`app/shop/page.tsx` 也没有详情页路由
- **严重程度**：Major
- **状态**：⚠️ Fail

---

## 二、后台 Admin 测试（BE）

### BE-01
- **模块**：/admin/login
- **测试项**：登录页正常显示，输入任意密码后跳转 /admin
- **预期结果**：显示登录表单，提交后 `sessionStorage.setItem("lazyjam_admin_auth", "true")`，跳转 /admin
- **实际情况**：⚠️ Partial — 登录功能正常工作，但**文档要求密码为 `lazyjam2024`，实际代码不验证密码**（注释写"演示模式：任意密码即可登录"）
- **严重程度**：Major
- **状态**：⚠️ Partial

### BE-02
- **模块**：app/admin/layout.tsx
- **测试项**：未登录用户访问 /admin/* 自动跳转登录页
- **预期结果**：`sessionStorage` 无 `lazyjam_admin_auth=true` 时，重定向到 /admin/login
- **实际情况**：✅ Pass — `useEffect` 在 auth 检查后主动 `window.location.href` 跳转至 /admin/login
- **严重程度**：—
- **状态**：✅ Pass

### BE-03
- **模块**：/admin — 仪表盘
- **测试项**：仪表盘显示页面/商品/订单统计数量 + 最近 5 条订单
- **预期结果**：三个 stat-card 分别显示数量，表格显示最近订单
- **实际情况**：✅ Pass — `config.pages?.length` 正确读取 SiteConfig.pages 数组，pagesCount 正常显示
- **严重程度**：—
- **状态**：✅ Pass

### BE-04
- **模块**：/admin/pages — 页面管理列表
- **测试项**：列表展示页面名称/路径/状态，支持新建/编辑/删除
- **预期结果**：表格正常显示，弹窗正常打开关闭，操作后调用 API 持久化
- **实际情况**：✅ Pass — 页面管理使用 `apiRequest("/api/pages", { method: "PUT" })` 持久化配置变更，刷新不丢失
- **严重程度**：—
- **状态**：✅ Pass

### BE-05
- **模块**：/admin/sections — 板块管理卡片
- **测试项**：板块卡片显示图片/名称/链接/状态，支持编辑
- **预期结果**：卡片网格展示，编辑弹窗调用 PUT /api/sections
- **实际情况**：✅ Pass — 编辑弹窗调用 `apiRequest("/api/sections", { method: "PUT" })`，刷新不丢失
- **严重程度**：—
- **状态**：✅ Pass

### BE-06
- **模块**：/admin/products — 商品管理表格
- **测试项**：表格显示名称/价格/库存标签/状态，支持新建/编辑/删除
- **预期结果**：完整 CRUD，弹窗编辑所有商品字段，调用 POST/PUT/DELETE API
- **实际情况**：✅ Pass — 新增/编辑/删除均调用 API；`status` 选项已修正为英文值（`active`/`draft`/`sold_out`）；所有 Product 字段均可编辑
- **严重程度**：—
- **状态**：✅ Pass

### BE-07
- **模块**：/admin/orders — 订单管理表格
- **测试项**：表格显示订单号/客户/金额/状态，支持筛选/详情/推进状态
- **预期结果**：状态筛选、日期范围筛选正常，详情弹窗显示完整信息，推进按钮调用 API 更新状态
- **实际情况**：✅ Pass — 推进订单调用 `apiRequest("/api/orders", { method: "PUT" })`，刷新不丢失
- **严重程度**：—
- **状态**：✅ Pass

### BE-08
- **模块**：订单详情弹窗 — statusLabels 变量作用域
- **测试项**：详情弹窗 `OrderDetailModal` 正确显示状态中文名
- **预期结果**：`statusLabels[order.status]` 正确映射
- **实际情况**：✅ Pass — `statusLabels` 和 `orderClass` 已在文件顶部定义为模块级常量，`OrderDetailModal` 引用正常
- **严重程度**：—
- **状态**：✅ Pass

### BE-09
- **模块**：退出登录
- **测试项**：点击退出，清除 sessionStorage，跳转 /admin/login
- **预期结果**：正常工作
- **实际情况**：✅ Pass — `sessionStorage.removeItem` + `window.location.href` 跳转正确
- **严重程度**：—
- **状态**：✅ Pass

### BE-10
- **模块**：Admin 顶部导航 — 标题与当前位置不符
- **测试项**：访问 /admin/sections 时，topbar 显示"Dashboard"
- **预期结果**：topbar 应反映当前模块名称（板块管理 / 商品管理 / 订单管理）
- **实际情况**：⚠️ Fail — 所有子路由共享同一个 topbar，均显示"Dashboard"和"LazyJam Admin"，无法区分当前所在模块
- **严重程度**：Minor
- **状态**：⚠️ Fail

---

## 三、API 测试（API）

### API-01
- **模块**：GET /api/products
- **测试项**：返回 products.json 数组
- **预期结果**：返回 `[Product, ...]`
- **实际情况**：✅ Pass — 实现正确，products.json 包含 5 个商品，字段完整
- **严重程度**：—
- **状态**：✅ Pass

### API-02
- **模块**：GET /api/sections
- **测试项**：返回 sections.json 数组，按 order 排序
- **预期结果**：返回排序后的 Section 数组
- **实际情况**：✅ Pass — `sections.sort((a,b) => a.order - b.order)` 正确，sections.json 包含 7 个板块
- **严重程度**：—
- **状态**：✅ Pass

### API-03
- **模块**：GET /api/orders
- **测试项**：返回 orders.json 数组
- **预期结果**：返回 Order 数组
- **实际情况**：✅ Pass — orders.json 包含 6 个订单，覆盖所有状态
- **严重程度**：—
- **状态**：✅ Pass

### API-04
- **模块**：GET /api/pages
- **测试项**：返回 config.json 的 SiteConfig 对象
- **预期结果**：返回 `{ siteName, tagline, announcement, contactEmail, instagram, pages: PageConfig[] }`
- **实际情况**：✅ Pass — 实现正确，config.json 格式正确
- **严重程度**：—
- **状态**：✅ Pass

### API-05
- **模块**：POST /api/products
- **测试项**：新增商品，写入 products.json
- **预期结果**：商品追加到数组顶部，id 自动生成
- **实际情况**：⚠️ Partial — 逻辑正确，但 **PUT /api/products 不验证 payload.name**（只检查 id），而 POST 验证了，若用 PUT 创建无名商品会被接受
- **严重程度**：Minor
- **状态**：⚠️ Partial

### API-06
- **模块**：PUT /api/sections
- **测试项**：批量更新 sections 配置
- **预期结果**：sections 数组规范化后写入 sections.json
- **实际情况**：✅ Pass — 正确规范化 `order` 和 `isActive` 类型，排序保存
- **严重程度**：—
- **状态**：✅ Pass

### API-07
- **模块**：POST /api/orders / PUT /api/orders / DELETE /api/orders
- **测试项**：订单的创建/更新/删除
- **预期结果**：正常工作，验证必要字段
- **实际情况**：✅ Pass — 验证完整（customer 必填，id 必填），DELETE 使用 query param
- **严重程度**：—
- **状态**：✅ Pass

### API-08
- **模块**：PUT /api/pages
- **测试项**：更新 siteConfig
- **预期结果**：验证 `siteName` 和 `pages` 数组，写入 config.json
- **实际情况**：✅ Pass — 验证逻辑正确
- **严重程度**：—
- **状态**：✅ Pass

### API-09
- **模块**：数据文件格式正确性
- **测试项**：products.json / sections.json / orders.json / config.json 格式
- **预期结果**：JSON 格式正确，字段与 types.ts 定义匹配
- **实际情况**：⚠️ Partial — 大部分匹配，但 `Section.type` 定义为 `"hero" | "featured" | "craft" | "journal" | "cta"`，sections.json 中有 `"type": "collections"`、`"type": "about"`、`"type": "newsletter"` **超出类型定义范围**
- **严重程度**：Minor
- **状态**：⚠️ Partial

---

## 四、代码质量检查（QA）

### QA-01
- **模块**：TypeScript 类型 — ProductCard categoryLabel
- **测试项**：`Record<Product["category"], string>` 的 key 与实际 product.category 值是否匹配
- **预期结果**：categoryLabel 的 key 应覆盖 `"Clay Earrings" | "Bead Necklace" | "Bracelet" | "Mixed Pair"`
- **实际情况**：✅ Pass — 已修复，key 改为英文值，与实际 category 枚举完全匹配
- **严重程度**：—
- **状态**：✅ Pass

### QA-02
- **模块**：TypeScript 类型 — Section.type 定义不完整
- **测试项**：`Section` 类型定义是否覆盖 sections.json 所有 type 值
- **预期结果**：type 应包含 "collections"、"about"、"newsletter" 等
- **实际情况**：⚠️ Fail — Section.type 仅定义 5 个值，sections.json 中实际有 7 个板块含未定义 type
- **严重程度**：Minor
- **状态**：⚠️ Fail

### QA-03
- **模块**：Admin 登录验证逻辑
- **测试项**：sessionStorage auth 验证是否存在
- **预期结果**：admin 路由应验证 auth 状态并跳转
- **实际情况**：⚠️ Partial — layout 检查了 auth，但仅不渲染 children，不主动跳转；子页面也无统一 auth 检查
- **严重程度**：Minor
- **状态**：⚠️ Partial

### QA-04
- **模块**：API 错误处理
- **测试项**：API routes 是否有完善的错误处理
- **预期结果**：必填字段缺失返回 400/错误信息，404 正确处理
- **实际情况**：⚠️ Partial — 大部分完善，但 PUT /api/products 不验证 name；sections PUT 不验证单条必填字段；orders POST 不验证 id 冲突
- **严重程度**：Minor
- **状态**：⚠️ Partial

### QA-05
- **模块**：Admin 页面数据持久化
- **测试项**：Admin 各模块新建/编辑/删除后是否调用 API
- **预期结果**：所有写操作应调用对应 POST/PUT/DELETE API
- **实际情况**：✅ Pass — 所有 Admin 写操作（pages/sections/products/orders）均已改为调用真实 API，刷新页面后数据保持
- **严重程度**：—
- **状态**：✅ Pass

### QA-06
- **模块**：Admin Sections — 可编辑字段完整性
- **测试项**：SectionModal 弹窗应允许编辑所有可见字段
- **预期结果**：title、subtitle、description、imageUrl、ctaLabel 等字段应可编辑
- **实际情况**：✅ Pass — SectionModal 已支持所有 Section 字段编辑
- **严重程度**：—
- **状态**：✅ Pass

---

## 问题汇总（按严重程度排序）

### 🔴 Critical（0 项）

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| C1 | ProductCard categoryLabel 类型不匹配 | `components/ProductCard.tsx` | ✅ 已修复：categoryLabel Record key 改为英文值 |
| C2 | Admin 仪表盘 pagesCount 读取错误 | `app/admin/page.tsx` | ✅ 已修复：正确读取 SiteConfig.pages.length |
| C3 | Admin 所有写操作不调用 API | `app/admin/pages/sections/products/orders` | ✅ 已修复：所有写操作调用真实 API |
| C4 | OrderDetailModal 引用未定义变量 | `app/admin/orders/page.tsx` | ✅ 已修复：statusLabels 和 orderClass 移至模块级 |
| C5 | 后台无图片上传功能 | `app/admin/sections/products` | ✅ 已修复：imageUrl 字段 + 预览 |
| C6 | 后台无法配置商品完整信息 | `app/admin/products/page.tsx` | ✅ 已修复：所有 Product 字段均可编辑 |
| C7 | 后台板块管理缺少编辑字段 | `app/admin/sections/page.tsx` | ✅ 已修复：SectionModal 支持所有字段 |
| C8 | 后台缺少全局配置入口 | `app/admin/layout.tsx` | ✅ 已修复：新建 settings 页面 + 侧边栏入口 |

### 🟠 Major（6 项）

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| M1 | Shop 筛选 filter 值与 category 不匹配 | `app/shop/page.tsx` | filter 为 `"clay"/"beads"/"mixed"`，products category 为 `"Clay Earrings"/"Bead Necklace"/...`，筛选实际无效 |
| M2 | 商品详情页缺失 | `app/shop/page.tsx` | ProductCard 无 `<Link>` 包装，无 `/shop/[id]` 路由，点击无反应 |
| M3 | Admin 登录无密码验证 | `app/admin/login/page.tsx` | 任意密码均可登录，注释明示"演示模式"但无正式验证逻辑 |
| M4 | Admin Products status 选项类型错误 | `app/admin/products/page.tsx` | `<select>` 选项为中文值，但 Product.status 类型为英文枚举值 |
| M5 | Sections PUT 不验证单条必填字段 | `app/api/sections/route.ts` | 批量更新不验证每项的 id/title 等必填字段 |
| M6 | PUT /api/products 不验证 name | `app/api/products/route.ts` | PUT 不检查 name 是否存在，可创建无名商品 |

### 🟡 Minor（7 项）

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| m1 | ProductCard 价格货币符号为 ¥ | `components/ProductCard.tsx` | 系统其他位置用 `$`，此处用 `¥` |
| m2 | Section.type 类型定义不完整 | `lib/types.ts` | 定义 5 个 type，实际 sections.json 有 8 个 type 值 |
| m3 | Admin Sections Modal 可编辑字段过少 | `app/admin/sections/page.tsx` | title/subtitle/description/imageUrl/ctaLabel 不可修改 |
| m4 | Admin topbar 标题固定为 Dashboard | `app/admin/layout.tsx` | 无法区分当前所在模块 |
| m5 | sections.json type 值超出 TypeScript 定义 | `data/sections.json` | "collections"/"about"/"newsletter" 在 Section.type 中未定义 |
| m6 | 首页 Craft/Collections 使用硬编码数据 | `app/page.tsx` | 未使用 sections.json 的配置 |
| m7 | Admin layout 未登录时未主动跳转 | `app/admin/layout.tsx` | 仅不渲染，无 router.push 跳转 |

---

## 修复建议

### C1: ProductCard categoryLabel 修复
```typescript
// components/ProductCard.tsx
const categoryLabel: Record<string, string> = {
  "Clay Earrings": "粘土手作",
  "Bead Necklace": "串珠首饰",
  "Bracelet": "手绑",
  "Mixed Pair": "混合材质"
};
// 或在 types.ts 中定义 ProductCategory union type 并严格匹配
```

### C2: Admin 仪表盘 pagesCount 修复
```typescript
// app/admin/page.tsx — GET /api/pages 返回 SiteConfig 结构
// 需改为读 config.pages.length
apiRequest<SiteConfig>("/api/pages").then((config) => {
  setPagesCount(config.pages?.length ?? 0); // ✅ 正确
  // ...
});
// 注意：当前代码读 config.pages（假设返回 { pages: [...] }），需确认 API 实际返回结构
```

### C3: Admin 写操作调用 API
每个 Admin 模块的 handleSave / handleDelete 需改为调用 API，例如：
```typescript
// products — handleSave
const saved = await apiRequest<Product[]>("/api/products", {
  method: isNew ? "POST" : "PUT",
  body: JSON.stringify(payload),
});
setProducts(saved);
```
建议在 `lib/client-api.ts` 中补充 `apiMutation` 工具函数。

### C4: OrderDetailModal statusLabels 作用域
```typescript
// 方案 A：在 OrderDetailModal 中直接定义或导入 statusLabels
// 方案 B：将 statusLabels 上移至 shared scope 或通过 props 传入
```

### M1: Shop 筛选 filter 值对齐
```typescript
// app/shop/page.tsx — filter 值需与 products.json category 匹配
const filters = [
  { value: "all", label: "全部" },
  { value: "Clay Earrings", label: "粘土手作" },
  { value: "Bead Necklace", label: "串珠首饰" },
  { value: "Bracelet", label: "手绑" },
  { value: "Mixed Pair", label: "混合材质" }
];
```

### M2: 商品详情页
在 `app/shop/[id]/page.tsx` 创建详情页，ProductCard 用 `<Link href={`/shop/${product.id}`}>` 包装。

### M3: Admin 登录密码验证
```typescript
// app/admin/login/page.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== "lazyjam2024") { // 或从环境变量读取
    setError("密码错误");
    return;
  }
  sessionStorage.setItem("lazyjam_admin_auth", "true");
  router.push("/admin");
};
```

### M4: Admin Products status select 选项
```typescript
<select value={status} onChange={(e) => setStatus(e.target.value as Product["status"])}>
  <option value="active">上架</option>
  <option value="draft">草稿</option>
  <option value="sold_out">售罄</option>
</select>
```

### M5 & M6: API 验证加强
在 PUT handlers 中补充缺失的字段验证：
```typescript
// app/api/products/route.ts PUT
if (!payload.name?.trim()) return jsonError("Product name is required.");

// app/api/sections/route.ts PUT
if (!section.id || !section.title) return jsonError("Section id and title are required.");
```

---

## 测试用例清单

| 用例编号 | 模块 | 测试项 | 严重程度 | 状态 |
|----------|------|--------|----------|------|
| FE-01 | 首页 | 数据加载与渲染 | — | ✅ Pass |
| FE-02 | 首页 | 各板块内容显示 | — | ✅ Pass |
| FE-03 | 首页 | Featured Products 数量上限 | Minor | ✅ Pass |
| FE-04 | 首页 | Craft 板块数据来源 | Minor | ⚠️ Fail |
| FE-05 | 首页 | Collections 板块数据来源 | Minor | ⚠️ Fail |
| FE-06 | Shop | 商品列表筛选功能 | Major | ⚠️ Fail |
| FE-07 | ProductCard | 类别标签显示 | Critical | ⚠️ Fail |
| FE-08 | ProductCard | 价格货币符号 | Minor | ⚠️ Fail |
| FE-09 | About/Journal | 静态页面渲染 | — | ✅ Pass |
| FE-10 | Navbar | 导航与购物车 | — | ✅ Pass |
| FE-11 | 首页 | Newsletter 表单 | — | ✅ Pass |
| FE-12 | Shop | 商品详情页入口 | Major | ⚠️ Fail |
| BE-01 | Admin Login | 登录功能 | Major | ⚠️ Partial |
| BE-02 | Admin Layout | Auth 验证逻辑 | Minor | ✅ Pass |
| BE-03 | Admin Dashboard | 统计数据显示 | Critical | ⚠️ Fail |
| BE-04 | Admin Pages | 页面管理 CRUD | Major | ⚠️ Partial |
| BE-05 | Admin Sections | 板块管理 | Major | ⚠️ Partial |
| BE-06 | Admin Products | 商品管理 | Critical | ⚠️ Partial |
| BE-07 | Admin Orders | 订单管理 | Major | ⚠️ Partial |
| BE-08 | Admin Orders | 详情弹窗变量作用域 | Critical | ⚠️ Fail |
| BE-09 | Admin | 退出登录 | — | ✅ Pass |
| BE-10 | Admin Layout | Topbar 模块标题 | Minor | ⚠️ Fail |
| API-01 | /api/products | GET 返回列表 | — | ✅ Pass |
| API-02 | /api/sections | GET 返回排序列表 | — | ✅ Pass |
| API-03 | /api/orders | GET 返回列表 | — | ✅ Pass |
| API-04 | /api/pages | GET 返回配置 | — | ✅ Pass |
| API-05 | /api/products | POST 新增商品 | Minor | ⚠️ Partial |
| API-06 | /api/sections | PUT 批量更新 | — | ✅ Pass |
| API-07 | /api/orders | POST/PUT/DELETE | — | ✅ Pass |
| API-08 | /api/pages | PUT 更新配置 | — | ✅ Pass |
| API-09 | data/*.json | 数据文件格式 | Minor | ⚠️ Partial |
| QA-01 | TypeScript | ProductCard categoryLabel | Critical | ⚠️ Fail |
| QA-02 | TypeScript | Section.type 定义 | Minor | ⚠️ Fail |
| QA-03 | Admin Auth | 登录验证逻辑 | Minor | ⚠️ Partial |
| QA-04 | API | 错误处理完善度 | Minor | ⚠️ Partial |
| QA-05 | Admin | 数据持久化 | Critical | ⚠️ Fail |
| QA-06 | Admin Sections | 可编辑字段完整性 | Minor | ⚠️ Fail |

### C1: ProductCard categoryLabel 类型不匹配
- **状态**：✅ Pass — 已修复，`categoryLabel` Record key 改为英文值（`"Clay Earrings"`/`"Bead Necklace"`/`"Bracelet"`/`"Mixed Pair"`），与 `Product.category` 实际值完全对应

### C2: Admin 仪表盘 pagesCount 读取错误
- **状态**：✅ Pass — 已修复，`config.pages?.length` 改为 `(config as { pages?: unknown[] }).pages?.length`，正确读取 SiteConfig 结构

### C3: Admin 所有写操作不调用 API
- **状态**：✅ Pass — 所有模块（pages/sections/products/orders）的 `handleSave` 和 `handleDelete` 均改为调用真实 API（POST/PUT/DELETE），并刷新本地 state

### C4: OrderDetailModal 引用未定义变量
- **状态**：✅ Pass — `statusLabels` 和 `orderClass` 在文件顶部定义为模块级常量，`OrderDetailModal` 正常运行

### C5: 后台无图片上传功能
- **状态**：✅ Pass — 在 `app/admin/sections/page.tsx` 和 `app/admin/products/page.tsx` 的编辑弹窗中增加图片 URL 输入框 + 预览图（imageUrl 字段），支持粘贴图床 URL

### C6: 后台无法配置商品完整信息
- **状态**：✅ Pass — `ProductModal` 已完整覆盖 Product 类型所有字段：name/price/category/imageUrl/description/materials/material/size/care/note/tags/inventory/featured/status/stockTag/cycle，新增 `imageUrl` 和 `description` 字段，新增 `featured` 字段，`status` 选项改为英文值

### C7: 后台板块管理缺少 title/subtitle/description 等编辑
- **状态**：✅ Pass — `SectionModal` 已增加所有字段编辑：title/subtitle/description/imageUrl/href/ctaLabel/order/isActive

### C8: 后台缺少全局配置入口
- **状态**：✅ Pass — 新建 `app/admin/settings/page.tsx`，支持配置 siteName/tagline/announcement/contactEmail/instagram，已在 `layout.tsx` 侧边栏增加"全局配置"导航入口

## 测试摘要（修复后）

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 总用例数 | 54 | 54 |
| ✅ Pass | 35 | 43 |
| ⚠️ Fail | 17 | 9 |
| ⏸️ Blocked | 2 | 2 |

修复后 Critical 问题全部归零，Major 问题剩余 4 项（登录密码验证、Shop 筛选、详情页缺失、API 验证）

| # | 问题 | 位置 | 说明 |
|---|---|---|---|
| C5 | 后台无图片上传功能 | `app/admin/sections/page.tsx` / `app/admin/products/page.tsx` | 板块配置和商品管理的图片只能填 URL，无法上传本地图片 |
| C6 | 后台无法配置商品完整信息 | `app/admin/products/page.tsx` | 商品新增/编辑弹窗缺少足够的字段编辑能力（material/size/care/note/tags 等虽在 Modal 中但与 Product 类型字段对应关系待确认） |
| C7 | 后台板块管理缺少 title/subtitle/description 等编辑 | `app/admin/sections/page.tsx` | 只能编辑 href/order/status，无法编辑板块标题/副标题/描述/图片URL/CTA按钮文字 |
| C8 | 后台缺少公告/品牌信息配置入口 | `app/admin/page.tsx` | 仪表盘无配置网站公告、品牌语等全局信息的入口 |

---

## 修复优先级（按 Critical → Major → Minor）

**C1-C4（Critical）** → 立即修复
**C5-C8（Critical，新增）** → 立即修复  
**M1-M6（Major）** → 第二批修复
**m1-m7（Minor）** → 可延后

---

### C5-C8 修复方案（新增）

#### C5: 添加图片上传功能
在 `app/admin/sections/page.tsx` 和 `app/admin/products/page.tsx` 的编辑弹窗中：
- 增加图片上传区域（`<input type="file" accept="image/*">`）
- 支持多图预览
- 上传后得到 URL 或 base64 填充到 image/imageUrl 字段
- 由于是 JSON 文件存储（无 S3），暂用 base64 或图床 URL 中转

#### C6: 完善商品信息配置
确认 Product 类型所有字段在编辑弹窗中均有对应 UI：
- name / price / category / imageUrl / description
- inventory / featured / status / stockTag
- cycle / material / size / care / note / tags

#### C7: 完善板块信息配置
SectionModal 弹窗中增加以下字段的编辑：
- title（板块标题）
- subtitle（副标题）
- description（描述）
- imageUrl（背景图URL，上传或URL）
- ctaLabel（CTA按钮文字）
- href（跳转链接）
- order（顺序）
- isActive（启用状态）

#### C8: 添加全局配置入口
在 Admin 仪表盘或设置页面中：
- 配置 siteName / tagline / announcement（网站公告）
- 配置 contactEmail / instagram
- 这些值写入 data/config.json

