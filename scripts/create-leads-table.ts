// 通过 Supabase Management API 创建 leads 表
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";

async function main() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // 尝试 Management API
  const mgmtRes = await fetch(
    "https://api.supabase.com/v1/projects/qktaaivkcrxriaoaqsnz/sql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceKey,
      },
      body: JSON.stringify({
        query: `
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  source TEXT,
  industry TEXT,
  website TEXT,
  social_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','replied','meeting','closed_won','closed_lost')),
  notes TEXT,
  next_action TEXT,
  next_action_date DATE,
  email_count INTEGER DEFAULT 0,
  last_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
        `,
      }),
    }
  );
  console.log("Management API:", mgmtRes.status, await mgmtRes.text());

  // 验证
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from("leads").select("id").limit(1);
  console.log("Verify leads table:", error ? "❌ " + error.message : "✅ OK");
}

main().catch(console.error);
