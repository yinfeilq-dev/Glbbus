-- ===== GlbBus 初始 Schema =====
-- 在 Supabase SQL Editor 中执行

-- 1. 供应商表
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100),
  contact_email VARCHAR(255),
  certifications TEXT[],
  production_capacity TEXT,
  api_webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 产品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name_en VARCHAR(500) NOT NULL,
  name_zh VARCHAR(500),
  description JSONB DEFAULT '{}',        -- 多语言: {"en": "...", "zh": "...", "ru": "...", "es": "...", "ar": "..."}
  specifications JSONB DEFAULT '{}',      -- 规格参数: {"material": "6063-T5", "length": "6m", ...}
  base_price DECIMAL(12,2),
  category VARCHAR(255),
  images TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  moq INT,
  lead_time_days INT,
  fob_port VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 询盘表
CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'quoted', 'closed');

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  buyer_country VARCHAR(100),
  company_name VARCHAR(255),
  quantity INT,
  message TEXT,
  ai_quality_score INT DEFAULT 0,         -- AI评分 0-100
  status inquiry_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 报价表
CREATE TYPE quotation_status AS ENUM ('draft', 'sent', 'accepted', 'rejected');

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  unit_price DECIMAL(12,2) NOT NULL,
  moq INT,
  lead_time_days INT,
  shipping_terms VARCHAR(255),
  notes TEXT,
  status quotation_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 订单表
CREATE TYPE order_status AS ENUM ('confirmed', 'sampling', 'production', 'qc_passed', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL,
  status order_status DEFAULT 'confirmed',
  production_progress TEXT,
  shipping_tracking VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 内容表（SEO文章、页面）
CREATE TYPE content_type AS ENUM ('blog', 'page');

CREATE TABLE content_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en VARCHAR(500) NOT NULL,
  body JSONB DEFAULT '{}',
  type content_type DEFAULT 'blog',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_inquiries_product ON inquiries(product_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_quotations_inquiry ON quotations(inquiry_id);
CREATE INDEX idx_orders_quotation ON orders(quotation_id);

-- 自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_suppliers_updated_at
  BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_quotations_updated_at
  BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_content_updated_at
  BEFORE UPDATE ON content_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
