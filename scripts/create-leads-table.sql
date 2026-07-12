-- ========================================
-- 创建 leads 表（客户开发线索）
-- 在 Supabase Dashboard → SQL Editor 运行一次
-- ========================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  source TEXT,                          -- Google / LinkedIn / Alibaba / AI Generated / etc.
  industry TEXT,
  website TEXT,
  social_url TEXT,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new','contacted','replied','meeting','closed_won','closed_lost')),
  notes TEXT,
  next_action TEXT,
  next_action_date DATE,
  email_count INTEGER DEFAULT 0,
  last_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 行级安全：允许 service_role 无限制访问
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_admin_all') THEN
    CREATE POLICY "leads_admin_all" ON public.leads
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
