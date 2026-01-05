-- Tabela de configuração do ciclo por usuário
CREATE TABLE public.cycle_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inicios_meta INTEGER NOT NULL DEFAULT 25,
  reinicios_meta INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de pedidos (inícios e reinícios)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('inicio', 'reinicio')),
  client_name TEXT NOT NULL,
  order_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cycle_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for cycle_config
CREATE POLICY "Users can view their own config"
ON public.cycle_config FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config"
ON public.cycle_config FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own config"
ON public.cycle_config FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
ON public.orders FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cycle_config_updated_at
BEFORE UPDATE ON public.cycle_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();