import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.from("leads").select("id").limit(1);
  console.log("leads table:", error ? "❌ " + error.message : "✅ OK");

  if (!error) {
    const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
    console.log("Current leads count:", count);
    console.log("Table structure ready ✅");
  }
}

main().catch(console.error);
