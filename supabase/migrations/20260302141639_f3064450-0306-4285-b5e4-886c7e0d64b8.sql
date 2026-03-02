
CREATE TABLE public.cycle_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_name TEXT NOT NULL,
  inicios_count INTEGER NOT NULL DEFAULT 0,
  reinicios_count INTEGER NOT NULL DEFAULT 0,
  inicios_commission NUMERIC NOT NULL DEFAULT 0,
  reinicios_commission NUMERIC NOT NULL DEFAULT 0,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  inicios_tier_name TEXT,
  reinicios_tier_name TEXT,
  inicios_data JSONB DEFAULT '[]'::jsonb,
  reinicios_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cycle_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own cycle history"
  ON public.cycle_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cycle history"
  ON public.cycle_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycle history"
  ON public.cycle_history FOR DELETE
  USING (auth.uid() = user_id);
