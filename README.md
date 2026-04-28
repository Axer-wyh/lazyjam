# LazyJam 🌿

> 手作粘土与串珠首饰品牌网站

**风格**：Wabi-sabi（诧寂）/ 慵懒 / 亚麻感 / 复古藏书票
**产品**：Polymer Clay 手作 + 串珠首饰

---

## 🌐 在线访问

### 前端网站
**[https://lazyjam.vercel.app](https://lazyjam.vercel.app)** （Vercel 部署）

### 后台管理系统
**[https://lazyjam.vercel.app/admin](https://lazyjam.vercel.app/admin)**

> 初始账号密码已通过 Telegram 私信发送给品牌负责人

---

## 🚀 本地开发

```bash
# 克隆项目
git clone https://github.com/Axer-wyh/lazyjam.git
cd lazyjam

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
# 前端：http://localhost:3000
# 后台：http://localhost:3000/admin
```

---

## 📁 项目结构

```
lazyjam/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx            # 首页
│   ├── shop/               # 商品列表
│   ├── about/              # 关于页面
│   ├── journal/            # 手作日记
│   ├── admin/              # 后台管理系统
│   │   ├── pages/          # 页面管理
│   │   ├── sections/       # 板块管理
│   │   ├── products/       # 商品管理
│   │   ├── orders/         # 订单管理
│   │   └── login/          # 登录页
│   └── api/                # API Routes
├── components/             # React 组件
├── data/                   # JSON 数据存储（初始版本）
├── lib/                    # 工具函数和类型定义
└── public/images/           # 静态图片资源
```

---

## ✨ 功能

### 前端
- 🏠 **首页**：Hero + 精选商品 + 工艺展示 + Journal 入口
- 🛍️ **商品列表**：按分类筛选，商品卡片展示
- 📖 **手作日记**：品牌博客/日记列表
- ℹ️ **关于页面**：品牌故事

### 后台 (Admin CMS)
- 📄 **页面管理**：创建/编辑/发布页面
- 🎨 **板块管理**：配置 Hero、精选商品、Collections 等区块的图片和链接
- 📦 **商品管理**：增删改商品，设置价格/库存/标签
- 📋 **订单管理**：查看订单、处理状态、导出数据

---

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router)
- **样式**：Tailwind CSS
- **语言**：TypeScript
- **存储**：JSON 文件（初始版本）/ 可扩展至数据库
- **部署**：Vercel

---

## 🔧 部署说明

### 部署到 Vercel（推荐）

1. 点击上方链接访问 Vercel
2. Import from GitHub
3. 选择 `Axer-wyh/lazyjam` 仓库
4. Deploy

### 或使用 Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 🎨 设计系统

| 用途 | 色名 | HEX |
|------|------|-----|
| 主背景 | Raw Linen | `#F3EFE6` |
| 次背景 | Warm Oat | `#E7DDCC` |
| 主文字 | Charcoal Clay | `#2E2A25` |
| 次文字 | Weathered Taupe | `#7A6F63` |
| 边框 | Soft Stone | `#C9BFAF` |
| 辅色 | Dried Sage | `#A6AD93` |
| 强调 | Burnt Persimmon | `#A3543F` |

**字体**：Cormorant Garamond（标题）+ Inter（正文）+ Noto Sans SC（中文）

---

*Made with quiet hands.*