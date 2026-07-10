-- ===== RLS 策略 =====
-- 在 Supabase SQL Editor 中执行

-- 启用 RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;

-- ===== 公开读取 =====

CREATE POLICY "Anyone can read suppliers"
  ON suppliers FOR SELECT USING (true);

CREATE POLICY "Anyone can read published products"
  ON products FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can read content"
  ON content_entries FOR SELECT USING (is_published = true);

-- ===== 公开写入 =====

CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

-- ===== 后续: 管理员管理 =====
-- 下面这些以后再加管理员认证, 暂时用 service_role key 管理
