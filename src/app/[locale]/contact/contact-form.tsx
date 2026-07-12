/**
 * 联系表单客户端组件
 * 独立放入客户端 bundle，避免整个联系页成为 client component
 */
"use client";

import { useState } from "react";

type Props = {
  contact: Record<string, string>;
  locale: string;
};

export default function ContactForm({ contact, locale }: Props) {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isRtl = locale === "ar";
  const dirAttr = isRtl ? "right" as const : "left" as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: "",
          contact_name: name,
          email: email,
          message: message,
          locale: locale,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setFormState("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setFormState("error");
    }
  };

  if (formState === "sent") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-sm font-medium text-green-700">
          {contact?.form_success ?? "Message sent! We will get back to you soon."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          {contact?.form_name ?? "Your Name"} *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir={dirAttr}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          {contact?.form_email ?? "Email"} *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir={dirAttr}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          {contact?.form_message ?? "Message"} *
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir={dirAttr}
        />
      </div>
      <button
        type="submit"
        disabled={formState === "sending"}
        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {formState === "sending"
          ? "Sending..."
          : (contact?.form_submit ?? "Send Message")}
      </button>
      {formState === "error" && (
        <p className="text-xs text-red-500">
          Failed to send. Please try again.
        </p>
      )}
    </form>
  );
}
