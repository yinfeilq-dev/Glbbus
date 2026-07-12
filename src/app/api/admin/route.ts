/**
 * 管理后台 — API 路由
 * POST /api/admin/products/bulk — 批量录入产品
 * POST /api/admin/suppliers — 新增供应商
 * GET /api/admin/suppliers — 获取供应商列表
 */

import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ===== 批量录入产品 =====
export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { action } = body;

  if (action === "bulk-products") {
    const { products } = body;
    if (!Array.isArray(products) || products.length === 0) {
      return Response.json({ error: "products must be a non-empty array" }, { status: 400 });
    }

    const results: { sku: string; status: "ok" | "skipped" | "error"; message?: string }[] = [];

    for (const p of products) {
      // 检查 SKU 是否已存在
      const { data: existing } = await supabase
        .from("products")
        .select("sku")
        .eq("sku", p.sku)
        .maybeSingle();

      if (existing) {
        results.push({ sku: p.sku, status: "skipped", message: "SKU already exists" });
        continue;
      }

      // 检查 supplier_id 是否存在
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("slug", p.supplier_slug)
        .maybeSingle();

      if (!supplier) {
        results.push({ sku: p.sku, status: "error", message: `Supplier "${p.supplier_slug}" not found` });
        continue;
      }

      const { error } = await supabase.from("products").insert({
        supplier_id: supplier.id,
        sku: p.sku,
        name_en: p.name_en,
        name_zh: p.name_zh || null,
        description: p.description || { en: "", zh: "", ru: "", es: "", ar: "" },
        specifications: p.specifications || {},
        base_price: p.base_price || null,
        category: p.category || null,
        images: p.images || [],
        certifications: p.certifications || [],
        moq: p.moq || null,
        lead_time_days: p.lead_time_days || null,
        fob_port: p.fob_port || null,
        is_published: p.is_published !== false,
      });

      if (error) {
        results.push({ sku: p.sku, status: "error", message: error.message });
      } else {
        results.push({ sku: p.sku, status: "ok" });
      }
    }

    return Response.json({ results });
  }

  if (action === "add-supplier") {
    const { name, slug, country, certifications, production_capacity } = body;
    if (!name || !slug) {
      return Response.json({ error: "name and slug are required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("suppliers").insert({
      name,
      slug,
      country: country || null,
      certifications: certifications || [],
      production_capacity: production_capacity || null,
    }).select().single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ supplier: data });
  }

  return Response.json({ error: "unknown action" }, { status: 400 });
}

// ===== 获取供应商列表 =====
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "suppliers") {
    const { data: suppliers, error } = await supabase
      .from("suppliers")
      .select("id, name, slug, country, certifications, production_capacity")
      .order("name");

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ suppliers });
  }

  if (action === "products") {
    const supplierSlug = url.searchParams.get("supplier");
    let query = supabase.from("products")
      .select("*, suppliers(name, slug)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(200);

    if (supplierSlug) {
      // Get supplier id first
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("slug", supplierSlug)
        .maybeSingle();
      if (supplier) {
        query = query.eq("supplier_id", supplier.id);
      }
    }

    const { data: products, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ products });
  }

  if (action === "inquiries") {
    const status = url.searchParams.get("status");
    let query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: inquiries, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ inquiries });
  }

  return Response.json({ error: "unknown action" }, { status: 400 });
}
