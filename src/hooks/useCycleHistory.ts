import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CycleHistoryRecord {
  id: string;
  cycle_name: string;
  inicios_count: number;
  reinicios_count: number;
  inicios_commission: number;
  reinicios_commission: number;
  total_commission: number;
  inicios_tier_name: string | null;
  reinicios_tier_name: string | null;
  inicios_data: any[];
  reinicios_data: any[];
  created_at: string;
}

export const useCycleHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState<CycleHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('cycle_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setHistory(data as CycleHistoryRecord[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const saveCycleSnapshot = useCallback(async (snapshot: {
    cycleName: string;
    iniciosCount: number;
    reiniciosCount: number;
    iniciosCommission: number;
    reiniciosCommission: number;
    totalCommission: number;
    iniciosTierName: string;
    reiniciosTierName: string;
    iniciosData: any[];
    reiniciosData: any[];
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cycle_history')
      .insert({
        user_id: user.id,
        cycle_name: snapshot.cycleName,
        inicios_count: snapshot.iniciosCount,
        reinicios_count: snapshot.reiniciosCount,
        inicios_commission: snapshot.iniciosCommission,
        reinicios_commission: snapshot.reiniciosCommission,
        total_commission: snapshot.totalCommission,
        inicios_tier_name: snapshot.iniciosTierName,
        reinicios_tier_name: snapshot.reiniciosTierName,
        inicios_data: snapshot.iniciosData as any,
        reinicios_data: snapshot.reiniciosData as any,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao salvar histórico', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) {
      setHistory(prev => [data as CycleHistoryRecord, ...prev]);
      toast({ title: 'Ciclo salvo!', description: `Relatório do ${snapshot.cycleName} salvo com sucesso.` });
    }
  }, [user, toast]);

  const deleteHistory = useCallback(async (id: string) => {
    const { error } = await supabase.from('cycle_history').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
      return;
    }
    setHistory(prev => prev.filter(h => h.id !== id));
  }, [toast]);

  return { history, loading, saveCycleSnapshot, deleteHistory };
};
