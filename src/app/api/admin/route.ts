/**
 * Admin API — 供应商 & 产品管理
 * GET  /api/admin?action=suppliers | products&supplier=slug
 * POST /api/admin - actions: add-supplier, bulk-products, add-product, toggle-product, delete-product
 */

import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "suppliers") {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ suppliers: data });
  }

  if (action === "products") {
    const supplierSlug = url.searchParams.get("supplier");
    let query = supabase
      .from("products")
      .select(`*, suppliers (name, slug)`)
      .order("created_at", { ascending: false })
      .limit(200);

    if (supplierSlug) {
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("slug", supplierSlug)
        .single();
      if (supplier) {
        query = query.eq("supplier_id", supplier.id);
      }
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: data });
  }

  if (action === "product") {
    const sku = url.searchParams.get("sku");
    if (!sku) return NextResponse.json({ error: "sku required" }, { status: 400 });
    const { data, error } = await supabase
      .from("products")
      .select(`*, suppliers (name, slug)`)
      .eq("sku", sku)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data });
  }

  // GET single supplier by id for editing
  if (action === "supplier") {
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ supplier: data });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}

export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  // ===== Add Supplier =====
  if (body.action === "add-supplier") {
    const { data, error } = await supabase
      .from("suppliers")
      .insert({
        name: body.name,
        slug: body.slug,
        country: body.country || null,
        certifications: body.certifications || [],
        production_capacity: body.production_capacity || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Slug 已存在，请更换" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ supplier: data });
  }

  // ===== Bulk Import Products =====
  if (body.action === "bulk-products") {
    const results: Array<{ sku: string; status: "ok" | "skipped" | "error"; message?: string }> = [];
    const products: Array<Record<string, unknown>> = body.products;

    for (const p of products) {
      const sku = String(p.sku || "");
      const supplierSlug = String(p.supplier_slug || "");
      try {
        // Lookup supplier_id by slug
        const { data: supplier } = await supabase
          .from("suppliers")
          .select("id")
          .eq("slug", supplierSlug)
          .single();

        if (!supplier) {
          results.push({ sku, status: "error", message: `供应商 ${supplierSlug} 不存在` });
          continue;
        }

        // Check for duplicate SKU
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .single();

        if (existing) {
          results.push({ sku, status: "skipped", message: "SKU 已存在，跳过" });
          continue;
        }

        const { error } = await supabase.from("products").insert({
          supplier_id: supplier.id,
          sku: sku,
          name_en: p.name_en,
          name_zh: p.name_zh || null,
          category: p.category || null,
          specifications: (p.specifications as Record<string, string>) || {},
          base_price: (p.base_price as number) || null,
          certifications: (p.certifications as string[]) || [],
          moq: (p.moq as number) || null,
          lead_time_days: (p.lead_time_days as number) || null,
          fob_port: (p.fob_port as string) || null,
          is_published: true,
        });

        if (error) {
          results.push({ sku, status: "error", message: error.message });
        } else {
          results.push({ sku, status: "ok" });
        }
      } catch (err) {
        results.push({
          sku,
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  }

  // ===== Add Single Product =====
  if (body.action === "add-product") {
    // Build description JSON if provided
    const description: Record<string, string> = {};
    if (body.description?.en) description.en = body.description.en;
    if (body.description?.zh) description.zh = body.description.zh;
    if (body.description_en) description.en = body.description_en;
    if (body.description_zh) description.zh = body.description_zh;

    const { data, error } = await supabase
      .from("products")
      .insert({
        supplier_id: body.supplier_id,
        sku: body.sku,
        name_en: body.name_en,
        name_zh: body.name_zh || null,
        description: Object.keys(description).length > 0 ? description : null,
        specifications: body.specifications || {},
        base_price: body.base_price || null,
        category: body.category || null,
        certifications: body.certifications || [],
        moq: body.moq || null,
        lead_time_days: body.lead_time_days || null,
        fob_port: body.fob_port || null,
        is_published: body.is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: `SKU '${body.sku}' 已存在，请使用不同的 SKU` }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  }

  // ===== Update Product =====
  if (body.action === "update-product") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.supplier_id !== undefined) updateData.supplier_id = body.supplier_id;
    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.name_zh !== undefined) updateData.name_zh = body.name_zh || null;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.base_price !== undefined) updateData.base_price = body.base_price || null;
    if (body.moq !== undefined) updateData.moq = body.moq || null;
    if (body.lead_time_days !== undefined) updateData.lead_time_days = body.lead_time_days || null;
    if (body.fob_port !== undefined) updateData.fob_port = body.fob_port || null;
    if (body.certifications !== undefined) updateData.certifications = body.certifications || [];
    if (body.is_published !== undefined) updateData.is_published = body.is_published;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.specifications !== undefined) updateData.specifications = body.specifications || {};

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data });
  }

  // ===== Update Supplier =====
  if (body.action === "update-supplier") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.country !== undefined) updateData.country = body.country || null;
    if (body.certifications !== undefined) updateData.certifications = body.certifications || [];
    if (body.production_capacity !== undefined) updateData.production_capacity = body.production_capacity || null;

    const { data, error } = await supabase
      .from("suppliers")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ supplier: data });
  }

  // ===== Delete Supplier =====
  if (body.action === "delete-supplier") {
    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // ===== Toggle Publish =====
  if (body.action === "toggle-product") {
    const { error } = await supabase
      .from("products")
      .update({ is_published: body.is_published })
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // ===== Delete Product =====
  if (body.action === "delete-product") {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
