-- Target GEO areas for Sales Arya
-- 2GIS: Eurasia, Middle East | Google Maps: Rest of world

CREATE TABLE IF NOT EXISTS public.target_geo_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('2gis', 'google')),
  country_codes TEXT[] DEFAULT '{}',
  cities TEXT[] DEFAULT '{}',
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION,
  bounds JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_target_geo_areas_tenant ON public.target_geo_areas(tenant_id);
CREATE INDEX idx_target_geo_areas_provider ON public.target_geo_areas(provider);

ALTER TABLE public.target_geo_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tenant geo areas"
  ON public.target_geo_areas FOR ALL
  USING (
    tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE TRIGGER set_target_geo_areas_updated_at
  BEFORE UPDATE ON public.target_geo_areas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
