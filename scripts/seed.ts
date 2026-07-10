// 数据初始化脚本 —— 插入供应商和示例产品
// 运行: npx tsx scripts/seed.ts

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function seed() {
  console.log("🌱 Seeding GlbBus database...\n");

  // ===== 供应商 =====
  const suppliers = [
    {
      name: "Dewu Industrial",
      slug: "dewu-industrial",
      country: "China",
      contact_email: "dewu@example.com",
      certifications: ["CE", "RoHS", "ISO 9001"],
      production_capacity: "50,000 pcs/month",
    },
    {
      name: "Waru Manufacturing",
      slug: "waru-manufacturing",
      country: "China",
      contact_email: "waru@example.com",
      certifications: ["ISO 9001", "CE"],
      production_capacity: "30,000 pcs/month",
    },
  ];

  for (const s of suppliers) {
    const { error } = await supabase.from("suppliers").upsert(s, {
      onConflict: "slug",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error(`❌ Failed to insert supplier ${s.name}:`, error.message);
    } else {
      console.log(`✅ Supplier: ${s.name}`);
    }
  }

  // 获取插入后的 supplier ID
  const { data: dewData } = await supabase
    .from("suppliers")
    .select("id")
    .eq("slug", "dewu-industrial")
    .single();
  const { data: waruData } = await supabase
    .from("suppliers")
    .select("id")
    .eq("slug", "waru-manufacturing")
    .single();

  const dewuId = dewData?.id;
  const waruId = waruData?.id;

  if (!dewuId || !waruId) {
    console.error("❌ Could not retrieve supplier IDs");
    process.exit(1);
  }

  // ===== 产品 =====
  const products = [
    {
      supplier_id: dewuId,
      sku: "DW-EXT-6063T5-001",
      name_en: "6063-T5 Aluminum Extrusion Profile",
      name_zh: "6063-T5 铝合金型材",
      description: {
        en: "High-quality 6063-T5 aluminum extrusion suitable for industrial framing and structural applications.",
        zh: "高品质6063-T5铝合金型材，适用于工业框架和结构应用。",
      },
      specifications: {
        material: "Aluminum 6063-T5",
        surface_finish: "Anodized / Powder Coated",
        length: "Custom (max 6m)",
        tolerance: "±0.1mm",
      },
      base_price: 2.45,
      category: "Aluminum Profiles",
      certifications: ["CE", "RoHS"],
      moq: 500,
      lead_time_days: 15,
      fob_port: "Shanghai / Ningbo",
      is_published: true,
    },
    {
      supplier_id: dewuId,
      sku: "DW-CNC-BRK-002",
      name_en: "CNC Machined Aluminum Bracket",
      name_zh: "CNC加工铝支架",
      description: {
        en: "Precision CNC machined aluminum bracket for industrial equipment mounting.",
        zh: "精密CNC加工铝支架，用于工业设备安装。",
      },
      specifications: {
        material: "Aluminum 6061",
        process: "CNC Machining",
        finish: "Clear Anodized",
        weight: "0.25 kg",
      },
      base_price: 1.23,
      category: "Industrial Machinery",
      certifications: ["RoHS"],
      moq: 1000,
      lead_time_days: 10,
      fob_port: "Shanghai",
      is_published: true,
    },
    {
      supplier_id: dewuId,
      sku: "DW-FAST-M6-003",
      name_en: "M6 Stainless Steel Hex Bolt Set",
      name_zh: "M6不锈钢六角螺栓套装",
      description: {
        en: "AISI 304 stainless steel hex bolts, ideal for corrosive environments.",
        zh: "AISI 304不锈钢六角螺栓，适用于腐蚀性环境。",
      },
      specifications: {
        material: "Stainless Steel 304",
        thread: "M6 x 1.0",
        length: "30mm / 40mm / 50mm",
        grade: "A2-70",
      },
      base_price: 0.08,
      category: "Fasteners & Hardware",
      certifications: ["ISO 9001"],
      moq: 5000,
      lead_time_days: 7,
      fob_port: "Ningbo",
      is_published: true,
    },
    {
      supplier_id: waruId,
      sku: "WR-FLG-304-001",
      name_en: "Stainless Steel 304 Slip-On Flange",
      name_zh: "不锈钢304滑动法兰",
      description: {
        en: "Slip-on flange made of SS304, suitable for low to medium pressure piping systems.",
        zh: "SS304滑动法兰，适用于低压到中压管道系统。",
      },
      specifications: {
        material: "Stainless Steel 304",
        standard: "ANSI B16.5",
        size: "1/2\" - 12\"",
        pressure: "150# / 300#",
      },
      base_price: 0.89,
      category: "Fasteners & Hardware",
      certifications: ["ISO 9001"],
      moq: 200,
      lead_time_days: 20,
      fob_port: "Ningbo / Shanghai",
      is_published: true,
    },
    {
      supplier_id: waruId,
      sku: "WR-CONV-BELT-002",
      name_en: "Industrial PVC Conveyor Belt",
      name_zh: "工业PVC输送带",
      description: {
        en: "Durable PVC conveyor belt for general industrial material handling.",
        zh: "耐用PVC输送带，用于一般工业物料输送。",
      },
      specifications: {
        material: "PVC / Rubber",
        width: "300mm - 2000mm",
        thickness: "2mm - 8mm",
        temperature: "-10°C to 80°C",
      },
      base_price: 34.0,
      category: "Industrial Machinery",
      certifications: ["CE"],
      moq: 100,
      lead_time_days: 25,
      fob_port: "Shanghai",
      is_published: true,
    },
    {
      supplier_id: waruId,
      sku: "WR-ELEC-CABLE-003",
      name_en: "UL-rated PVC Electrical Cable",
      name_zh: "UL认证PVC电线",
      description: {
        en: "UL-rated electrical cable for industrial wiring applications.",
        zh: "UL认证电线，用于工业布线。",
      },
      specifications: {
        conductor: "Copper (bare / tinned)",
        insulation: "PVC",
        voltage: "600V / 1000V",
        standard: "UL 758 / UL 1581",
      },
      base_price: 0.15,
      category: "Electrical Components",
      certifications: ["CE", "RoHS"],
      moq: 1000,
      lead_time_days: 14,
      fob_port: "Ningbo",
      is_published: true,
    },
  ];

  for (const p of products) {
    const { error } = await supabase.from("products").upsert(p as any, {
      onConflict: "sku",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error(`❌ Failed to insert product ${p.sku}:`, error.message);
    } else {
      console.log(`✅ Product: ${p.sku} — ${p.name_en}`);
    }
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
