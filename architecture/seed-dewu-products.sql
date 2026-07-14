-- ===== 德悟增材 供应商 & 产品数据 =====
-- 在 Supabase SQL Editor 执行

-- 1. 插入供应商：苏州德悟增材技术有限公司
INSERT INTO suppliers (name, slug, country, certifications, production_capacity)
VALUES (
  '苏州德悟增材技术有限公司',
  'dewu-additive',
  '中国',
  ARRAY['ISO 9001'],
  '微细精密金属3D打印设备制造，年产能50+台'
);

-- 2. 产品列表
-- 产品 A: DW-UHP-120M
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-UHP-120M',
  'DW-UHP-120M Ultra High Precision Metal 3D Printer',
  'DW-UHP-120M 超高精度金属3D打印机',
  '{"en": "The DW-UHP-120M is an ultra-high precision SLM metal 3D printer designed for manufacturing精密 metal parts with Ra0.5-1.6μm surface finish, 2-10μm accuracy, and support-free small-angle forming. Ideal for medical devices, aerospace components, and micro-channel heat sink assemblies.", "zh": "DW-UHP-120M 是一款超高精度SLM金属3D打印设备，可实现金属精密零部件的超高光洁度（Ra0.5-1.6μm）、高精度（2-10μm）及小角度无支撑形/性协同控制制造。为医疗器械、航空航天、微流道散热组件等领域提供数字化制造解决方案。"}',
  '{"Build_Plate_Size": "Ф120×180mm", "Machine_Weight": "~800kg", "Layer_Thickness": "5-20μm (adjustable)", "Spot_Size": "≤25μm", "Min_Feature_Size": "≥30μm", "Surface_Roughness": "Ra0.5-1.6μm", "Laser_System": "Fiber Laser, 100W", "Optical_Path": "f-theta scanning system", "Max_Preheat_Temp": "≥200°C", "Control_System": "DW-builder", "Operating_Temp": "15-35°C", "Humidity": "≤40%", "Materials": "Titanium alloy, Aluminum alloy, Stainless steel, High-temp alloy", "Power_Supply": "≥5KW, 3-phase AC380V, 50Hz"}',
  'Metal 3D Printer',
  ARRAY['CE'],
  1, 30, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-additive';

-- 产品 B: DW-UHP-70M
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-UHP-70M',
  'DW-UHP-70M Ultra High Precision Metal 3D Printer',
  'DW-UHP-70M 超高精度金属3D打印机',
  '{"en": "The DW-UHP-70M is an ultra-high precision SLM metal 3D printer with a Ф70×100mm build plate. Features adjustable layer thickness of 5-30μm, spot size ≤25μm, and Ra0.5-1.6μm surface finish. Supports titanium alloy, aluminum alloy, stainless steel, and high-temp alloy with optional ≥500°C preheating system.", "zh": "DW-UHP-70M 是一款超高精度SLM金属3D打印设备，成形基板Ф70×100mm。铺粉层厚5-30μm可调，光斑≤25μm，表面粗糙度Ra0.5-1.6μm。支持钛合金、铝合金、不锈钢、高温合金等材料，可选配≥500°C预热系统。"}',
  '{"Build_Plate_Size": "Ф70×100mm", "Machine_Dimensions": "2050×1100×1800mm", "Machine_Weight": "~800kg", "Layer_Thickness": "5-30μm (adjustable)", "Spot_Size": "≤25μm", "Min_Feature_Size": "≥30μm", "Surface_Roughness": "Ra0.5-1.6μm", "Laser_System": "Fiber Laser, 100W", "Optical_Path": "f-theta scanning system", "Preheat_Temp": "≥400°C (optional)", "Control_System": "DW-builder, open parameter adjustment", "Operating_Temp": "15-35°C", "Humidity": "≤40%", "Materials": "Titanium alloy, Aluminum alloy, Stainless steel, High-temp alloy", "Power_Supply": "≥5KW, 3-phase AC380V, 50Hz", "Optional_Modules": "High-resolution photoelectric melt pool monitoring, Melt pool morphology & temp monitoring, ≥500°C preheating"}',
  'Metal 3D Printer',
  ARRAY['CE'],
  1, 30, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-additive';

-- 产品 C: DW-HP-200M
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-HP-200M',
  'DW-HP-200M High Precision Metal 3D Printer (Dual Laser Option)',
  'DW-HP-200M 高精度金属3D打印机（双激光可选）',
  '{"en": "The DW-HP-200M is a high precision SLM metal 3D printer with a 200×200×200mm build volume. Available in single (200W) or dual (200W×2) fiber laser configurations. Features Ra1.6-3.2μm surface finish, adjustable layer thickness of 10-40μm, and optional ≥200°C preheating. Equipped with high-resolution photoelectric melt pool monitoring and online monitoring system.", "zh": "DW-HP-200M 是一款高精度SLM金属3D打印设备，成形尺寸200×200×200mm。可选单激光200W或双激光200W×2配置。表面粗糙度Ra1.6-3.2μm，铺粉层厚10-40μm可调，可选配≥200°C预热。配备高分辨率光电熔池监测系统及在线监测系统。"}',
  '{"Build_Volume": "200×200×200mm", "Machine_Dimensions": "2100×1100×1800mm", "Machine_Weight": "~800kg", "Layer_Thickness": "10-40μm (adjustable)", "Spot_Size": "≤40μm", "Min_Feature_Size": "≥50μm", "Surface_Roughness": "Ra1.6-3.2μm", "Laser_System": "Fiber Laser, 200W (single) / 200W×2 (dual)", "Optical_Path": "f-theta scanning system", "Preheat_Temp": "≥200°C (optional)", "Control_System": "DW-builder, open parameter adjustment", "Operating_Temp": "15-35°C", "Humidity": "≤40%", "Materials": "Titanium alloy, Aluminum alloy, Stainless steel, High-temp alloy", "Power_Supply": "≥5KW, 3-phase AC380V, 50Hz", "Monitoring": "High-resolution photoelectric melt pool monitoring, Melt pool morphology & temp monitoring, Online monitoring system"}',
  'Metal 3D Printer',
  ARRAY['CE'],
  1, 30, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-additive';
