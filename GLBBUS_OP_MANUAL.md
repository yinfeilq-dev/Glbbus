# GlbBus 操作手册

> B2B 工业品跨境电商平台 — 全球多语言产品展示 + AI 询盘系统
>
> 技术栈：Next.js 16 · Supabase · Vercel AI SDK · Tailwind 4

---

## 目录

1. [快速启动](#1-快速启动)
2. [项目架构](#2-项目架构)
3. [部署指南](#3-部署指南)
4. [产品管理](#4-产品管理)
5. [多语言翻译管理](#5-多语言翻译管理)
6. [供应商管理](#6-供应商管理)
7. [询盘管理](#7-询盘管理)
8. [AI 内容生成](#8-ai-内容生成)
9. [数据录入脚本](#9-数据录入脚本)
10. [API 接口文档](#10-api-接口文档)
11. [邮件营销配置](#11-邮件营销配置)

## 1. 快速启动

### 1.1 环境要求

- Node.js ≥ 20
- npm 或 pnpm
- Supabase 项目（已创建）
- OpenAI API Key（可选，用于 AI 描述生成）

### 1.2 本地启动

```bash
# 进入项目目录
cd 01-Dev/06-GlbBus

# 安装依赖
npm install

# 配置环境变量（已配置好，可跳过）
# .env.local 包含 Supabase URL 和 anon key

# 启动开发服务器
npm run dev

# 访问
open http://localhost:3000
```

### 1.3 生产构建

```bash
npm run build
npm start
```

### 1.4 测试环境验证

| 测试项 | 访问地址 | 预期 |
|--------|----------|------|
| 英文首页 | `http://localhost:3000/en` | ✅ 200 |
| 中文首页 | `http://localhost:3000/zh` | ✅ 200 |
| 阿拉伯语 | `http://localhost:3000/ar` | ✅ 200（RTL 布局） |
| 根路径 | `http://localhost:3000/` | ✅ 307 → 自动重定向 |
| 产品列表 | `http://localhost:3000/en/products` | ✅ 40 个产品 |
| 产品详情 | `http://localhost:3000/en/products/DW-EXT-6063T5-001` | ✅ 详情页 |
| 语言切换 | Header 下拉框切换语言 | ✅ 刷新页面切换 |

---

## 2. 项目架构

```
src/
├── app/
│   ├── [locale]/              ← 多语言路由（中/英/俄/西/阿）
│   │   ├── layout.tsx         ← 语言级布局（lang, dir）
│   │   ├── page.tsx           ← 首页
│   │   ├── products/
│   │   │   ├── page.tsx       ← 产品列表页
│   │   │   └── [slug]/page.tsx ← 产品详情页
│   ├── api/
│   │   ├── inquiries/route.ts       ← POST 询盘提交
│   │   └── generate-description/route.ts ← POST AI 描述生成
│   ├── layout.tsx             ← 根布局（shell 壳）
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── header.tsx         ← 导航 + 语言切换
│   │   └── footer.tsx         ← 页脚
│   └── product/
│       ├── product-card.tsx   ← 产品卡片
│       └── inquiry-form.tsx   ← 询盘表单
│
├── i18n/
│   ├── config.ts              ← 语言配置（5语言代码/名称/RTL）
│   ├── load-dictionary.ts     ← 字典加载 + t() 翻译函数
│   └── dictionaries/          ← 5 语言翻译 JSON
│       ├── en.json
│       ├── zh.json
│       ├── ru.json
│       ├── es.json
│       └── ar.json
│
├── lib/
│   ├── ai.ts                  ← AI SDK 配置 + 多语言生成 Pipeline
│   ├── types.ts               ← 数据库类型定义
│   └── supabase/
│       ├── client.ts          ← 浏览器端 Supabase 客户端
│       └── server.ts          ← 服务端 Supabase 客户端
│
├── middleware.ts              ← 语言检测重定向
└── env.ts                     ← 环境变量验证

scripts/                       ← 数据录入 & 生成脚本
├── seed-products.ts           ← 产品批量录入
├── generate-descriptions.ts   ← AI 描述生成（需要 OpenAI API）
└── generate-descriptions-rule.ts ← 模板规则描述生成（离线可用）
```

---

## 3. 部署指南

### 3.1 Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd 01-Dev/06-GlbBus
vercel

# 4. 设置环境变量（Vercel Dashboard → Settings → Environment Variables）
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...           # 可选，用于 AI 描述生成
```

### 3.2 自定义域名

在 Vercel Dashboard 中：
1. 进入项目 → **Settings** → **Domains**
2. 输入你的域名（如 `glbbus.com`）
3. 在域名 DNS 管理面板中添加 Vercel 提供的 CNAME 记录
4. 等待 SSL 证书自动签发（~几分钟）

**多语言 SEO 优化：** 多语言路由会自动产生 `/en/`、`/zh/`、`/ru/` 等路径，搜索引擎会视为独立页面。

### 3.3 环境变量清单

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名 Key |
| `OPENAI_API_KEY` | ❌ | OpenAI API Key（AI 描述生成） |

---

## 4. 产品管理

### 4.1 数据库表结构

#### `products` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `supplier_id` | UUID | 供应商外键 |
| `sku` | TEXT | 唯一产品编码 |
| `name_en` | TEXT | 英文名 |
| `name_zh` | TEXT | 中文名 |
| `description` | JSONB | 多语言描述 `{en, zh, ru, es, ar}` |
| `specifications` | JSONB | 规格参数键值对 |
| `base_price` | NUMERIC | 基础单价 |
| `category` | TEXT | 分类 |
| `images` | JSONB | 图片 URL 数组 |
| `certifications` | JSONB | 认证列表 |
| `moq` | INTEGER | 最小起订量 |
| `lead_time_days` | INTEGER | 交期（天） |
| `fob_port` | TEXT | FOB 港口 |
| `is_published` | BOOLEAN | 是否上架 |

### 4.2 添加新产品

**方式一：通过 Supabase Dashboard（推荐）**

1. 登录 [Supabase Dashboard](https://supabase.com)
2. 选择项目 → **Table Editor** → **products**
3. 点击 **Insert row**
4. 填写字段，注意：
   - `sku` 必须唯一，格式建议 `{供应商前缀}-{类别缩写}-{序号}`（如 `DW-EXT-6063T5-001`）
   - `description` 是 JSON 对象：`{"en": "...", "zh": "...", "ru": "...", "es": "...", "ar": "..."}`
   - `specifications` 是 JSON 对象：`{"material": "Aluminum 6063-T5", "length": "6m"}`
   - `images` 是 JSON 数组：`[]`
   - `certifications` 是 JSON 数组：`["CE", "RoHS"]`

**方式二：使用数据录入脚本**

```bash
# 编辑 scripts/seed-products.ts，在对应供应商数组中添加新产品条目
# 然后运行：
npx tsx scripts/seed-products.ts
```

### 4.3 SKU 编码规范

```
{供应商前缀}-{类别缩写}-{序号3位}

德悟（DW）：
  DW-EXT-001   铝型材 (Extrusion)
  DW-CNC-001   CNC 加工件
  DW-FAST-001  紧固件 (Fastener)
  DW-PIPE-001  管件
  DW-ELEC-001  电气 (Electrical)
  DW-VALVE-001 阀门
  DW-SPRING-001弹簧

瓦鲁（WR）：
  WR-FLG-001   法兰 (Flange)
  WR-FITTING-001 管件
  WR-CONV-001  输送带 (Conveyor)
  WR-MOTOR-001 电机
  WR-SENSOR-001 传感器
  WR-PNEU-001  气动 (Pneumatic)
  WR-SEAL-001  密封件 (Seal)
  WR-HYD-001   液压 (Hydraulic)
  WR-ELEC-001  电气
```

### 4.4 修改产品信息

通过 Supabase Dashboard → **Table Editor** → **products** → 直接编辑单元格。

**注意：** 如果修改多语言描述，请确保所有 5 种语言都填写完整。如果修改 `description` 字段，以 JSON 格式编辑。

---

## 5. 多语言翻译管理

### 5.1 系统支持的语言

| 代码 | 语言 | 方向 | 目标市场 |
|------|------|------|----------|
| `en` | English | LTR | 全球通用 |
| `zh` | 简体中文 | LTR | 中国供应商 |
| `ru` | Русский | LTR | 东欧市场（德悟） |
| `es` | Español | LTR | 拉美市场（德悟） |
| `ar` | العربية | RTL | 中东市场（瓦鲁） |

### 5.2 编辑翻译字典

翻译字典在 `src/i18n/dictionaries/{lang}.json`，支持嵌套 key 和参数插值。

**示例（编辑英文）：**

```json
{
  "navigation": {
    "products": "Products",
    "suppliers": "Suppliers"
  },
  "home": {
    "hero_title": "Industrial Products, Sourced Globally",
    "hero_subtitle": "Connect with verified manufacturers..."
  },
  "products": {
    "count_label": "{count} products available"
  }
}
```

**参数插值语法：** `{参数名}`，例如 `"count_label": "{count} products"`，代码中传入 `{ count: 40 }`。

**完整翻译键层级：**

```
common.site_name       — 站点名
common.site_tagline    — 站点标语
common.search_placeholder — 搜索框占位文字
common.trusted_suppliers — 认证供应商标签
navigation.products    — 导航"产品"
navigation.suppliers   — 导航"供应商"
navigation.about       — 导航"关于"
navigation.contact     — 导航"联系我们"
home.hero_title        — 首页大标题
home.hero_subtitle     — 首页副标题
home.featured_title    — 推荐产品标题
products.page_title    — 产品列表页标题
products.count_label   — 产品数量文字
products.sku_label     — SKU 标签
products.certifications — 认证标签
inquiry.title          — 询盘表单标题
inquiry.*_placeholder  — 表单占位文字
inquiry.success_message — 提交成功提示
suppliers.page_title   — 供应商页标题
about.page_title       — 关于页标题
contact.page_title     — 联系页标题
```

### 5.3 添加新产品描述

每个产品的多语言描述存储在 `products.description` JSONB 字段中：

```json
{
  "en": "English description...",
  "zh": "中文描述...",
  "ru": "Описание на русском...",
  "es": "Descripción en español...",
  "ar": "الوصف بالعربية..."
}
```

### 5.4 语言路由行为

| 访问路径 | 行为 |
|----------|------|
| `https://glbbus.com/en/...` | 直接显示英文版 |
| `https://glbbus.com/zh/...` | 直接显示中文版 |
| `https://glbbus.com/` | 检测浏览器语言 → 重定向到对应版本 |
| `https://glbbus.com/?q=search` | 重定向后保留 query string |

---

## 6. 供应商管理

### 6.1 当前供应商

| 供应商 | ID | 产品数 | 目标市场 |
|--------|-----|--------|----------|
| 德悟 Dewu Industrial | `7ecefeb5-...` | 20 | 东欧 · 北美 · 拉美 |
| 瓦鲁 Waru Manufacturing | `49f4c400-...` | 20 | 东南亚 · 中东 |

### 6.2 添加新供应商

1. 进入 Supabase Dashboard → **Table Editor** → **suppliers**
2. 点击 **Insert row**
3. 填写字段：
   - `name` — 公司名称
   - `slug` — URL 友好名称（如 `new-supplier`）
   - `country` — 国家
   - `contact_email` — 联系邮箱
   - `certifications` — JSON 数组
   - `production_capacity` — 产能描述
   - `api_webhook_url` — 可选，后续自动化对接用
4. 在产品管理中添加该供应商的产品

### 6.3 供应商 API Webhook（高级功能）

系统支持供应商通过 Webhook 接收询盘通知。联系开发人员配置 `suppliers.api_webhook_url` 字段。

---

## 7. 询盘管理

### 7.1 询盘流程

```
买家填写表单
    ↓
POST /api/inquiries
    ↓
存入 Supabase inquiries 表 (status: "new")
    ↓ (手动)
登录 Supabase Dashboard 查看新询盘
    ↓
联系买家 → 转为 "contacted"
    ↓
报价 → 转为 "quoted"
    ↓
完成 → 转为 "closed"
```

### 7.2 查看询盘

1. 登录 [Supabase Dashboard](https://supabase.com)
2. 选择项目 → **Table Editor** → **inquiries**
3. 按 `created_at desc` 排序，最上面是最新询盘

### 7.3 询盘表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `product_id` | UUID | 关联产品 |
| `buyer_name` | TEXT | 买家姓名 |
| `buyer_email` | TEXT | 买家邮箱 |
| `buyer_phone` | TEXT | 电话（选填） |
| `buyer_country` | TEXT | 国家 |
| `company_name` | TEXT | 公司名（选填） |
| `quantity` | INTEGER | 询价数量 |
| `message` | TEXT | 需求描述 |
| `ai_quality_score` | INTEGER | AI 质量评分（0-100，预留） |
| `status` | TEXT | 状态：new/contacted/quoted/closed |
| `created_at` | TIMESTAMPTZ | 提交时间 |

### 7.4 询盘字段说明（中文对照）

| 表字段 | 表单字段 | 说明 |
|--------|----------|------|
| `buyer_name` | Your Name / 您的姓名 | 必填 |
| `buyer_email` | Email / 邮箱 | 必填 |
| `buyer_country` | Country / 国家 | 必填 |
| `quantity` | Quantity / 数量 | 选填 |
| `message` | 需求描述 | 必填 |

---

## 8. AI 内容生成

### 8.1 API 调用

**请求：**

```bash
curl -X POST https://your-domain.com/api/generate-description \
  -H "Content-Type: application/json" \
  -d '{
    "name_en": "6063-T5 Aluminum Extrusion Profile",
    "name_zh": "6063-T5 铝合金型材",
    "category": "Aluminum Profiles",
    "material": "Aluminum 6063-T5",
    "specifications": {
      "length": "Custom (max 6m)",
      "tolerance": "±0.1mm",
      "surface_finish": "Anodized / Powder Coated"
    },
    "certifications": ["CE", "RoHS"]
  }'
```

**响应：**

```json
{
  "success": true,
  "description": {
    "en": "Professional B2B English description...",
    "zh": "专业B2B中文描述...",
    "ru": "B2B описание на русском...",
    "es": "Descripción B2B en español...",
    "ar": "وصف B2B بالعربية..."
  }
}
```

### 8.2 批量生成描述

```bash
# 当前状态：OpenAI API 网络不通，用模板规则
npx tsx scripts/generate-descriptions-rule.ts

# 网络通后，切换到 AI 生成（会覆盖模板描述）
npx tsx scripts/generate-descriptions.ts
```

**注意：** `generate-descriptions.ts` 需要在 `.env.local` 中设置 `OPENAI_API_KEY`。一次调用约 5-10 秒，40 个产品约 5-7 分钟。

---

## 9. 数据录入脚本

### 9.1 产品批量录入

```bash
npx tsx scripts/seed-products.ts
```

**用途：** 一次性批量添加新产品。编辑 `scripts/seed-products.ts` 中的 `DEWU_PRODUCTS` 或 `WARU_PRODUCTS` 数组，然后运行脚本。

**产品条目格式：**

```typescript
{
  sku: "DW-EXT-TSLOT-006",         // 唯一 SKU
  name_en: "T-Slot Aluminum Profile",
  name_zh: "T型槽铝合金型材",
  category: "Aluminum Profiles",    // 分类
  material: "Aluminum 6063-T5",    // 材料
  specs: {
    profile: "40mm x 40mm",
    slot_width: "8mm",
    length: "Custom (max 6m)",
    finish: "Clear Anodized"
  },
  price: 5.8,                       // 单价（USD）
  cert: ["CE", "RoHS"],             // 认证
  moq: 200,                         // 最小起订量
  lead_time: 10,                    // 交期（天）
  fob: "Ningbo"                     // FOB 港口
}
```

### 9.2 描述生成（模板）

```bash
npx tsx scripts/generate-descriptions-rule.ts
```

为所有 `description.en` 为空的产品，用模板规则生成 5 语言描述。

---

## 10. API 接口文档

### 10.1 询盘提交

```
POST /api/inquiries

Request Body:
{
  "product_id": "UUID",
  "buyer_name": "string",
  "buyer_email": "string",
  "buyer_phone": "string (optional)",
  "buyer_country": "string",
  "quantity": "number (optional)",
  "message": "string"
}

Response 200:
{
  "success": true,
  "inquiry": { ... }
}

Response 400/500:
{
  "error": "error message"
}
```

### 10.2 AI 描述生成

```
POST /api/generate-description

Request Body:
{
  "name_en": "string (required)",
  "name_zh": "string (optional)",
  "category": "string (required)",
  "material": "string (required)",
  "specifications": { key: value } (required),
  "certifications": ["string"] (optional)
}

Response 200:
{
  "success": true,
  "description": {
    "en": "...",
    "zh": "...",
    "ru": "...",
    "es": "...",
    "ar": "..."
  }
}
```

---


### 11.1 发送方式选择

| 方式 | 适用场景 | 成本 |
|------|----------|------|
| 腾讯企业邮（免费版） | 日常一对一沟通，50人内免费 | 免费 |
| Brevo (Sendinblue) | 批量开发信、Newsletter、自动化 | 免费300封/天 |

### 11.2 腾讯企业邮配置步骤

1. 注册 [腾讯企业邮免费版](https://exmail.qq.com/)
2. 验证域名 `koudingcloud.com` 所有权
3. 登录 DNSPod → 添加以下 MX 记录：

```
主机记录 @ → 邮件服务器 mxexmail.com → 优先级 5
主机记录 @ → 邮件服务器 mxexmail.com → 优先级 10 (备用)
```

4. 添加 SPF 记录（避免被标记为垃圾邮件）：

```
主机记录 @ → TXT 类型 → 值：v=spf1 include:spf.exmail.qq.com ~all
```

5. 等待 DNS 生效（约10分钟-2小时）
6. 创建邮箱账户 `sales@koudingcloud.com`
7. 登录 webmail 验证收发正常

### 11.3 开发信避坑指南

- **新域名先预热**：刚注册域名的 IP 信誉低，先从每天5-10封开始
- **个性化第一封**：不要群发语气，提及对方公司/产品
- **避免链接过多**：第一封邮件含多个链接容易触发垃圾邮件过滤
- **SPF/DKIM 必须配**：不配直接进垃圾箱
- **每日上限**：初次建议 20-30 封，后续逐步增加
- **退订/停止标记**：对方回复"退订"应立即停止联系

---

> 版本: 2026-07-12 · 如有疑问联系开发团队
