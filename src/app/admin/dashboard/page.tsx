/**
 * 管理后台 Dashboard
 * - 产品批量录入（文本 JSON 模式）
 * - 供应商管理（查看 & 新增）
 * - 产品列表筛选
 *
 * 访问: /admin/dashboard
 * 简易认证: 页面提供密码输入（避免公开访问）
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import TargetsPage from "./targets";
import ProductsManager from "@/components/admin/products-manager";

// ===== 类型 =====
type Supplier = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
};

type ProductEntry = {
  sku: string;
  supplier_slug: string;
  name_en: string;
  name_zh: string;
  category: string;
  specifications: Record<string, string>;
  base_price: number;
  certifications: string[];
  moq: number;
  lead_time_days: number;
  fob_port: string;
};

type BulkResult = {
  sku: string;
  status: "ok" | "skipped" | "error";
  message?: string;
};

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Tab 状态
  const [activeTab, setActiveTab] = useState<"bulk" | "suppliers" | "products" | "products-manager" | "inquiries" | "targets">("bulk");

  // 批量录入
  const [jsonInput, setJsonInput] = useState("");
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

  // 供应商管理
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", slug: "", country: "", certifications: "", production_capacity: "" });
  const [supplierMsg, setSupplierMsg] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // 产品列表
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // ===== 简易认证 =====
  const handleLogin = () => {
    // 简易密码: glbbus2026
    if (password === "glbbus2026") {
      setAuthenticated(true);
      loadSuppliers();
    } else {
      alert("密码错误");
    }
  };

  // ===== 加载供应商 =====
  const loadSuppliers = useCallback(async () => {
    const res = await fetch("/api/admin?action=suppliers");
    const data = await res.json();
    if (data.suppliers) setSuppliers(data.suppliers);
  }, []);

  // ===== 批量录入产品 =====
  const handleBulkSubmit = async () => {
    setBulkError("");
    setBulkResults([]);

    let products: ProductEntry[];
    try {
      const parsed = JSON.parse(jsonInput);
      products = Array.isArray(parsed) ? parsed : parsed.products || [];
      if (!Array.isArray(products) || products.length === 0) {
        setBulkError("JSON 必须包含一个非空的产品数组");
        return;
      }
    } catch {
      setBulkError("JSON 解析失败，请检查格式");
      return;
    }

    // 验证必填字段
    for (const p of products) {
      if (!p.sku || !p.supplier_slug || !p.name_en) {
        setBulkError(`产品 ${p.sku || "(missing sku)"} 缺少必填字段 (sku, supplier_slug, name_en)`);
        return;
      }
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk-products", products }),
      });
      const data = await res.json();
      setBulkResults(data.results || []);
    } catch (err) {
      setBulkError("提交失败: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBulkLoading(false);
    }
  };

  // ===== 新增供应商 =====
  const handleAddSupplier = async () => {
    setSupplierMsg("");
    if (!newSupplier.name || !newSupplier.slug) {
      setSupplierMsg("请输入名称和 slug");
      return;
    }
    try {
      const isEdit = !!editingSupplier;
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update-supplier" : "add-supplier",
          id: isEdit ? editingSupplier!.id : undefined,
          name: newSupplier.name,
          slug: newSupplier.slug,
          country: newSupplier.country,
          certifications: newSupplier.certifications ? newSupplier.certifications.split(",").map((s: string) => s.trim()) : [],
          production_capacity: newSupplier.production_capacity,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSupplierMsg("❌ " + data.error);
      } else {
        setSupplierMsg(`✅ ${isEdit ? "更新" : "添加"}供应商 ${data.supplier.name} 成功`);
        setNewSupplier({ name: "", slug: "", country: "", certifications: "", production_capacity: "" });
        setEditingSupplier(null);
        loadSuppliers();
      }
    } catch (err) {
      setSupplierMsg("❌ 提交失败");
    }
  };

  const handleEditSupplier = async (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier({
      name: supplier.name,
      slug: supplier.slug,
      country: supplier.country || "",
      certifications: Array.isArray((supplier as any).certifications)
        ? (supplier as any).certifications.join(", ")
        : (supplier as any).certifications || "",
      production_capacity: (supplier as any).production_capacity || "",
    });
    setSupplierMsg("");
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("确定删除此供应商？此操作不可撤销。")) return;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-supplier", id }),
    });
    if (res.ok) {
      setSupplierMsg("✅ 供应商已删除");
      loadSuppliers();
    } else {
      setSupplierMsg("❌ 删除失败");
    }
  };

  // ===== 加载产品 =====
  const loadProducts = async (supplierSlug?: string) => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({ action: "products" });
      if (supplierSlug) params.set("supplier", supplierSlug);
      const res = await fetch(`/api/admin?${params}`);
      const data = await res.json();
      setAllProducts(data.products || []);
    } finally {
      setProductsLoading(false);
    }
  };

  const [filterSupplier, setFilterSupplier] = useState("");

  // ===== 询盘管理 =====
  const [allInquiries, setAllInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState("new");

  const loadInquiries = useCallback(async (status?: string) => {
    setInquiriesLoading(true);
    try {
      const params = new URLSearchParams({ action: "inquiries" });
      if (status && status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin?${params}`);
      const data = await res.json();
      setAllInquiries(data.inquiries || []);
    } finally {
      setInquiriesLoading(false);
    }
  }, []);

  // ===== 渲染 =====
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="w-80 rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-xl font-bold text-slate-900">GlbBus Admin</h1>
          <input
            type="password"
            placeholder="输入管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            登录
          </button>
        </div>
      </div>
    );
  }

  // Tab 内容
  const tabClass = (tab: string) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg ${
      activeTab === tab
        ? "bg-white text-blue-700 border-t-2 border-blue-600 shadow-sm"
        : "bg-slate-100 text-slate-500 hover:text-slate-700"
    }`;

  const stats = {
    ok: bulkResults.filter((r) => r.status === "ok").length,
    skipped: bulkResults.filter((r) => r.status === "skipped").length,
    error: bulkResults.filter((r) => r.status === "error").length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶栏 */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-blue-700">GlbBus Admin</h1>
          <a href="/en" className="text-sm text-slate-400 hover:text-blue-600">
            ← 返回前台
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Tab 导航 */}
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          <button onClick={() => setActiveTab("bulk")} className={tabClass("bulk")}>
            📦 批量录入
          </button>
          <button onClick={() => setActiveTab("suppliers")} className={tabClass("suppliers")}>
            🏭 供应商
          </button>
          <button onClick={() => setActiveTab("products")} className={tabClass("products")}>
            📋 产品列表
          </button>
          <button onClick={() => setActiveTab("products-manager")} className={tabClass("products-manager")}>
            🛠 产品管理
          </button>
          <button onClick={() => setActiveTab("inquiries")} className={tabClass("inquiries")}>
            📩 询盘管理
          </button>
          <button onClick={() => setActiveTab("targets")} className={tabClass("targets")}>
            🎯 客户开发
          </button>
        </div>

        {/* Tab: 批量录入 */}
        {activeTab === "bulk" && (
          <div>
            <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-base font-semibold text-slate-900">批量录入产品</h2>
              <p className="mb-3 text-xs text-slate-400">
                粘贴 JSON 数组，使用以下格式（注意 supplier_slug 需要对应已有的供应商 slug）：
              </p>
              <pre className="mb-4 overflow-x-auto rounded bg-slate-50 p-3 text-xs text-slate-500">
{`[
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
]`}
              </pre>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='粘贴 JSON 数组...'
                rows={10}
                className="mb-3 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleBulkSubmit}
                disabled={bulkLoading || !jsonInput.trim()}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {bulkLoading ? "提交中..." : "🚀 批量导入"}
              </button>
              {bulkError && <p className="mt-2 text-xs text-red-500">{bulkError}</p>}
            </div>

            {/* 结果 */}
            {bulkResults.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  导入结果 — ✅ {stats.ok} 成功 / ⏭️ {stats.skipped} 跳过 / ❌ {stats.error} 失败
                </h3>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-2 pr-4">SKU</th>
                        <th className="pb-2 pr-4">状态</th>
                        <th className="pb-2">说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkResults.map((r) => (
                        <tr key={r.sku} className="border-b border-slate-50">
                          <td className="py-1.5 pr-4 font-mono text-slate-700">{r.sku}</td>
                          <td className="py-1.5 pr-4">
                            <span className={`font-medium ${
                              r.status === "ok" ? "text-green-600" :
                              r.status === "skipped" ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {r.status === "ok" ? "✅ 成功" : r.status === "skipped" ? "⏭️ 跳过" : "❌ 失败"}
                            </span>
                          </td>
                          <td className="py-1.5 text-slate-400">{r.message || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: 供应商 */}
        {activeTab === "suppliers" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* 已有供应商 */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                现有供应商 ({suppliers.length})
              </h2>
              {suppliers.length === 0 ? (
                <p className="text-xs text-slate-400">暂无供应商</p>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                  {suppliers.map((s: any) => (
                    <div key={s.id} className="group relative rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-400">
                            slug: <code className="font-mono">{s.slug}</code>
                            {s.country && ` | 📍 ${s.country}`}
                          </p>
                          {s.certifications && s.certifications.length > 0 && (
                            <p className="mt-1 text-xs text-slate-400">
                              ✅ {Array.isArray(s.certifications) ? s.certifications.join(", ") : s.certifications}
                            </p>
                          )}
                          {s.production_capacity && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              🏭 {s.production_capacity}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditSupplier(s)}
                            className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 hover:bg-blue-100"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(s.id)}
                            className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-500 hover:bg-red-100"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 新增 / 编辑供应商 */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                {editingSupplier ? `编辑: ${editingSupplier.name}` : "新增供应商"}
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">名称 *</label>
                  <input
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Shenzhen Tech Components Ltd."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Slug *（URL 用，小写+连字符）</label>
                  <input
                    value={newSupplier.slug}
                    onChange={(e) => setNewSupplier({ ...newSupplier, slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="shenzhen-tech"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">国家</label>
                  <input
                    value={newSupplier.country}
                    onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="China"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">认证（逗号分隔）</label>
                  <input
                    value={newSupplier.certifications}
                    onChange={(e) => setNewSupplier({ ...newSupplier, certifications: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="ISO 9001, CE, RoHS"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">产能描述</label>
                  <input
                    value={newSupplier.production_capacity}
                    onChange={(e) => setNewSupplier({ ...newSupplier, production_capacity: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="100,000 pcs/month"
                  />
                </div>
                <div className="flex gap-2">
                  {editingSupplier && (
                    <button
                      onClick={() => {
                        setEditingSupplier(null);
                        setNewSupplier({ name: "", slug: "", country: "", certifications: "", production_capacity: "" });
                        setSupplierMsg("");
                      }}
                      className="flex-1 rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      取消
                    </button>
                  )}
                  <button
                    onClick={handleAddSupplier}
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {editingSupplier ? "💾 保存修改" : "➕ 添加供应商"}
                  </button>
                </div>
                {supplierMsg && (
                  <p className={`text-xs ${supplierMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
                    {supplierMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: 询盘管理 */}
        {activeTab === "inquiries" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <select
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="new">📩 新询盘</option>
                <option value="contacted">📞 已联系</option>
                <option value="closed">✅ 已关闭</option>
                <option value="all">📋 全部</option>
              </select>
              <button
                onClick={() => loadInquiries(inquiryFilter)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {inquiriesLoading ? "加载中..." : "🔍 查询"}
              </button>
              <span className="text-xs text-slate-400">
                {allInquiries.length > 0 && `${allInquiries.length} 条询盘`}
              </span>
            </div>

            {allInquiries.length > 0 && (
              <div className="max-h-[800px] overflow-y-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2">时间</th>
                      <th className="px-3 py-2">姓名</th>
                      <th className="px-3 py-2">邮箱</th>
                      <th className="px-3 py-2">国家</th>
                      <th className="px-3 py-2">产品</th>
                      <th className="px-3 py-2">数量</th>
                      <th className="px-3 py-2">备注</th>
                      <th className="px-3 py-2">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInquiries.map((inq: any) => (
                      <tr key={inq.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                          {new Date(inq.created_at).toLocaleString("zh-CN", {
                            month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-900">{inq.buyer_name}</td>
                        <td className="px-3 py-2 text-blue-600">{inq.buyer_email}</td>
                        <td className="px-3 py-2 text-slate-500">{inq.buyer_country || "—"}</td>
                        <td className="px-3 py-2 text-slate-500">{inq.products?.name_en || "加速服务"}</td>
                        <td className="px-3 py-2 text-slate-500">{inq.quantity || "—"}</td>
                        <td className="max-w-[200px] truncate px-3 py-2 text-slate-400" title={inq.message}>
                          {inq.message || "—"}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            inq.status === "new" ? "bg-blue-100 text-blue-700" :
                            inq.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {inq.status === "new" ? "新询盘" :
                             inq.status === "contacted" ? "已联系" : "已关闭"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!inquiriesLoading && allInquiries.length === 0 && (
              <div className="flex flex-col items-center py-20 text-slate-400">
                <div className="mb-3 text-4xl">📩</div>
                <p className="text-sm">暂无询盘记录</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: 产品列表 */}
        {activeTab === "products" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">全部供应商</option>
                {suppliers.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={() => loadProducts(filterSupplier || undefined)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {productsLoading ? "加载中..." : "📋 查询"}
              </button>
              <span className="text-xs text-slate-400">
                {allProducts.length > 0 && `${allProducts.length} 个产品`}
              </span>
            </div>

            {allProducts.length > 0 && (
              <div className="max-h-[600px] overflow-y-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2">SKU</th>
                      <th className="px-3 py-2">名称</th>
                      <th className="px-3 py-2">供应商</th>
                      <th className="px-3 py-2">分类</th>
                      <th className="px-3 py-2 text-right">单价</th>
                      <th className="px-3 py-2 text-right">MOQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((p: any) => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono text-slate-700">{p.sku}</td>
                        <td className="px-3 py-2 text-slate-900">{p.name_en}</td>
                        <td className="px-3 py-2 text-slate-400">{p.suppliers?.name || p.supplier_id?.slice(0,8)}</td>
                        <td className="px-3 py-2 text-slate-400">{p.category}</td>
                        <td className="px-3 py-2 text-right text-slate-700">${p.base_price}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{p.moq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!productsLoading && allProducts.length === 0 && (
              <div className="flex flex-col items-center py-20 text-slate-400">
                <div className="mb-3 text-4xl">📦</div>
                <p className="text-sm">点击"查询"加载产品列表</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "targets" && <TargetsPage />}
        {activeTab === "products-manager" && <ProductsManager suppliers={suppliers} />}
      </main>
    </div>
  );
}
