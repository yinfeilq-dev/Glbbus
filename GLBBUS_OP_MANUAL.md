# GlbBus 跨境电商操作手册

> B2B 工业品跨境电商平台 — 全链路运营手册
> 
> 供应商：德悟（铝型材/紧固件/电气/CNC）· 瓦鲁（管件/法兰/电机/气动）
> 覆盖市场：东欧 · 北美 · 拉美 · 东南亚 · 中东
>
> 技术栈：Next.js 16 · Supabase · Vercel AI SDK · Tailwind 4

---

## 目录

- [第一部分：运营总览](#第一部分运营总览)
- [第二部分：站内运营](#第二部分站内运营)
- [第三部分：客户开发（核心工作流）](#第三部分客户开发核心工作流)
- [第四部分：LinkedIn 精准触达 SOP](#第四部分linkedin-精准触达-sop)
- [第五部分：开发信策略与模板](#第五部分开发信策略与模板)
- [第六部分：询盘跟进 SOP](#第六部分询盘跟进-sop)
- [第七部分：产品管理与上架](#第七部分产品管理与上架)
- [第八部分：网络与加速](#第八部分网络与加速)
- [第九部分：多语言运营](#第九部分多语言运营)
- [第十部分：技术运维](#第十部分技术运维)
- [附录：快捷查询](#附录快捷查询)

---

# 第一部分：运营总览

## 1.1 平台定位

**GlbBus** 是一个面向全球 B2B 买家的工业品选品与采购平台，AI 驱动全链路运营。核心价值：

- **买家侧**：多语言产品展示 + 快速询盘 + AI 辅助选品
- **运营侧**：AI 生成目标客户 + LinkedIn 触达 + 开发信营销 + 询盘管理

## 1.2 当前供应商与市场矩阵

| 供应商 | 主营品类 | 目标市场 | 当前产品数 | 联营方式 |
|--------|----------|----------|-----------|----------|
| **德悟** · Dewu Industrial | 铝型材、紧固件、电气元器件、CNC 机加工件 | 东欧、北美、拉美 | 20 | 联营 |
| **瓦鲁** · Waru Manufacturing | 管件、法兰、电机、气动、密封件、液压 | 东南亚、中东 | 20 | 联营 |

## 1.3 运营核心指标

| 指标 | 当前 | 说明 |
|------|------|------|
| 在线产品数 | 40 | 需持续扩充 |
| 目标客户线索 | — | 每周至少 AI 生成 2-3 批 |
| 已发送开发信 | — | 每封记录在 leads 表 |
| LinkedIn 连接数 | — | 每日 10-20 个连接请求 |
| 询盘转化 | — | 从线索 → 询盘的转化率 |

## 1.4 日常运营节奏（建议）

```
工作日：
上午 09:00 — 查看询盘 / 回复客户
上午 10:00 — AI 生成+筛选目标客户（15分钟）
上午 10:30 — LinkedIn 触达（20-30分钟）
下午 14:00 — 跟进已有线索 + 发送开发信
下午 15:30 — 产品管理 + 数据录入
下午 17:00 — 复盘当天工作，更新线索状态

每周：
周一 — 生成本周目标客户清单
周三 — 集中发送开发信
周五 — 复盘成交率，调整策略
```

---

# 第二部分：站内运营

## 2.1 访问前台

| 测试项 | 地址 |
|--------|------|
| 英文首页 | `/en` |
| 中文首页 | `/zh` |
| 俄文首页 | `/ru` |
| 西语首页 | `/es` |
| 阿拉伯语首页 | `/ar` |
| 产品列表 | `/en/products` |
| 产品详情 | `/en/products/{sku}` |

## 2.2 登录管理后台

**地址：** `/admin/dashboard`
**密码：** `glbbus2026`

管理后台包含 5 个 Tab：

| Tab | 功能 |
|-----|------|
| 📦 批量录入 | 粘贴 JSON 批量导入产品 |
| 🏭 供应商 | 查看 / 添加供应商 |
| 📋 产品列表 | 按供应商筛选产品 |
| 📩 询盘管理 | 查看买家询盘（new / contacted / closed） |
| **🎯 客户开发** | **核心工作区：AI 生成线索 + 表格管理 + 开发信 + LinkedIn** |

---

# 第三部分：客户开发（核心工作流）

> 所有操作在 `/admin/dashboard` → **🎯 客户开发** Tab 中完成

## 3.1 工作流全景

```
① AI 生成目标客户
   ↓
② 添加为线索 → 表格出现
   ↓
③ 搜索 LinkedIn（💼按钮）
   ↓
④ 找到关键联系人
   ↓
⑤ 发送连接请求（右侧匹配）
    或 发送开发信（✉️按钮）
   ↓
⑥ 对方回复 → 状态改为 contacted / replied
   ↓
⑦ 建交 → meeting / closed_won
```

## 3.2 AI 生成目标客户

**位置：** 页面顶部蓝色区块「🤖 AI 生成目标客户」

**操作步骤：**
1. 输入**行业**（如 `aluminum profiles`, `fasteners`, `CNC machining`）
2. 输入**国家**（如 `Germany`, `Mexico`, `Thailand`）
3. 点击 **"AI 生成"**
4. 系统返回 10 条目标客户描述
5. 逐条点击 **"+ 添加为线索"**

> 建议每天生成 2-3 个不同行业+国家组合，持续积累线索

## 3.3 手动添加线索

点击 **"+ 添加线索"**，填写：
- 公司名（必填）
- 联系人、邮箱、电话
- 国家、来源（LinkedIn / Google / TradeShow 等）
- 行业、网站

## 3.4 线索状态管理

每行线索右侧有状态下拉框：

| 状态 | 含义 | 下一步 |
|------|------|--------|
| `new` | 新线索，未接触 | LinkedIn 搜索 / 准备开发信 |
| `contacted` | 已发开发信 | 等待回复，3天后跟进 |
| `replied` | 对方已回复 | 切换模式，深入沟通 |
| `meeting` | 约了会议或视频 | 准备产品资料和报价 |
| `closed_won` | 成交 | 维护关系，介绍其他产品 |
| `closed_lost` | 放弃 | 记录原因，避免重复联系 |

## 3.5 查看线索详情

点击**公司名** → 弹出详情弹窗，显示：
- 全部联系信息
- 已发邮件数 + 上次时间
- LinkedIn 触达操作区（见第四部分）
- 快捷跳转到开发信

## 3.6 筛选与统计

顶部状态筛选按钮（All / new / contacted / ...），每个状态右侧显示计数。
顶部统计卡片一目了然各阶段的线索数量。

---

# 第四部分：LinkedIn 精准触达 SOP

> LinkedIn 是 B2B 工业品获客效率最高的渠道之一。

## 4.1 系统内 LinkedIn 快捷操作

你不需要离开 GlbBus 后台就能完成 LinkedIn 的准备工作。

**在表格中的每一行：**
- 点击 **💼** 按钮 → 自动在新标签页打开 LinkedIn 公司搜索，关键词已填入

**在详情弹窗的「💼 LinkedIn 触达」区域：**

| 按钮 | 功能 |
|------|------|
| 🔍 搜索公司 | LinkedIn 公司搜索结果页 |
| 👤 搜索联系人 | LinkedIn 人物搜索结果页 |
| 📋 复制 InMail 模板 | 复制一段 LinkedIn InMail 消息 → 去 LinkedIn 发送连接请求时粘贴 |

## 4.2 LinkedIn 完整操作流程

```
第一步：在 GlbBus 后台锁定目标公司
   ↓ 点 💼 或 🔍 搜索公司
第二步：在公司页面找"采购/供应链/运营"负责人
   ↓ 点 People 或搜索
第三步：发送连接请求（带个性化备注）
   ↓ 对方通过后
第四步：发送 InMail / 在消息中沟通
```

## 4.3 找谁联系最有效？

在 B2B 工业品领域，目标职位优先级：

| 职位 | 优先级 | 说明 |
|------|--------|------|
| **Procurement Manager** | ⭐⭐⭐ | 直接负责采购决策 |
| **Supply Chain Director** | ⭐⭐⭐ | 供应链总负责人 |
| **Purchasing Manager** | ⭐⭐⭐ | 采购经理 |
| **Operations Manager** | ⭐⭐ | 运营负责人，常参与采购 |
| **CEO / Founder** | ⭐⭐ | 中小企业直接决策 |
| **Product Manager** | ⭐ | 有时参与供应商评估 |

## 4.4 连接请求模板（带 InMail 模板）

连接请求（300 字上限）：

> Hi {contact_name},
>
> I came across {company_name} in the {industry} sector. We're GlbBus, a B2B platform specializing in aluminum profiles, fasteners, CNC parts, and electrical components for industrial buyers.
>
> Would be great to connect and explore how we might support your supply chain.

连接通过后 → 发消息（可使用 InMail 模板）：

> Hi {contact_name},
>
> Thanks for connecting! Just wanted to briefly introduce GlbBus (www.koudingcloud.com) — we're an AI-driven B2B platform working with verified Chinese manufacturers:
>
> • Aluminum profiles & extrusions
> • Fasteners, bolts, and hardware
> • Electrical components
> • Custom CNC / machined parts
>
> If you're sourcing any of these, happy to share our catalog and pricing.
>
> Best,
> Yin
> WhatsApp: +86 136 5194 5808

## 4.5 LinkedIn 每日操作量建议

| 操作 | 每日建议 | 说明 |
|------|----------|------|
| 搜索公司 | 5-10 家 | 不需要账号限制 |
| 发送连接请求 | 10-20 | LinkedIn 有 weekly limit (~100) |
| InMail | 5-10 | 付费才有次数 |
| 回复消息 | 按需 | 优先回复已连接的人 |

## 4.6 LinkedIn 避坑

- **不要批量添加好友**：LinkedIn 会封号
- **每天加人不超过 20**：安全线
- **连接请求一定要写备注**：通过率从 20% → 60%+
- **不要发链接**：第一封消息不要带网站链接，先建立信任
- **资料完善你的 Profile**：加完好友对方会看你的 Profile

---

# 第五部分：开发信策略与模板

## 5.1 开发信工作流

在 GlbBus 后台直接操作：

```
① 筛选线索（按状态、国家、行业）
   ↓
② 点击 ✉️ 按钮 → 弹出开发信模板
   ↓
③ 选择语言（EN / ZH / RU / ES）
   ↓
④ 📋 复制到剪贴板 → 粘贴进邮箱发送
   或 🚀 在邮箱中打开 → 自动填好主题和正文
   ↓
⑤ email_count 自动 +1，记录发送时间
```

## 5.2 四种语言模板

后台内置 4 种语言模板。点击 ✉️ 后在弹窗右上角切换：

| 语言 | 适用市场 | 说明 |
|------|----------|------|
| **EN** | 全球（通用） | 英语开发信 |
| **ZH** | 偶尔使用 | 中文开发信 |
| **RU** | 东欧（德悟市场） | 俄语开发信 |
| **ES** | 拉美（德悟市场） | 西班牙语开发信 |

每个模板会自动填充：
- 联系人姓名（`{contact_name}`）
- 公司名（`{company_name}`）
- 行业（`{industry}`）

## 5.3 开发信策略

### 第一批（陌生开发）
> 直接但不生硬，突出价值而非推销

核心要素：
- 提到对方公司名（说明你做了功课）
- 一句话介绍 GlbBus
- 列出你供应什么产品
- Call to action（约电话 / 索取报价需求）

### 第二批（跟进 — 3天后）
> 如果你还没回复，我再提一句附加价值

策略：加一张产品图 / 推荐某个产品 / 分享一个行业趋势

### 第三批（再跟进 — 1周后）
> 最后一次试探，礼貌收尾

如果三批都无回应 → 状态改为 `closed_lost`，标记 `never-responded`

## 5.4 每日发送量建议

| 阶段 | 每日发送 | 说明 |
|------|----------|------|
| 预热期（第1周） | 5-10 封/天 | 新域名 IP 预热 |
| 增长期（第2周） | 20-30 封/天 | 逐步增加 |
| 稳定期（第3周起） | 50 封/天 | 正常发送 |

> **重要：** 腾讯企业邮免费版单日有 500 封上限，初期完全够用。

---

# 第六部分：询盘跟进 SOP

## 6.1 查看询盘

**管理后台 → 📩 询盘管理**

1. 选择筛选条件（new / contacted / closed / all）
2. 点击 **🔍 查询**
3. 查看询盘详情：买家姓名、邮箱、国家、产品、需求描述

## 6.2 询盘跟进策略

| 时间 | 操作 |
|------|------|
| 收到询盘 **24小时内** | 回复报价 + 礼貌问候 |
| 3天未回复 | 跟进邮件 "Just checking if you received our quote" |
| 1周未回复 | 再次跟进，提供附加信息（如新品、案例） |
| 2周未回复 | 标记为 cold，不再主动跟进 |

## 6.3 询盘回复模板（英文）

> **Subject:** Re: Quotation from GlbBus — {Product Name}
>
> Hi {buyer_name},
>
> Thank you for your inquiry about {product_name} on GlbBus.
>
> Below is our quotation:
>
> — Product: {product_name}
> — Unit Price: ${price} (FOB {fob_port})
> — MOQ: {moq} pcs
> — Lead Time: {lead_time} days
> — Certifications: {certifications}
>
> If you need any further specifications or samples, please let me know.
>
> Looking forward to your feedback.
>
> Best regards,
> Yin
> GlbBus | sales@koudingcloud.com
> WhatsApp: +86 136 5194 5808

---

# 第七部分：产品管理与上架

## 7.1 SKU 编码规范

```
{供应商前缀}-{类别缩写}-{序号3位}

德悟（DW）：
  DW-EXT-001        铝型材 (Extrusion)
  DW-CNC-001        CNC 加工件
  DW-FAST-001       紧固件 (Fastener)
  DW-ELEC-001       电气 (Electrical)

瓦鲁（WR）：
  WR-FLG-001        法兰 (Flange)
  WR-FITTING-001    管件
  WR-CONV-001       输送带 (Conveyor)
  WR-MOTOR-001      电机
  WR-SENSOR-001     传感器
  WR-PNEU-001       气动 (Pneumatic)
  WR-SEAL-001       密封件 (Seal)
  WR-HYD-001        液压 (Hydraulic)
  WR-ELEC-001       电气
```

## 7.2 添加新产品（批量录入）

管理后台 → 📦 批量录入

```json
[
  {
    "sku": "DW-FAST-M8-021",
    "supplier_slug": "dewu-industrial",
    "name_en": "M8 Stainless Steel Hex Bolt",
    "name_zh": "M8不锈钢六角螺栓",
    "category": "Fasteners & Hardware",
    "specifications": {"material": "SS304", "size": "M8", "length": "30mm"},
    "base_price": 0.15,
    "certifications": ["ISO 9001"],
    "moq": 5000,
    "lead_time_days": 7,
    "fob_port": "Ningbo"
  }
]
```

## 7.3 已有产品查询

管理后台 → 📋 产品列表 → 筛选供应商 → **📋 查询**

## 7.4 供应商管理

管理后台 → 🏭 供应商

- 查看所有供应商
- 新增供应商（需在 Supabase Table Editor 中输入详细信息）

---

# 第八部分：网络与加速

> 跨境电商运营需要稳定访问海外网站（LinkedIn、Google、OpenAI、WhatsApp、海外买家官网等）。
> 同时，境外买家访问 GlbBus 网站也需要域名和 CDN 覆盖良好。

## 8.1 为什么需要网络加速

| 场景 | 无加速 | 有加速 |
|------|--------|--------|
| 访问 LinkedIn | 超时／加载慢 | 秒开 |
| 访问 OpenAI API | 连接错误 | 稳定调用 |
| 打开 Google 搜买家 | 异常 | 正常 |
| WhatsApp Web | 收不到消息 | 实时推送 |
| YouTube / 买家官网 | 打不开或极慢 | 流畅 |

AI 生成目标客户和开发信功能都需要访问 OpenAI API，**网络不通则这些功能无法正常使用**。

## 8.2 推荐方案

### 方案 A：Clash Meta / Mihomo（推荐，桌面端）

- **安装：**

```bash
# Homebrew 安装 Clash Meta（改名为 mihomo）
brew install mihomo

# 或下载 GUI 版本
# 推荐：Clash Verge Rev（开源 GUI，支持多平台）
# https://github.com/clash-verge-rev/clash-verge-rev/releases
```

- **配置：**
  1. 准备一个代理订阅链接（购买机场服务后获取）
  2. 打开 Clash Verge Rev → **订阅** → 粘贴链接 → 导入
  3. 开启 **TUN 模式**（全局代理，所有流量走代理）
  4. 开启**系统代理** → 浏览器可正常访问海外网站
  5. 节点选择：优先选延迟最低的节点

- **验证：**
  - 打开 [ip.sb](https://ip.sb) 确认 IP 为海外地址
  - 访问 [linkedin.com](https://linkedin.com) 正常加载

### 方案 B：Stash（macOS / iOS，付费）

- [https://stash.wiki](https://stash.wiki) — 付费应用，UI 简洁稳定
- 导入订阅链接，开启代理即可

### 方案 C：Surge（macOS / iOS，付费）

- [https://nssurge.com](https://nssurge.com) — 老牌工具，功能最全
- 适合高级用户，支持规则自定义、抓包、网络调试

## 8.3 开发环境代理配置

如果只在开发时需要访问海外资源（如 OpenAI API），可以在终端中设置临时代理：

```bash
# 假设 Clash 运行在本机，端口 7890
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 验证
export | grep -i proxy

# 测试 curl 是否走代理
curl -I https://www.google.com

# 运行项目（会继承代理环境变量）
npm run dev
```

**永久配置（加到 ~/.zshrc）：**

```bash
echo '
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
' >> ~/.zshrc
source ~/.zshrc
```

**关闭代理：**

```bash
unset HTTP_PROXY HTTPS_PROXY
```

> **注意：** Vercel 部署后运行的 API 调用不受本地代理影响。
> 如果需要在 Vercel 上使用 OpenAI，需要在 Vercel Dashboard 为环境变量 `OPENAI_API_KEY` 配置 Vercel Edge 可访问的 Key。

## 8.4 域名与 CDN

GlbBus 部署在 Vercel，自动享受 Vercel Edge Network CDN：

| 地区 | CDN 覆盖 | 预计加载速度 |
|------|----------|-------------|
| 北美 | ✅ Vercel Edge | < 200ms |
| 欧洲 | ✅ Vercel Edge | < 300ms |
| 东南亚 | ✅ Vercel Edge 节点 | < 500ms |
| 中东 | ✅ Vercel Edge 节点 | < 600ms |
| 拉美 | ⚠️ 节点较少 | < 1s |
| 中国内地 | ❌ 不覆盖（需国内备案） | — |

**域名管理：** 在 Vercel Dashboard → 项目 → Settings → Domains 中配置。

当前绑定域名：`koudingcloud.com`

## 8.5 常见网络问题排查

| 问题 | 原因 | 解决 |
|------|------|------|
| OpenAI API 报错 `Connection Error` | 代理未启 / 节点失效 | 检查代理状态，切换节点 |
| LinkedIn 打不开 | 代理规则未匹配 | 开启 TUN 模式或全局代理 |
| 后台 AI 生成按钮点了没反应 | 前端请求到 API 超时 | F12 看 Network 是否 500；检查 `OPENAI_API_KEY` |
| Vercel 部署的站 OpenAI 调用失败 | Vercel 环境无 Key | 去 Vercel Dashboard 添加 `OPENAI_API_KEY` |
| WhatsApp 消息延迟 | 代理影响 WebSocket | 对 whatsapp.com 设直连规则 |

## 8.6 云端 API Key（Vercel）

如果本地代理正常，但部署到 Vercel 后 OpenAI 调用失败，原因是 Vercel 环境没配 Key：

1. 登录 [vercel.com](https://vercel.com) → 项目 → Settings
2. 左侧 **Environment Variables**
3. 添加 `OPENAI_API_KEY` → 填入 Key → 保存
4. 重新部署

---

# 第九部分：多语言运营

## 8.1 系统支持 5 种语言

| 代码 | 语言 | RTL | 适用市场 |
|------|------|-----|----------|
| `en` | English | 否 | 全球 |
| `zh` | 简体中文 | 否 | 中国 |
| `ru` | Русский | 否 | 东欧 |
| `es` | Español | 否 | 拉美 |
| `ar` | العربية | 是 | 中东 |

## 8.2 翻译字典编辑

翻译文件：`src/i18n/dictionaries/{lang}.json`

修改后重新部署即可生效。主要翻译键：

```
common.site_name
navigation.products / suppliers / about / contact
home.hero_title / hero_subtitle
products.page_title / count_label / sku_label
inquiry.title / success_message
suppliers.page_title
about.page_title
contact.page_title
```

## 8.3 产品描述多语言管理

每个产品的描述存储在 `products.description` JSONB 字段，标准格式：

```json
{
  "en": "...",
  "zh": "...",
  "ru": "...",
  "es": "...",
  "ar": "..."
}
```

---

# 第十部分：技术运维

## 9.1 快速启动

```bash
cd 01-Dev/06-GlbBus
npm install
npm run dev
```

## 9.2 环境变量

| 变量 | 必填 | 来源 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 同上（管理后台用） |
| `OPENAI_API_KEY` | ❌ | [platform.openai.com](https://platform.openai.com) |

## 9.3 数据库（Supabase）

**项目 ID：** `qktaaivkcrxriaoaqsnz`

**主要表：**
- `products` — 产品数据
- `suppliers` — 供应商数据
- `inquiries` — 买家询盘
- `leads` — 目标客户线索（客户开发核心表）

## 9.4 Vercel 部署

```bash
git push origin main
# Vercel 自动部署
```

## 9.5 执行脚本

```bash
# 产品批量录入
npx tsx scripts/seed-products.ts

# 模板规则生成描述（离线可用）
npx tsx scripts/generate-descriptions-rule.ts

# AI 描述生成（需 OpenAI API key）
npx tsx scripts/generate-descriptions.ts

# 检查 leads 表
npx tsx scripts/check-table.ts
```

---

# 附录：快捷查询

## 地址

| 页面 | 地址 |
|------|------|
| 前台首页 | `https://glbbus.vercel.app/{lang}` |
| 管理后台 | `https://glbbus.vercel.app/admin/dashboard` |
| 本地开发 | `http://localhost:3000/admin/dashboard` |

## 管理后台密码

```
glbbus2026
```

## 联系方式

```
企业名：GlbBus
网站：www.koudingcloud.com
销售邮箱：sales@koudingcloud.com
WhatsApp：+86 136 5194 5808
联系人：Yin（尹）
```

## 快捷命令

```bash
# 本地启动
cd 01-Dev/06-GlbBus && npm run dev

# 构建
npm run build

# 类型检查
npx tsc --noEmit

# 代码提交 + 自动部署
git add -A && git commit -m "update" && git push origin main
```

---

> 版本：2026-07-13 · 如有疑问联系运营负责人 Yin
> 下次更新：每周五复盘后更新
