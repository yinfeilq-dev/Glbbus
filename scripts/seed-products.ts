/**
 * 产品批量录入脚本
 *
 * 目标: 德悟 + 瓦鲁 各补充到 20 个产品（各 +17 个）
 * 运行: npx tsx scripts/seed-products.ts
 *
 * 警告：脚本依赖 OPENAI_API_KEY 环境变量
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ===== Supabase 客户端 =====
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== 现有产品数 =====
// 德悟(dewu): id = 7ecefeb5-4d0d-4f15-93f3-f658de0cf065, 已有 3 个
// 瓦鲁(waru): id = 49f4c400-ff9b-4a7b-9845-213b7a3e3565, 已有 3 个

const SUPPLIERS = {
  dewu: {
    id: "7ecefeb5-4d0d-4f15-93f3-f658de0cf065",
    name: "Dewu Industrial",
    productPrefix: "DW",
  },
  waru: {
    id: "49f4c400-ff9b-4a7b-9845-213b7a3e3565",
    name: "Waru Manufacturing",
    productPrefix: "WR",
  },
} as const;

// ===== 产品种子数据 =====
// 给德悟额外补充 17 个，给瓦鲁额外补充 17 个

const DEWU_PRODUCTS: SeedProduct[] = [
  // 铝型材类（已有1个）
  {
    sku: "DW-EXT-6060-004",
    name_en: "6060-T6 Aluminum Square Tube",
    name_zh: "6060-T6 铝合金方管",
    category: "Aluminum Profiles",
    material: "Aluminum 6060-T6",
    specs: { width: "20mm - 80mm", length: "Custom (max 6m)", wall_thickness: "1.5mm - 4mm", surface_finish: "Anodized / Mill Finish" },
    price: 3.2, cert: ["CE", "RoHS"], moq: 300, lead_time: 12, fob: "Shanghai / Ningbo",
  },
  {
    sku: "DW-EXT-HEATSINK-005",
    name_en: "Aluminum Heat Sink Extrusion",
    name_zh: "铝合金散热器型材",
    category: "Aluminum Profiles",
    material: "Aluminum 6063-T5",
    specs: { fin_height: "10mm - 80mm", fin_pitch: "4mm - 12mm", length: "Custom (max 6m)", surface: "Black Anodized / Silver" },
    price: 4.5, cert: ["CE", "RoHS"], moq: 500, lead_time: 15, fob: "Shanghai",
  },
  {
    sku: "DW-EXT-TSLOT-006",
    name_en: "T-Slot Aluminum Profile 40x40",
    name_zh: "T型槽铝合金型材 40x40",
    category: "Aluminum Profiles",
    material: "Aluminum 6063-T5",
    specs: { profile: "40mm x 40mm", slot_width: "8mm", length: "Custom (max 6m)", finish: "Clear Anodized" },
    price: 5.8, cert: ["CE", "RoHS", "ISO 9001"], moq: 200, lead_time: 10, fob: "Ningbo",
  },
  // CNC 加工类（已有1个）
  {
    sku: "DW-CNC-SHAFT-007",
    name_en: "CNC Machined Precision Shaft",
    name_zh: "CNC精密加工轴杆",
    category: "Industrial Machinery",
    material: "Stainless Steel 304 / 316",
    specs: { diameter: "5mm - 80mm", tolerance: "±0.005mm", length: "Max 1000mm", surface: "Ground / Polished" },
    price: 8.5, cert: ["ISO 9001"], moq: 100, lead_time: 14, fob: "Shanghai",
  },
  {
    sku: "DW-CNC-GEAR-008",
    name_en: "CNC Cut Spur Gear",
    name_zh: "CNC切割直齿轮",
    category: "Industrial Machinery",
    material: "Steel 45# / Alloy Steel 40Cr",
    specs: { module: "M1 - M6", teeth: "10 - 200", hardness: "HRC 45-55", process: "CNC Hobbing" },
    price: 3.2, cert: ["ISO 9001"], moq: 50, lead_time: 18, fob: "Shanghai",
  },
  {
    sku: "DW-CNC-PLATE-009",
    name_en: "CNC Aluminum Panel Plate",
    name_zh: "CNC铝合金面板",
    category: "Industrial Machinery",
    material: "Aluminum 5052 / 6061",
    specs: { max_size: "1500mm x 800mm", thickness: "1mm - 20mm", tolerance: "±0.1mm", surface: "Anodized / Brushed" },
    price: 6.0, cert: ["RoHS"], moq: 200, lead_time: 10, fob: "Ningbo / Shanghai",
  },
  // 紧固件类（已有1个）
  {
    sku: "DW-FAST-M8-010",
    name_en: "M8 Stainless Steel Hex Bolt & Nut Set",
    name_zh: "M8不锈钢六角螺栓螺母套装",
    category: "Fasteners & Hardware",
    material: "Stainless Steel 304 / 316",
    specs: { grade: "A2-70 / A4-80", thread: "M8 x 1.25", length: "20mm - 100mm", standard: "DIN 933 / ISO 4017" },
    price: 0.15, cert: ["ISO 9001"], moq: 5000, lead_time: 7, fob: "Ningbo",
  },
  {
    sku: "DW-FAST-WASH-011",
    name_en: "Flat & Spring Washer Assortment",
    name_zh: "平垫圈弹簧垫圈组合",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / Stainless Steel",
    specs: { size: "M3 - M24", standard: "DIN 125 / DIN 127", finish: "Zinc Plated / Plain", pack: "100 pcs per pack" },
    price: 2.5, cert: [], moq: 1000, lead_time: 5, fob: "Ningbo",
  },
  {
    sku: "DW-FAST-ANCH-012",
    name_en: "Expansion Anchor Bolt",
    name_zh: "膨胀锚栓",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / Zinc Alloy",
    specs: { diameter: "M6 - M20", length: "50mm - 200mm", type: "Sleeve / Wedge / Drop-in", finish: "Zinc Plated / Hot Dip Galvanized" },
    price: 0.35, cert: ["CE"], moq: 2000, lead_time: 10, fob: "Ningbo",
  },
  // 钢管类
  {
    sku: "DW-PIPE-SS-013",
    name_en: "Stainless Steel Seamless Pipe",
    name_zh: "不锈钢无缝管",
    category: "Fasteners & Hardware",
    material: "SS304 / SS316L",
    specs: { od: "6mm - 219mm", wall: "1mm - 12mm", standard: "ASTM A312 / A269", finish: "Pickled / Polished" },
    price: 2.8, cert: ["ISO 9001", "CE"], moq: 100, lead_time: 20, fob: "Shanghai / Tianjin",
  },
  {
    sku: "DW-PIPE-CARB-014",
    name_en: "Carbon Steel ERW Pipe",
    name_zh: "碳钢高频焊管",
    category: "Fasteners & Hardware",
    material: "Carbon Steel Q235 / S235JR",
    specs: { od: "1/2\" - 8\"", wall: "SCH 10 - SCH 80", standard: "ASTM A53 / EN 10255", finish: "Black / Galvanized" },
    price: 0.6, cert: ["CE"], moq: 500, lead_time: 15, fob: "Tianjin",
  },
  // 电气类
  {
    sku: "DW-ELEC-BUS-015",
    name_en: "Copper Busbar",
    name_zh: "铜排/铜母线",
    category: "Electrical Components",
    material: "Copper C1100 / C10100",
    specs: { thickness: "3mm - 20mm", width: "20mm - 200mm", standard: "GB/T 5585 / DIN 46431", conductivity: "≥ 98% IACS" },
    price: 12.0, cert: ["CE", "RoHS"], moq: 100, lead_time: 10, fob: "Shanghai / Ningbo",
  },
  {
    sku: "DW-ELEC-CABLE-TRAY-016",
    name_en: "Perforated Cable Tray",
    name_zh: "穿孔式电缆桥架",
    category: "Electrical Components",
    material: "Steel / Stainless Steel / Aluminum",
    specs: { width: "100mm - 600mm", height: "50mm - 150mm", thickness: "1.2mm - 2.5mm", finish: "Hot Dip Galvanized / Pre-Galvanized" },
    price: 5.5, cert: ["CE", "ISO 9001"], moq: 200, lead_time: 12, fob: "Ningbo",
  },
  // 阀门类
  {
    sku: "DW-VALVE-BALL-017",
    name_en: "Ball Valve — Full Bore",
    name_zh: "全通径球阀",
    category: "Industrial Machinery",
    material: "WCB / CF8 / CF8M",
    specs: { size: "1/2\" - 12\"", pressure: "150# - 600#", connection: "Flanged / Threaded / Welded", operation: "Manual / Pneumatic / Electric" },
    price: 25.0, cert: ["CE", "ISO 17292"], moq: 10, lead_time: 25, fob: "Shanghai",
  },
  {
    sku: "DW-VALVE-GATE-018",
    name_en: "Gate Valve — Rising Stem",
    name_zh: "明杆闸阀",
    category: "Industrial Machinery",
    material: "WCB / CF8",
    specs: { size: "2\" - 24\"", pressure: "150# - 900#", standard: "API 600 / BS 1414", connection: "Flanged" },
    price: 45.0, cert: ["API 600", "CE"], moq: 5, lead_time: 30, fob: "Shanghai",
  },
  // 弹簧类
  {
    sku: "DW-SPRING-COMP-019",
    name_en: "Compression Spring Assortment",
    name_zh: "压缩弹簧套装",
    category: "Fasteners & Hardware",
    material: "Spring Steel 65Mn / Stainless Steel 301",
    specs: { wire_diameter: "0.3mm - 8mm", od: "3mm - 60mm", free_length: "10mm - 200mm", finish: "Plain / Zinc Plated / Shot Peened" },
    price: 4.0, cert: [], moq: 500, lead_time: 10, fob: "Ningbo",
  },
  {
    sku: "DW-SPRING-TORS-020",
    name_en: "Torsion Spring — Customizable",
    name_zh: "扭力弹簧（可定制）",
    category: "Fasteners & Hardware",
    material: "Spring Steel / Stainless Steel",
    specs: { wire_diameter: "0.5mm - 6mm", coil_direction: "Left / Right", finish: "Black Oxide / Zinc Plated", load: "Custom per spec" },
    price: 0.8, cert: [], moq: 1000, lead_time: 12, fob: "Ningbo",
  },
];

const WARU_PRODUCTS: SeedProduct[] = [
  // 法兰类（已有1个）
  {
    sku: "WR-FLG-WN-004",
    name_en: "Weld Neck Flange",
    name_zh: "对焊法兰",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / Stainless Steel",
    specs: { size: "1/2\" - 24\"", pressure: "150# - 2500#", standard: "ANSI B16.5 / EN 1092-1", facing: "RF / RTJ / FF" },
    price: 3.5, cert: ["ISO 9001", "CE", "PED"], moq: 50, lead_time: 25, fob: "Ningbo / Shanghai",
  },
  {
    sku: "WR-FLG-BLIND-005",
    name_en: "Blind Flange",
    name_zh: "盲板法兰",
    category: "Fasteners & Hardware",
    material: "Carbon Steel A105 / SS304",
    specs: { size: "1/2\" - 24\"", pressure: "150# - 1500#", standard: "ANSI B16.5", facing: "RF / FF" },
    price: 2.8, cert: ["ISO 9001"], moq: 50, lead_time: 20, fob: "Ningbo",
  },
  // 弯头/管件类
  {
    sku: "WR-FITTING-ELBOW-006",
    name_en: "90° Long Radius Elbow",
    name_zh: "90度长半径弯头",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / SS304 / SS316",
    specs: { size: "1/2\" - 20\"", wall: "SCH 10 - SCH 160", standard: "ASME B16.9", bend_radius: "1.5D / 3D" },
    price: 1.2, cert: ["CE", "ISO 9001"], moq: 100, lead_time: 15, fob: "Ningbo",
  },
  {
    sku: "WR-FITTING-TEE-007",
    name_en: "Equal Tee Pipe Fitting",
    name_zh: "等径三通管件",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / Stainless Steel",
    specs: { size: "1/2\" - 16\"", wall: "SCH 20 - SCH 80S", standard: "ASME B16.9", type: "Equal / Reducing" },
    price: 2.0, cert: ["CE", "ISO 9001"], moq: 100, lead_time: 18, fob: "Ningbo",
  },
  // 输送带类（已有1个）
  {
    sku: "WR-CONV-MOD-008",
    name_en: "Modular Plastic Conveyor Belt",
    name_zh: "模块化塑料输送带",
    category: "Industrial Machinery",
    material: "PP / POM / Nylon",
    specs: { width: "200mm - 1500mm", pitch: "25.4mm / 38.1mm", color: "Blue / Green / White", temperature: "-20°C to 80°C" },
    price: 28.0, cert: ["CE", "FDA"], moq: 50, lead_time: 20, fob: "Shanghai",
  },
  {
    sku: "WR-CONV-ROLL-009",
    name_en: "Gravity Roller Conveyor",
    name_zh: "重力辊筒输送机",
    category: "Industrial Machinery",
    material: "Carbon Steel / Stainless Steel / Galvanized",
    specs: { roller_diameter: "38mm / 50mm / 60mm", length: "Custom (max 3m)", pitch: "75mm - 200mm", load: "Up to 300 kg/m" },
    price: 85.0, cert: ["CE"], moq: 10, lead_time: 25, fob: "Shanghai",
  },
  // 电机类
  {
    sku: "WR-MOTOR-AC-010",
    name_en: "Three-Phase AC Induction Motor",
    name_zh: "三相异步电动机",
    category: "Electrical Components",
    material: "Cast Iron Frame / Copper Winding",
    specs: { power: "0.75kW - 315kW", poles: "2 / 4 / 6 / 8", voltage: "380V / 660V / 415V", ip_rating: "IP55 / IP65" },
    price: 150.0, cert: ["CE", "ISO 9001", "CCC"], moq: 5, lead_time: 30, fob: "Shanghai",
  },
  {
    sku: "WR-MOTOR-SERVO-011",
    name_en: "AC Servo Motor + Drive",
    name_zh: "交流伺服电机+驱动器",
    category: "Electrical Components",
    material: "Aluminum Frame / Permanent Magnet",
    specs: { power: "100W - 7.5kW", feedback: "Encoder 2500ppr / Absolute", voltage: "220V / 380V", ip_rating: "IP54 / IP65" },
    price: 350.0, cert: ["CE", "RoHS"], moq: 2, lead_time: 25, fob: "Shanghai",
  },
  // 传感器类
  {
    sku: "WR-SENSOR-PROX-012",
    name_en: "Inductive Proximity Sensor",
    name_zh: "电感式接近传感器",
    category: "Electrical Components",
    material: "PBT / Stainless Steel Housing",
    specs: { sensing_distance: "4mm - 40mm", output: "NPN / PNP / 2-Wire", voltage: "10-30V DC", connection: "M8 / M12 Connector" },
    price: 8.5, cert: ["CE", "RoHS"], moq: 100, lead_time: 10, fob: "Ningbo",
  },
  {
    sku: "WR-SENSOR-PHOTO-013",
    name_en: "Photoelectric Sensor — Through-beam",
    name_zh: "光电传感器（对射式）",
    category: "Electrical Components",
    material: "ABS / Zinc Die-cast Housing",
    specs: { range: "0.5m - 30m", output: "NPN / PNP", light_source: "Red LED / Laser Class 2", ip_rating: "IP67" },
    price: 15.0, cert: ["CE", "RoHS"], moq: 50, lead_time: 12, fob: "Ningbo",
  },
  // 气动元件类
  {
    sku: "WR-PNEU-CYL-014",
    name_en: "Double Acting Pneumatic Cylinder",
    name_zh: "双作用气缸",
    category: "Industrial Machinery",
    material: "Aluminum Tube / Hard Chrome Plated Rod",
    specs: { bore: "32mm - 200mm", stroke: "25mm - 2000mm", pressure: "0.1 - 1.0 MPa", cushion: "Adjustable" },
    price: 25.0, cert: ["CE", "ISO 15552"], moq: 20, lead_time: 15, fob: "Shanghai",
  },
  {
    sku: "WR-PNEU-SOL-015",
    name_en: "Solenoid Valve — 5/2 Way",
    name_zh: "电磁阀 — 5/2通",
    category: "Industrial Machinery",
    material: "Aluminum Body / NBR Seals",
    specs: { port_size: "G1/8\" - G1\"", voltage: "24V DC / 220V AC", flow_rate: "500 - 5000 L/min", response: "< 15ms" },
    price: 12.0, cert: ["CE", "RoHS"], moq: 50, lead_time: 10, fob: "Ningbo",
  },
  // 油封密封件
  {
    sku: "WR-SEAL-OIL-016",
    name_en: "Oil Seal — TC Type",
    name_zh: "TC型油封",
    category: "Fasteners & Hardware",
    material: "NBR / FKM / Silicone",
    specs: { inner_diameter: "10mm - 300mm", temperature: "-30°C to 120°C (NBR)", pressure: "Up to 0.5 MPa", standard: "DIN 3760" },
    price: 0.3, cert: [], moq: 1000, lead_time: 7, fob: "Ningbo",
  },
  {
    sku: "WR-SEAL-ORING-017",
    name_en: "O-Ring Kit — Metric Sizes",
    name_zh: "O型圈套装（公制）",
    category: "Fasteners & Hardware",
    material: "NBR 70 Shore A",
    specs: { sizes: "1.5mm x 10mm to 5mm x 50mm", hardness: "70 ± 5 Shore A", standard: "AS568 / ISO 3601", color: "Black / Orange" },
    price: 6.0, cert: [], moq: 500, lead_time: 5, fob: "Ningbo",
  },
  // 液压接头
  {
    sku: "WR-HYD-FITTING-018",
    name_en: "Hydraulic Hose Fitting — JIC Type",
    name_zh: "液压软管接头 — JIC型",
    category: "Fasteners & Hardware",
    material: "Carbon Steel / Stainless Steel",
    specs: { size: "1/4\" - 2\"", thread: "JIC 37° Flare", standard: "SAE J514", finish: "Zinc Plated / Plain" },
    price: 1.5, cert: ["ISO 9001"], moq: 200, lead_time: 10, fob: "Ningbo",
  },
  {
    sku: "WR-HYD-HOSE-019",
    name_en: "Hydraulic Rubber Hose — EN 853 2SN",
    name_zh: "液压橡胶软管 — EN 853 2SN",
    category: "Fasteners & Hardware",
    material: "Synthetic Rubber / Steel Wire Braid",
    specs: { inner_diameter: "6mm - 51mm", working_pressure: "16 - 40 MPa", temperature: "-40°C to 100°C", standard: "EN 853 / SAE 100R2" },
    price: 3.0, cert: ["CE", "ISO 9001"], moq: 200, lead_time: 12, fob: "Ningbo",
  },
  // 电线电缆（已有1个）
  {
    sku: "WR-ELEC-POWER-020",
    name_en: "Armored Power Cable — XLPE",
    name_zh: "铠装电力电缆 — XLPE",
    category: "Electrical Components",
    material: "Copper Conductor / XLPE Insulation",
    specs: { cores: "3 / 4 / 5 Core", cross_section: "1.5mm² - 400mm²", voltage: "0.6/1kV", armor: "SWA / AWA" },
    price: 2.5, cert: ["CE", "IEC 60502", "BS 5467"], moq: 500, lead_time: 20, fob: "Ningbo / Shanghai",
  },
];

// ===== 类型 =====
type SeedProduct = {
  sku: string;
  name_en: string;
  name_zh: string;
  category: string;
  material: string;
  specs: Record<string, string>;
  price: number;
  cert: string[];
  moq: number;
  lead_time: number;
  fob: string;
};

// ===== 主流程 =====
async function seed() {
  console.log("🚀 Starting product seed...\n");

  // 插入德悟
  console.log(`📦 Dewu Industrial: inserting ${DEWU_PRODUCTS.length} products...`);
  for (const p of DEWU_PRODUCTS) {
    const { error } = await supabase.from("products").insert({
      supplier_id: SUPPLIERS.dewu.id,
      sku: p.sku,
      name_en: p.name_en,
      name_zh: p.name_zh,
      description: { en: "", zh: "" }, // 待AI生成
      specifications: p.specs,
      base_price: p.price,
      category: p.category,
      images: [],
      certifications: p.cert,
      moq: p.moq,
      lead_time_days: p.lead_time,
      fob_port: p.fob,
      is_published: true,
    });
    if (error) {
      console.error(`  ❌ ${p.sku}: ${error.message}`);
    } else {
      console.log(`  ✅ ${p.sku} — ${p.name_en}`);
    }
  }

  // 插入瓦鲁
  console.log(`\n📦 Waru Manufacturing: inserting ${WARU_PRODUCTS.length} products...`);
  for (const p of WARU_PRODUCTS) {
    const { error } = await supabase.from("products").insert({
      supplier_id: SUPPLIERS.waru.id,
      sku: p.sku,
      name_en: p.name_en,
      name_zh: p.name_zh,
      description: { en: "", zh: "" }, // 待AI生成
      specifications: p.specs,
      base_price: p.price,
      category: p.category,
      images: [],
      certifications: p.cert,
      moq: p.moq,
      lead_time_days: p.lead_time,
      fob_port: p.fob,
      is_published: true,
    });
    if (error) {
      console.error(`  ❌ ${p.sku}: ${error.message}`);
    } else {
      console.log(`  ✅ ${p.sku} — ${p.name_en}`);
    }
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
