"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  source: string | null;
  industry: string | null;
  website: string | null;
  social_url: string | null;
  status: string;
  notes: string | null;
  next_action: string | null;
  next_action_date: string | null;
  email_count: number;
  last_email_at: string | null;
  created_at: string;
};

type GeneratedTarget = {
  company_name: string;
  industry: string;
  country: string;
  source: "AI Generated";
  notes: string;
};

const STATUS_OPTIONS = ["new", "contacted", "replied", "meeting", "closed_won", "closed_lost"];
const SOURCE_OPTIONS = ["Google", "LinkedIn", "Alibaba", "TradeShow", "Referral", "Manual", "Other"];

const LINKEDIN_MESSAGE_TEMPLATE = `Hi {contact_name},

I came across {company_name} and noticed your work in the {industry} space.

We're GlbBus (www.koudingcloud.com), an AI-driven B2B platform for industrial products — aluminum profiles, fasteners, electrical components, and CNC/machining parts.

Would love to connect and explore potential synergies.

Best,
Yin
GlbBus`;

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  en_intro: {
    subject: "Partnership Opportunity with GlbBus — Quality Industrial Products",
    body: `Hi {contact_name},

I came across {company_name} and noticed your business in the {industry} space.

We're GlbBus (www.koudingcloud.com), an AI-driven B2B platform connecting global buyers with verified industrial manufacturers. Our suppliers cover:
• Aluminum profiles & extrusions
• Fasteners, bolts, and hardware
• Electrical components
• Custom CNC/machining parts

If you're sourcing any of these products, I'd love to connect and see how we can support your supply chain.

Best regards,
Yin
GlbBus | sales@koudingcloud.com
WhatsApp: +86 136 5194 5808`,
  },
  zh_intro: {
    subject: "GlbBus 合作邀请 — 优质工业品直供",
    body: `{contact_name} 您好，

我在搜索{industry}行业时关注到{company_name}。

我们是 GlbBus（www.koudingcloud.com），AI驱动的工业品B2B跨境平台，与认证制造商联营，产品涵盖：
• 铝合金型材/挤压件
• 紧固件/螺栓/五金件
• 电气元器件
• 定制CNC/机加工件

如果您正在采购以上品类，很希望能与您沟通合作机会。

此致
尹
GlbBus | sales@koudingcloud.com
WhatsApp: +86 136 5194 5808`,
  },
  ru_intro: {
    subject: "Партнерство с GlbBus — качественная промышленная продукция",
    body: `Здравствуйте, {contact_name}!

Я вышел на {company_name} и заметил ваш бизнес в сфере {industry}.

Мы GlbBus (www.koudingcloud.com) — AI-платформа B2B, соединяющая покупателей с проверенными производителями.

Если вы заинтересованы в закупке промышленной продукции, буду рад обсудить сотрудничество.

С уважением,
Yin
GlbBus | sales@koudingcloud.com
WhatsApp: +86 136 5194 5808`,
  },
  es_intro: {
    subject: "Oportunidad de Asociación con GlbBus — Productos Industriales",
    body: `Hola {contact_name},

Encontré a {company_name} y noté su negocio en el sector de {industry}.

Somos GlbBus (www.koudingcloud.com), una plataforma B2B impulsada por IA.

Si está interesado en abastecerse de productos industriales, me encantaría conectar.

Saludos,
Yin
GlbBus | sales@koudingcloud.com
WhatsApp: +86 136 5194 5808`,
  },
};

