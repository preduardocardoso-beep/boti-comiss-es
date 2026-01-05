import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  OrderRecord,
  CycleConfig,
  getIniciosTiers,
  getReiniciosTiers,
  DEFAULT_CONFIG,
  CommissionTier,
} from '@/types/commission';

export const getCurrentTier = (count: number, tiers: CommissionTier[]): CommissionTier => {
  let currentTier = tiers[0];
  for (const tier of tiers) {
    if (count >= tier.threshold) {
      currentTier = tier;
    }
  }
  return currentTier;
};

export const calculateCommission = (count: number, tiers: CommissionTier[]): number => {
  const tier = getCurrentTier(count, tiers);
  return count * tier.value;
};

export const useCommission = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inicios, setInicios] = useState<OrderRecord[]>([]);
  const [reinicios, setReinicios] = useState<OrderRecord[]>([]);
  const [config, setConfig] = useState<CycleConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch config
      const { data: configData } = await supabase
        .from('cycle_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (configData) {
        setConfig({
          iniciosMeta: configData.inicios_meta,
          reiniciosMeta: configData.reinicios_meta,
        });
      } else {
        // Create default config for new user
        await supabase.from('cycle_config').insert({
          user_id: user.id,
          inicios_meta: DEFAULT_CONFIG.iniciosMeta,
          reinicios_meta: DEFAULT_CONFIG.reiniciosMeta,
        });
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersData) {
        const iniciosData = ordersData
          .filter((o) => o.type === 'inicio')
          .map((o) => ({
            id: o.id,
            clientName: o.client_name,
            orderNumber: o.order_number,
            date: o.created_at.split('T')[0],
          }));
        const reiniciosData = ordersData
          .filter((o) => o.type === 'reinicio')
          .map((o) => ({
            id: o.id,
            clientName: o.client_name,
            orderNumber: o.order_number,
            date: o.created_at.split('T')[0],
          }));
        setInicios(iniciosData);
        setReinicios(reiniciosData);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const addInicio = useCallback(async (clientName: string, orderNumber: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        type: 'inicio',
        client_name: clientName.trim(),
        order_number: orderNumber.trim(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Erro ao adicionar',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      setInicios((prev) => [
        {
          id: data.id,
          clientName: data.client_name,
          orderNumber: data.order_number,
          date: data.created_at.split('T')[0],
        },
        ...prev,
      ]);
    }
  }, [user, toast]);

  const addReinicio = useCallback(async (clientName: string, orderNumber: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        type: 'reinicio',
        client_name: clientName.trim(),
        order_number: orderNumber.trim(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Erro ao adicionar',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      setReinicios((prev) => [
        {
          id: data.id,
          clientName: data.client_name,
          orderNumber: data.order_number,
          date: data.created_at.split('T')[0],
        },
        ...prev,
      ]);
    }
  }, [user, toast]);

  const removeInicio = useCallback(async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setInicios((prev) => prev.filter((r) => r.id !== id));
  }, [toast]);

  const removeReinicio = useCallback(async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setReinicios((prev) => prev.filter((r) => r.id !== id));
  }, [toast]);

  const updateConfig = useCallback(async (newConfig: CycleConfig) => {
    if (!user) return;

    const { error } = await supabase
      .from('cycle_config')
      .update({
        inicios_meta: newConfig.iniciosMeta,
        reinicios_meta: newConfig.reiniciosMeta,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setConfig(newConfig);
  }, [user, toast]);

  const resetCycle = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Erro ao resetar',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setInicios([]);
    setReinicios([]);
  }, [user, toast]);

  const stats = useMemo(() => {
    const iniciosCount = inicios.length;
    const reiniciosCount = reinicios.length;
    
    const iniciosTiers = getIniciosTiers(config.iniciosMeta);
    const reiniciosTiers = getReiniciosTiers(config.reiniciosMeta);
    
    const iniciosTier = getCurrentTier(iniciosCount, iniciosTiers);
    const reiniciosTier = getCurrentTier(reiniciosCount, reiniciosTiers);
    
    const iniciosCommission = calculateCommission(iniciosCount, iniciosTiers);
    const reiniciosCommission = calculateCommission(reiniciosCount, reiniciosTiers);
    
    const totalCommission = iniciosCommission + reiniciosCommission;
    
    const iniciosProgress = Math.min((iniciosCount / config.iniciosMeta) * 100, 100);
    const reiniciosProgress = Math.min((reiniciosCount / config.reiniciosMeta) * 100, 100);

    return {
      iniciosCount,
      reiniciosCount,
      iniciosTier,
      reiniciosTier,
      iniciosValue: iniciosTier.value,
      reiniciosValue: reiniciosTier.value,
      iniciosCommission,
      reiniciosCommission,
      totalCommission,
      iniciosProgress,
      reiniciosProgress,
      iniciosTiers,
      reiniciosTiers,
    };
  }, [inicios, reinicios, config]);

  return {
    data: { inicios, reinicios, config },
    stats,
    loading,
    addInicio,
    addReinicio,
    removeInicio,
    removeReinicio,
    updateConfig,
    resetCycle,
  };
};
