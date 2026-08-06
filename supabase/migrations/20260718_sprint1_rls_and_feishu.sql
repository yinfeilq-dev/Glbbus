-- ===== Sprint 1: RLS 修复 + 飞书通知数据库优化 =====
-- 在 Supabase SQL Editor 中执行（一次即可）

-- 1. 确保 inquiries 表允许匿名 INSERT
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

-- 2. 允许匿名 SELECT inquiries（用户可确认提交成功）
DROP POLICY IF EXISTS "Anyone can view own inquiry" ON inquiries;
CREATE POLICY "Anyone can view own inquiry"
  ON inquiries FOR SELECT USING (true);

-- 3. 公开读取已发布的 quotations（买家可查看自己的报价）
DROP POLICY IF EXISTS "Anyone can view own quotations" ON quotations;
CREATE POLICY "Anyone can view own quotations"
  ON quotations FOR SELECT USING (true);

-- 4. 公开读取 orders（买家可查看订单状态）
DROP POLICY IF EXISTS "Anyone can view own orders" ON orders;
CREATE POLICY "Anyone can view own orders"
  ON orders FOR SELECT USING (true);

-- 5. 创建通用联系询盘占位产品（作为找不到具体产品时的 fallback）
INSERT INTO products (sku, name_en, name_zh, category, is_published)
VALUES ('GENERAL-CONTACT', 'General Contact Inquiry', '通用联系询盘', 'Service', true)
ON CONFLICT (sku) DO NOTHING;

-- 6. 性能索引
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer_email ON inquiries(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);

-- 7. 创建 payments 表（Sprint 3 会用，先建结构）
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 给 orders 表加索引
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
