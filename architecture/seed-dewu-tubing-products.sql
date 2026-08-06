-- ===== 德悟不锈钢管材 供应商 & 产品数据 =====
-- 数据来源：《产品介绍(无六角管）.xlsx》 2026-08-06
-- 在 Supabase SQL Editor 执行（幂等：先清理旧数据可重复执行）

-- 0. 清理旧数据（可选，如需重新上架）
-- DELETE FROM products WHERE supplier_id IN (SELECT id FROM suppliers WHERE slug = 'dewu-tubing');
-- DELETE FROM suppliers WHERE slug = 'dewu-tubing';

-- 1. 插入供应商：苏州德悟（管材线）
INSERT INTO suppliers (name, slug, country, certifications, production_capacity)
VALUES (
  '苏州德悟（不锈钢管材）',
  'dewu-tubing',
  '中国',
  ARRAY['ISO 9001', 'GB/T 14976', 'GB/T 13296', 'ASTM A312', 'ASTM A269', 'EN 10216'],
  '无缝钢管外径1-630mm/壁厚0.1-60mm，焊接管外径8-1200mm/壁厚0.4-100mm，支持非标定制'
);

-- ============================================================
-- 产品 1: 无缝钢管 (Seamless Stainless Steel Pipe)
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-TUBE-SEAMLESS',
  'Seamless Stainless Steel Pipe (Fluid / Industrial / High-Temp High-Pressure / Clean / Nuclear / Petrochemical Grade)',
  '无缝钢管（流体管/工业管/高温高压管/洁净管/核电用管/石油化工管）',
  '{"en": "Seamless stainless steel pipe manufactured from solid billets through piercing, hot rolling, cold rolling, cold drawing and finishing annealing in one integrated process. Dense pipe wall structure delivers superior pressure resistance and corrosion resistance far beyond welded pipe. Ideal for long-term service in high-pressure, high-temperature and corrosive environments. Sizes from OD 1mm to 630mm, wall 0.1mm to 60mm; coils up to 800m for OD under 19mm. Full range of finishes: 2B, pickled bright, bright annealed, polished, degreased clean.", "zh": "采用实心钢坯经穿孔、热轧、冷轧、冷拔、精整退火一体成型，管壁组织致密，耐压、耐腐蚀性能远优于焊接管。适合长期高压、高温、腐蚀工况使用。外径1-630mm，壁厚0.1-60mm；外径19mm以下最长单支800米。支持2B、酸洗白亮、精轧光亮、内外抛光、脱脂洁净等表面。"}',
  '{"Type": "Seamless (solid billet, no weld)", "OD_Range": "1mm - 630mm", "Wall_Thickness": "0.1mm - 60mm", "Standard_Length": "Up to 800m per coil (OD<19mm) / Up to 50m (OD>=19mm)", "Custom_Length": "Yes (non-standard, extended, precision cut)", "Materials": "304/304L, 316L, 321, 310S/309S, duplex 2205 (S31803), 2507, 904L, nickel alloys, titanium alloys, high-temp alloys", "Standards": "GB/T 14976, GB/T 13296, ASTM A312, ASTM A269, EN 10216", "Surface": "2B, pickled bright, bright annealed, inside/outside polished, degreased clean", "Key_Features": "Seamless integral, high pressure rating, excellent sealing, uniform material, intergranular corrosion resistant, smooth bore, low fluid resistance, long service life"}',
  'Stainless Steel Pipe',
  ARRAY['GB/T 14976', 'GB/T 13296', 'ASTM A312', 'ASTM A269', 'EN 10216'],
  1, 25, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- ============================================================
-- 产品 2: 焊接钢管 (Welded Stainless Steel Pipe)
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-TUBE-WELDED',
  'Welded Stainless Steel Pipe (Industrial Fluid / Sanitary / Nuclear / Petrochemical Grade)',
  '焊接钢管（工业流体焊管、卫生级焊管、核电用焊管、石油石化用焊管）',
  '{"en": "Welded stainless steel pipe made from premium stainless strip through uncoiling, leveling, forming, precision TIG welding, weld seam flattening, solution annealing and final sizing. Smooth and uniform weld seam, high roundness and consistent wall thickness. Cost-effective alternative to seamless pipe with stable batch supply. Suitable for normal pressure, ambient and medium-low pressure long-term service. Full finish options including 2B, BA, mirror polish, brushed, electropolished, degreased clean.", "zh": "采用优质不锈钢钢带经开卷、整平、卷圆、精密氩弧焊接、焊缝整平、固溶退火、精整定尺成型。焊缝平整均匀，管身圆度高、壁厚均匀。性价比优于无缝管，批量供货稳定性强，适配常规压力、常温及中低压工况长期使用。"}',
  '{"Type": "Welded (TIG, seam flattened & solution annealed)", "OD_Range": "8mm - 1200mm", "Wall_Thickness": "0.4mm - 100mm", "Standard_Length": "6000mm (custom extended / short / non-standard available)", "Thin_Wall": "Custom available", "Materials": "304/304L, 316L, 321, 310S/309S, duplex 2205 (S31803), 2507, 904L, nickel alloys, titanium alloys, high-temp alloys", "Standards": "GB/T 12771, GB/T 18705, ASTM A240, ASTM A554, EN 10296", "Surface": "2B, BA, mirror polish, brushed, pickled, electropolished, degreased clean", "Key_Features": "Uniform wall, high dimensional accuracy, flat weld seam (no bulge, no dead corner), hygienic & anti-bacterial, cost-effective, stable batch supply"}',
  'Stainless Steel Pipe',
  ARRAY['GB/T 12771', 'ASTM A554', 'EN 10296'],
  1, 20, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- ============================================================
-- 产品 3: 不锈钢管件 (Stainless Steel Pipe Fittings)
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-FITTINGS',
  'Stainless Steel Pipe Fittings (Elbows / Tees / Reducers / Flanges)',
  '不锈钢管件（弯头、三通、大小头、法兰）',
  '{"en": "Stainless steel pipe fittings made from premium stainless billets/tubes via hot pressing, cold pressing, push forming, forging and precision machining in one integrated process, with solution annealing at key stages to eliminate stress. Uniform wall thickness, standard curvature, smooth pipe ends with precision machined bevels for perfect fit and sealing. Available as 90/45/180 degree elbows (long/short radius), equal/reducing/oblique tees, concentric/eccentric reducers, and slip-on/weld-neck/blind/plate/lap-joint flanges. Hygienic, non-toxic, no heavy metal leaching.", "zh": "采用优质不锈钢坯/管材为原料，经热压、冷压、推制、锻打、精密机加工一体成型，关键工序固溶退火处理。壁厚均匀、弧度标准、管口平整，精密车削坡口，安装贴合度高、密封性好。含弯头（90°/45°/180°长短期半径）、三通（等径/异径/斜三通）、大小头（同心/偏心）、法兰（平焊/对焊/盲板/板式/松套）。"}',
  '{"Type": "Elbows / Tees / Reducers / Flanges", "Elbow": "90°, 45°, 180° (long & short radius)", "Tee": "Equal, reducing, oblique", "Reducer": "Concentric, eccentric", "Flange": "Slip-on, weld-neck, blind, plate, lap-joint", "Materials": "304/304L, 316L, 321, 310S/309S, duplex 2205 (S31803), 2507, 904L", "Standards": "GB/T 12459, GB/T 13401, HG/T 20592, HG/T 20615, ASTM A403, ASME B16.9, EN 10253", "Surface": "Industrial bright, inside/outside fine polish, mirror polish, brushed, degreased clean, electropolished", "Key_Features": "Precise dimensions, standard curvature, seamless fitting, corrosion & oxidation resistant, hygienic, no heavy metal leaching, even stress distribution, no leak risk"}',
  'Pipe Fittings',
  ARRAY['GB/T 12459', 'ASME B16.9', 'ASTM A403', 'EN 10253'],
  1, 20, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- ============================================================
-- 产品 4: 方型管 (Square Stainless Steel Tube)
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-TUBE-SQUARE',
  'Seamless Square Stainless Steel Tube (Structural / Decorative Grade)',
  '方型管',
  '{"en": "Square stainless steel tube formed from solid round billet by high-temperature precision rolling into seamless one-piece shape, then solution annealed, straightened and cut to length. No welding at any stage - dense uniform structure, high squareness, clean corners, no weld defects. High dimensional accuracy and structural strength for premium industrial structures and demanding conditions. Superior bending/compression resistance, corrosion & rust resistance, long outdoor service life.", "zh": "采用优质不锈钢实心管坯，高温加热、精密轧制成型、无缝一体成形、固溶退火、精整校直、定尺切割。全程无焊接工序，管身组织结构致密均匀，方正度高、边角规整、无焊缝缺陷。适用于高端工业结构及严苛工况使用。"}',
  '{"Type": "Seamless square (no weld)", "Cross_Section": "20mm - 255mm (across flats)", "Wall_Thickness": "0.4mm - 12mm", "Custom": "Non-standard sizing available", "Materials": "304/304L, 316L, 321, 310S/309S (austenitic)", "Standards": "GB/T 3094-2012, GB/T 14975, GB/T 14976", "Surface": "2B, BA mirror, brushed, mirror polished, pickled & passivated", "Key_Features": "No-weld seamless forming, precise squareness, superior bending/compression resistance, corrosion & rust resistant, premium decorative finish, long service life"}',
  'Stainless Steel Tube',
  ARRAY['GB/T 3094-2012', 'GB/T 14975'],
  1, 25, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- ============================================================
-- 产品 5: 矩型管 (Rectangular Stainless Steel Tube)
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-TUBE-RECT',
  'Seamless Rectangular Stainless Steel Tube (Structural / Decorative Grade)',
  '矩型管',
  '{"en": "Rectangular stainless steel tube formed from solid round billet by high-temperature precision rolling into seamless one-piece shape, then solution annealed, straightened and cut to length. No welding at any stage - dense uniform structure, high squareness, clean corners, no weld defects. High dimensional accuracy and structural strength for premium industrial structures and demanding conditions. Ideal for architectural structures, frames, railings and equipment supports.", "zh": "采用优质不锈钢实心管坯，高温加热、精密轧制成型、无缝一体成形、固溶退火、精整校直、定尺切割。全程无焊接工序，管身组织结构致密均匀，方正度高、边角规整、无焊缝缺陷。适用于高端工业结构及严苛工况使用。"}',
  '{"Type": "Seamless rectangular (no weld)", "Cross_Section": "20mm - 255mm (across flats)", "Wall_Thickness": "0.4mm - 12mm", "Custom": "Non-standard sizing available", "Materials": "304/304L, 316L, 321, 310S/309S (austenitic)", "Standards": "GB/T 3094-2012, GB/T 14975, GB/T 14976", "Surface": "2B, BA mirror, brushed, mirror polished, pickled & passivated", "Key_Features": "No-weld seamless forming, precise squareness, superior bending/compression resistance, corrosion & rust resistant, premium decorative finish, long service life"}',
  'Stainless Steel Tube',
  ARRAY['GB/T 3094-2012', 'GB/T 14975'],
  1, 25, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- ============================================================
-- 产品 6: 岐管 (Manifold - Variable Wall Thickness Square Tube) ⭐ 差异化
-- ============================================================
INSERT INTO products (supplier_id, sku, name_en, name_zh, description, specifications, category, certifications, moq, lead_time_days, fob_port, is_published)
SELECT
  id, 'DW-MANIFOLD',
  'Seamless Manifold Tube with Variable Wall Thickness (Heavy-Wall Main / Thin-Wall Branch, No Weld)',
  '岐管（不等壁方型管材）',
  '{"en": "Patented-style manifold tube with variable wall thickness, formed with dedicated custom dies combining drawing and precision rolling. Main tube wall is thickened for high pressure bearing while branch tube wall is thinned for weight reduction - balancing high-pressure capacity with lightweight design and lower cost. No welding at any stage, no weld stress concentration. Ideal for high-pressure, strongly corrosive and long-term stable service conditions. Smooth flow channel design: low fluid resistance, even distribution, anti-fouling and hygienic.", "zh": "采用专用定制模具一体成形，拔制+精密轧制复合工艺。主管厚壁承压、支管薄壁减重，兼顾高压承载与轻量化，降低成本。全程无焊接，无应力集中缺陷。流道设计合理，分流均匀，耐蚀耐候，适配高压、强腐蚀复杂工况。"}',
  '{"Type": "Seamless variable-wall manifold (no weld)", "Wall_Ratio": "Up to 4:1 (thickest : thinnest)", "Max_Across_Flats": "160mm", "Custom": "Non-standard sizing available", "Materials": "304/304L, 316L, 321, 310S/309S (austenitic)", "Standards": "GB/T 3094-2012, GB/T 14975, GB/T 14976, GB/T 12459", "Surface": "2B, BA mirror, brushed, mirror polished, pickled & passivated", "Key_Features": "Variable wall: thick main for pressure + thin branch for weight saving; seamless one-piece no weld; smooth flow channels, low resistance, even distribution, anti-fouling; corrosion & high-temp resistant"}',
  'Manifold Tube',
  ARRAY['GB/T 3094-2012'],
  1, 30, 'Shanghai', true
FROM suppliers WHERE slug = 'dewu-tubing';

-- 索引补充（如已有则跳过）
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
