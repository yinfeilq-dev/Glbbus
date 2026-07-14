/**
 * 产品询盘表单组件（客户端交互）
 * 用户填写姓名、邮箱、数量、备注等信息提交询盘
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  locale: string;
  dict: Record<string, unknown>;
  productId: string;
  productName: string;
};

export default function InquiryForm({ locale, dict, productId, productName }: Props) {
  const router = useRouter();
  const contact = (dict.contact as Record<string, string>) ?? {};
  const common = (dict.common as Record<string, string>) ?? {};
  const productsDict = (dict.products as Record<string, string>) ?? {};

  const [form, setForm] = useState({
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    buyer_country: "",
    company_name: "",
    quantity: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buyer_name.trim() || !form.buyer_email.trim()) {
      setError(contact.form_name ? "Please fill in name and email" : "请填写姓名和邮箱");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          ...form,
          quantity: Number(form.quantity) || 1,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSuccess(true);
    } catch {
      setError(contact.form_success ? "Submit failed, please try again" : "提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-2 text-3xl">✅</div>
        <p className="text-sm font-medium text-green-800">
          {productsDict.inquiry_success || "Inquiry sent! We will get back to you within 24h."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          required
          value={form.buyer_name}
          onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
          placeholder={contact.form_name || "Your Name *"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <div>
        <input
          required
          type="email"
          value={form.buyer_email}
          onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
          placeholder={contact.form_email || "Email *"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.buyer_phone}
          onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
          placeholder={productsDict.phone || "Phone"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <input
          value={form.buyer_country}
          onChange={(e) => setForm({ ...form, buyer_country: e.target.value })}
          placeholder={productsDict.country || "Country"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          placeholder={productsDict.company || "Company"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <input
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder={productsDict.quantity || "Qty"}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <div>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={contact.form_message || "Message (optional)"}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? common.loading || "Sending..." : contact.form_submit || "Send Inquiry"}
      </button>
    </form>
  );
}
