-- Sales Arya: Company context and knowledge base foundation
-- Used when tenant/auth is available

-- =============================================================================
-- TENANTS (for multi-tenant SaaS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id TEXT UNIQUE,
  subscription_plan TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_stripe ON public.tenants(stripe_customer_id);

-- Link profiles to tenants (optional; for now profiles can exist without tenant)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;

-- =============================================================================
-- SALES COMPANY CONTEXT (per-tenant knowledge for Sales Arya)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sales_company_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  product_or_service TEXT NOT NULL,
  industry TEXT,
  target_company_size TEXT,
  key_value_props TEXT,
  pricing_model TEXT,
  unique_selling_points TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id)
);

CREATE INDEX idx_sales_company_context_tenant ON public.sales_company_context(tenant_id);

ALTER TABLE public.sales_company_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tenant sales context"
  ON public.sales_company_context FOR ALL
  USING (
    tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );

-- =============================================================================
-- TRIGGERS
-- =============================================================================
CREATE TRIGGER set_sales_company_context_updated_at
  BEFORE UPDATE ON public.sales_company_context
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