export default function TargetsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [showTemplate, setShowTemplate] = useState<{ lead: Lead; lang: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    country: "",
    source: "Manual",
    industry: "",
    website: "",
    social_url: "",
    notes: "",
  });

  // ===== AI Generation State =====
  const [aiIndustry, setAiIndustry] = useState("");
  const [aiCountry, setAiCountry] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTargets, setAiTargets] = useState<GeneratedTarget[]>([]);
  const [addingTarget, setAddingTarget] = useState<string | null>(null);

  // ===== Lead Detail Modal State =====
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?action=leads&status=${filter}`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add-lead", ...form }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ company_name: "", contact_name: "", email: "", phone: "", country: "", source: "Manual", industry: "", website: "", social_url: "", notes: "" });
      fetchLeads();
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Lead>) => {
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-lead", id, ...updates }),
    });
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此线索？")) return;
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-lead", id }),
    });
    fetchLeads();
  };

  const countByStatus = (s: string) => leads.filter((l) => l.status === s).length;

  // ===== AI Generate Targets =====
  const handleAiGenerate = async () => {
    if (!aiIndustry.trim() || !aiCountry.trim()) return;
    setAiLoading(true);
    setAiTargets([]);
    try {
      const res = await fetch("/api/admin/generate-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: aiIndustry.trim(), country: aiCountry.trim() }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setAiTargets(data.targets || []);
    } catch (err) {
      console.error(err);
      alert("生成失败，请重试");
    }
    setAiLoading(false);
  };

  // ===== Add AI Target as Lead =====
  const handleAddAiTarget = async (target: GeneratedTarget) => {
    setAddingTarget(target.company_name);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-lead",
          company_name: target.company_name,
          industry: target.industry,
          country: target.country,
          source: "AI Generated",
          notes: target.notes,
        }),
      });
      if (res.ok) {
        fetchLeads();
        setAiTargets((prev) => prev.filter((t) => t.company_name !== target.company_name));
      }
    } catch (err) {
      console.error(err);
    }
    setAddingTarget(null);
  };

  // ===== Increment Email Count =====
  const handleIncrementEmail = async (leadId: string) => {
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increment-email", id: leadId }),
    });
    fetchLeads();
  };

  // ===== Render Template helper =====
  const renderTemplate = (lead: Lead, lang: string) => {
    const tmpl = EMAIL_TEMPLATES[`${lang}_intro`];
    if (!tmpl) return null;
    const fill = (text: string) =>
      text
        .replace(/\{contact_name\}/g, lead.contact_name || "Team at " + lead.company_name)
        .replace(/\{company_name\}/g, lead.company_name)
        .replace(/\{industry\}/g, lead.industry || "industrial products");

    return {
      subject: fill(tmpl.subject),
      body: fill(tmpl.body),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">客户开发</h1>
          <p className="mt-1 text-sm text-slate-500">管理目标客户线索、生成开发信</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + 添加线索
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        {STATUS_OPTIONS.map((s) => (
          <div key={s} className="rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-lg font-bold text-slate-900">{countByStatus(s)}</div>
            <div className="text-[10px] text-slate-400">{s}</div>
          </div>
        ))}
      </div>

      {/* ===== 2a. AI Generate Targets Input ===== */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-blue-800">🤖 AI 生成目标客户</h3>
        <div className="flex flex-wrap gap-3">
          <input
            value={aiIndustry}
            onChange={(e) => setAiIndustry(e.target.value)}
            placeholder="行业 (e.g. aluminum profiles)"
            className="flex-1 min-w-[200px] rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            value={aiCountry}
            onChange={(e) => setAiCountry(e.target.value)}
            placeholder="国家 (e.g. Germany)"
            className="flex-1 min-w-[150px] rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button
            onClick={handleAiGenerate}
            disabled={aiLoading || !aiIndustry.trim() || !aiCountry.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中...
              </span>
            ) : (
              "AI 生成"
            )}
          </button>
        </div>

        {/* AI Generated Results */}
        {aiTargets.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-blue-700">
              生成 {aiTargets.length} 个目标客户：
            </p>
            {aiTargets.map((target) => (
              <div
                key={target.company_name}
                className="flex items-center justify-between rounded-lg border border-blue-100 bg-white px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{target.company_name}</p>
                  <p className="text-xs text-slate-500 truncate">{target.notes}</p>
                  <p className="text-xs text-slate-400">
                    {target.industry} · {target.country}
                  </p>
                </div>
                <button
                  onClick={() => handleAddAiTarget(target)}
                  disabled={addingTarget === target.company_name}
                  className="ml-3 shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {addingTarget === target.company_name ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      添加中
                    </span>
                  ) : (
                    "+ 添加为线索"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              filter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s} <span className="text-[10px]">({countByStatus(s)})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-slate-400">加载中...</p>
      ) : leads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
          还没有线索。点击"+ 添加线索"开始。
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-3 py-2">公司</th>
                <th className="px-3 py-2">联系人</th>
                <th className="px-3 py-2">邮箱</th>
                <th className="px-3 py-2">国家</th>
                <th className="px-3 py-2">来源</th>
                <th className="px-3 py-2">行业</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">已发</th>
                <th className="px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  {/* 2c. Company name clickable → detail popup */}
                  <td className="px-3 py-2 font-medium text-slate-900">
                    <button
                      onClick={() => setDetailLead(lead)}
                      className="hover:text-blue-600 text-left"
                    >
                      {lead.company_name}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{lead.contact_name || "-"}</td>
                  <td className="px-3 py-2">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                    ) : "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{lead.country || "-"}</td>
                  <td className="px-3 py-2 text-slate-600">{lead.source || "-"}</td>
                  <td className="px-3 py-2 text-slate-600">{lead.industry || "-"}</td>
                  <td className="px-3 py-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdate(lead.id, { status: e.target.value })}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">{lead.email_count}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const query = encodeURIComponent(`${lead.company_name} ${lead.industry || ""} ${lead.country || ""}`);
                          window.open(`https://www.linkedin.com/search/results/companies/?keywords=${query}`, '_blank');
                        }}
                        className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-600 hover:bg-indigo-100"
                        title="在 LinkedIn 上搜索该公司"
                      >
                        💼
                      </button>
                      <button
                        onClick={() => setShowTemplate({ lead, lang: "en" })}
                        className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 hover:bg-blue-100"
                        title="生成开发信"
                      >
                        ✉️
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
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

      {/* Add Lead Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900">添加新线索</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500">公司名 *</label>
                  <input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">联系人</label>
                  <input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">邮箱</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">电话</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">国家</label>
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">来源</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                    {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">行业</label>
                  <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="e.g. aluminum profiles"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">网站</label>
                  <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500">Social URL</label>
                <input value={form.social_url} onChange={(e) => setForm({ ...form, social_url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500">备注</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">取消</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Template Modal */}
      {showTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">开发信模板</h2>
                <p className="text-xs text-slate-400">
                  {showTemplate.lead.contact_name || showTemplate.lead.company_name} · {showTemplate.lang.toUpperCase()}
                </p>
              </div>
              <div className="flex gap-1">
                {["en", "zh", "ru", "es"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setShowTemplate({ ...showTemplate, lang })}
                    className={`rounded px-2 py-0.5 text-xs ${
                      showTemplate.lang === lang ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const lang = showTemplate.lang;
              const lead = showTemplate.lead;
              const filled = renderTemplate(lead, lang);
              if (!filled) return <p className="text-sm text-slate-400">模板不可用</p>;

              return (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Subject</label>
                    <input readOnly value={filled.subject}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Body</label>
                    <textarea readOnly value={filled.body}
                      rows={14}
                      className="mt-1 w-full whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(`Subject: ${filled.subject}\n\n${filled.body}`);
                        // 2b. increment email_count on copy
                        await handleIncrementEmail(lead.id);
                        alert("已复制到剪贴板！email_count 已更新");
                      }}
                      className="rounded-lg border border-blue-200 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      📋 复制到剪贴板
                    </button>
                    <button
                      onClick={async () => {
                        if (lead.email) {
                          window.open(`mailto:${lead.email}?subject=${encodeURIComponent(filled.subject)}&body=${encodeURIComponent(filled.body)}`);
                          // 2b. increment email_count on mail open
                          await handleIncrementEmail(lead.id);
                          alert("邮箱已打开！email_count 已更新");
                        } else {
                          alert("此线索没有邮箱地址");
                        }
                      }}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      🚀 在邮箱中打开
                    </button>
                    <button onClick={() => setShowTemplate(null)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">关闭</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== 2c. Lead Detail Modal ===== */}
      {detailLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setDetailLead(null)}>
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">线索详情</h2>
              <button
                onClick={() => setDetailLead(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <DetailRow label="公司名" value={detailLead.company_name} />
              <DetailRow label="联系人" value={detailLead.contact_name} />
              <DetailRow label="邮箱" value={detailLead.email} link={`mailto:${detailLead.email}`} />
              <DetailRow label="电话" value={detailLead.phone} />
              <DetailRow label="国家" value={detailLead.country} />
              <DetailRow label="来源" value={detailLead.source} />
              <DetailRow label="行业" value={detailLead.industry} />
              <DetailRow label="网站" value={detailLead.website} link={detailLead.website} />
              <DetailRow label="Social URL" value={detailLead.social_url} link={detailLead.social_url} />
              <DetailRow label="状态" value={detailLead.status} />
              <DetailRow label="已发邮件数" value={String(detailLead.email_count)} />
              <DetailRow label="上次邮件时间" value={detailLead.last_email_at ? new Date(detailLead.last_email_at).toLocaleString("zh-CN") : "从未"} />
              <DetailRow label="创建时间" value={new Date(detailLead.created_at).toLocaleString("zh-CN")} />
              <DetailRow label="备注" value={detailLead.notes} />
              <DetailRow label="下一步行动" value={detailLead.next_action} />
              <DetailRow label="下次行动日期" value={detailLead.next_action_date} />
            </div>

            {/* LinkedIn 操作区 */}
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-indigo-700">💼 LinkedIn 触达</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const query = encodeURIComponent(`${detailLead.company_name} ${detailLead.industry || ""} ${detailLead.country || ""}`);
                    window.open(`https://www.linkedin.com/search/results/companies/?keywords=${query}`, '_blank');
                  }}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  🔍 搜索公司
                </button>
                <button
                  onClick={() => {
                    const name = detailLead.contact_name || detailLead.company_name;
                    window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name + " " + (detailLead.industry || ""))}`, '_blank');
                  }}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  👤 搜索联系人
                </button>
                <button
                  onClick={async () => {
                    const lead = detailLead;
                    const msg = LINKEDIN_MESSAGE_TEMPLATE
                      .replace(/{contact_name}/g, lead.contact_name || "Team at " + lead.company_name)
                      .replace(/{company_name}/g, lead.company_name)
                      .replace(/{industry}/g, lead.industry || "industrial products");
                    await navigator.clipboard.writeText(msg);
                    alert("LinkedIn InMail 模板已复制到剪贴板！\n\n去 LinkedIn 发送连接请求或 InMail 时粘贴即可。");
                  }}
                  className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
                >
                  📋 复制 InMail 模板
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTemplate({ lead: detailLead, lang: "en" });
                  setDetailLead(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                ✉️ 生成开发信
              </button>
              <button
                onClick={() => setDetailLead(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Inline detail row for the popup */
function DetailRow({
  label,
  value,
  link,
}: {
  label: string;
  value: string | null;
  link?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="min-w-[100px] text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900 break-all">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </span>
    </div>
  );
}
