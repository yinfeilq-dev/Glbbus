// 数据库类型定义
// 与 Supabase schema 完全对齐

export type Supplier = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  contact_email: string | null;
  certifications: string[];
  production_capacity: string | null;
  api_webhook_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  supplier_id: string;
  sku: string;
  name_en: string;
  name_zh: string | null;
  description: Record<string, string>; // { en: "...", zh: "...", ... }
  specifications: Record<string, string>;
  base_price: number | null;
  category: string | null;
  images: string[];
  certifications: string[];
  moq: number | null;
  lead_time_days: number | null;
  fob_port: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  buyer_country: string | null;
  company_name: string | null;
  quantity: number | null;
  message: string | null;
  ai_quality_score: number;
  status: "new" | "contacted" | "quoted" | "closed";
  created_at: string;
};

export type SupplierWithProducts = Supplier & { products: Product[] };
