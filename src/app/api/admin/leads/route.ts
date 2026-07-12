import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "leads") {
    const status = url.searchParams.get("status");
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}

export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();
  const action = body.action;

  if (action === "add-lead") {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        company_name: body.company_name,
        contact_name: body.contact_name || null,
        email: body.email || null,
        phone: body.phone || null,
        country: body.country || null,
        source: body.source || null,
        industry: body.industry || null,
        website: body.website || null,
        social_url: body.social_url || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === "update-lead") {
    const { data, error } = await supabase
      .from("leads")
      .update({
        contact_name: body.contact_name,
        email: body.email,
        phone: body.phone,
        country: body.country,
        source: body.source,
        status: body.status,
        notes: body.notes,
        next_action: body.next_action,
        next_action_date: body.next_action_date,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === "increment-email") {
    // First get current email_count
    const { data: current, error: fetchError } = await supabase
      .from("leads")
      .select("email_count")
      .eq("id", body.id)
      .single();

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

    const newCount = (current?.email_count || 0) + 1;

    const { data, error } = await supabase
      .from("leads")
      .update({
        email_count: newCount,
        last_email_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === "delete-lead") {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
