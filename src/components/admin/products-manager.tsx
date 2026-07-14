"use client";

import { useState, useEffect, useCallback } from "react";

type Product = {
  id: string;
  sku: string;
  name_en: string;
  name_zh: string | null;
  category: string | null;
  base_price: number | null;
  moq: number | null;
  lead_time_days: number | null;
  fob_port: string | null;
  is_published: boolean;
  created_at: string;
  suppliers: { name: string; slug: string } | null;
};

type Supplier = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
};

const EMPTY_FORM = {
  sku: "",
  supplier_id: "",
  name_en: "",
  name_zh: "",
  category: "",
  base_price: "",
  moq: "",
  lead_time_days: "",
  fob_port: "",
  certifications: "",
  description_en: "",
  description_zh: "",
  specifications_json: "{}",
  is_published: true,
};

const DEFAULT_CATEGORIES = [
  "Metal 3D Printer",
  "Aluminum Profiles & Extrusions",
  "Fasteners & Hardware",
  "Electrical Components",
  "CNC Machining Parts",
  "Pipe Fittings & Flanges",
  "Motors & Drives",
  "Pneumatic Components",
  "Seals & Gaskets",
  "Hydraulic Parts",
  "Industrial Machinery",
  "Other",
];

export default function ProductsManager({ suppliers }: { suppliers: Supplier[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formMsg, setFormMsg] = useState("");
  const [dupCheck, setDupCheck] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ action: "products" });
      if (filter) params.set("supplier", filter);
      const res = await fetch(`/api/admin?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {}
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setFormMsg("");
    setDupCheck(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg("");

    if (!form.sku || !form.supplier_id || !form.name_en) {
      setFormMsg("请填写 SKU、供应商和英文名称");
      return;
    }

    // Parse specifications
    let specs = {};
    try {
      if (form.specifications_json && form.specifications_json !== "{}") {
        specs = JSON.parse(form.specifications_json);
      }
    } catch {
      setFormMsg("规格参数 JSON 格式错误");
      return;
    }

    const certs = form.certifications
      ? form.certifications.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    // Build description JSON
    const desc: Record<string, string> = {};
    if (form.description_en) desc.en = form.description_en;
    if (form.description_zh) desc.zh = form.description_zh;

    const body: Record<string, unknown> = {
      action: editProduct ? "update-product" : "add-product",
      sku: form.sku,
      supplier_id: form.supplier_id,
      name_en: form.name_en,
      name_zh: form.name_zh || null,
      category: form.category || null,
      base_price: form.base_price ? Number(form.base_price) : null,
      moq: form.moq ? Number(form.moq) : null,
      lead_time_days: form.lead_time_days ? Number(form.lead_time_days) : null,
      fob_port: form.fob_port || null,
      certifications: certs,
      is_published: form.is_published,
      description: Object.keys(desc).length > 0 ? desc : null,
    };

    // Add specifications if provided
    if (Object.keys(specs).length > 0) body.specifications = specs;

    // Only add id for update
    if (editProduct) body.id = editProduct.id;

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        setFormMsg("❌ " + data.error);
        if (data.error.includes("duplicate") || data.error.includes("already exists")) {
          setDupCheck(true);
        }
      } else {
        const name = data.product?.name_en || data.product?.name_zh || "";
        setFormMsg(`✅ ${editProduct ? "更新" : "添加"}产品 ${name} (${form.sku}) 成功`);
        resetForm();
        loadProducts();
        setShowAdd(false);
        setEditProduct(null);
      }
    } catch {
      setFormMsg("❌ 提交失败");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-product", id, is_published: !current }),
    });
    if (res.ok) loadProducts();
  };

  const handleEditProduct = async (product: Product) => {
    // Fetch full product details from API
    try {
      const res = await fetch(`/api/admin?action=product&sku=${product.sku}`);
      const data = await res.json();
      const p = data.product;

      setForm({
        sku: p.sku || "",
        supplier_id: p.supplier_id || "",
        name_en: p.name_en || "",
        name_zh: p.name_zh || "",
        category: p.category || "",
        base_price: p.base_price != null ? String(p.base_price) : "",
        moq: p.moq != null ? String(p.moq) : "",
        lead_time_days: p.lead_time_days != null ? String(p.lead_time_days) : "",
        fob_port: p.fob_port || "",
        certifications: Array.isArray(p.certifications) ? p.certifications.join(", ") : "",
        description_en: p.description?.en || "",
        description_zh: p.description?.zh || "",
        specifications_json: p.specifications && Object.keys(p.specifications).length > 0
          ? JSON.stringify(p.specifications, null, 2)
          : "{}",
        is_published: p.is_published ?? true,
      });
      setEditProduct(product);
    } catch (err) {
      alert("加载产品详情失败");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此产品？此操作不可撤销。")) return;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-product", id }),
    });
    if (res.ok) loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">产品管理</h1>
          <p className="mt-1 text-sm text-slate-500">管理所有供应商的产品，添加/编辑产品信息</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAdd(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + 添加产品
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500">按供应商筛选：</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
        >
          <option value="">全部供应商</option>
          {suppliers.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={() => loadProducts()}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {loading ? "加载中..." : "📋 查询"}
        </button>
        <span className="text-xs text-slate-400">{products.length > 0 && `${products.length} 个产品`}</span>
      </div>

      {/* Add / Edit Product Modal */}
      {(showAdd || editProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              {editProduct ? `编辑产品: ${editProduct.sku}` : "添加新产品"}
            </h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">SKU *</label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. DW-UHP-120M"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">供应商 *</label>
                  <select
                    required
                    value={form.supplier_id}
                    onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="">选择供应商</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Name EN */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">英文名称 *</label>
                  <input
                    required
                    value={form.name_en}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    placeholder="DW-UHP-120M Ultra High Precision Printer"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Name ZH */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">中文名称</label>
                  <input
                    value={form.name_zh}
                    onChange={(e) => setForm({ ...form, name_zh: e.target.value })}
                    placeholder="DW-UHP-120M 超高精度金属3D打印机"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="">选择分类</option>
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">单价 (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.base_price}
                    onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                    placeholder="e.g. 150000.00"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* MOQ */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">MOQ</label>
                  <input
                    type="number"
                    value={form.moq}
                    onChange={(e) => setForm({ ...form, moq: e.target.value })}
                    placeholder="1"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Lead Time */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">交期 (天)</label>
                  <input
                    type="number"
                    value={form.lead_time_days}
                    onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })}
                    placeholder="30"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* FOB Port */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">FOB 港口</label>
                  <input
                    value={form.fob_port}
                    onChange={(e) => setForm({ ...form, fob_port: e.target.value })}
                    placeholder="Shanghai"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">认证 (逗号分隔)</label>
                  <input
                    value={form.certifications}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                    placeholder="CE, ISO 9001, RoHS"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-xs font-medium text-slate-500">英文描述</label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  rows={3}
                  placeholder="Product description in English..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              {/* Description ZH */}
              <div>
                <label className="block text-xs font-medium text-slate-500">中文描述</label>
                <textarea
                  value={form.description_zh}
                  onChange={(e) => setForm({ ...form, description_zh: e.target.value })}
                  rows={3}
                  placeholder="产品中文描述..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              {/* Specifications JSON */}
              <div>
                <label className="block text-xs font-medium text-slate-500">规格参数 (JSON)</label>
                <textarea
                  value={form.specifications_json}
                  onChange={(e) => setForm({ ...form, specifications_json: e.target.value })}
                  rows={4}
                  placeholder={`{\n  "Build_Volume": "Ф120×180mm",\n  "Layer_Thickness": "5-20μm",\n  "Laser_Power": "100W"\n}`}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-blue-400"
                />
                <p className="mt-1 text-[10px] text-slate-400">JSON 对象格式，key 用英文，value 用数字或英文描述</p>
              </div>

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="is_published" className="text-sm text-slate-600">发布（前台可见）</label>
              </div>

              {formMsg && (
                <p className={`text-sm ${formMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
                  {formMsg}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setEditProduct(null); }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editProduct ? "保存修改" : "添加产品"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <p className="text-sm text-slate-400">加载中...</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
          还没有产品。点击"+ 添加产品"开始录入。
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">英文名称</th>
                <th className="px-3 py-2">中文名称</th>
                <th className="px-3 py-2">供应商</th>
                <th className="px-3 py-2">分类</th>
                <th className="px-3 py-2 text-right">单价</th>
                <th className="px-3 py-2 text-right">MOQ</th>
                <th className="px-3 py-2 text-center">发布</th>
                <th className="px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-slate-700">{p.sku}</td>
                  <td className="px-3 py-2 text-slate-900 max-w-[200px] truncate">{p.name_en}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-[150px] truncate">{p.name_zh || "—"}</td>
                  <td className="px-3 py-2 text-slate-400">{p.suppliers?.name || "—"}</td>
                  <td className="px-3 py-2 text-slate-400">{p.category || "—"}</td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    {p.base_price != null ? `$${Number(p.base_price).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-400">{p.moq || "—"}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleTogglePublish(p.id, p.is_published)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        p.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {p.is_published ? "✅" : "🔴"}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 hover:bg-blue-100"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-500 hover:bg-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
