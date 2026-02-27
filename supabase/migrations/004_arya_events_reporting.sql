-- Arya Events: Reporting for all Arya functionalities
-- Sales, HR, Chatbot, Receptionist, SMM

CREATE TABLE IF NOT EXISTS public.arya_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  arya_role TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_arya_events_tenant ON public.arya_events(tenant_id);
CREATE INDEX idx_arya_events_type ON public.arya_events(event_type);
CREATE INDEX idx_arya_events_role ON public.arya_events(arya_role);
CREATE INDEX idx_arya_events_created ON public.arya_events(created_at DESC);

ALTER TABLE public.arya_events ENABLE ROW LEVEL SECURITY;

-- Allow service role full access; users see own tenant
CREATE POLICY "Service role full access"
  ON public.arya_events FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view own tenant events"
  ON public.arya_events FOR SELECT
  USING (
    tenant_id IS NULL
    OR tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );
