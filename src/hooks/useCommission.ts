import { useState, useCallback, useMemo } from 'react';
import {
  OrderRecord,
  CommissionData,
  CycleConfig,
  getIniciosTiers,
  getReiniciosTiers,
  DEFAULT_CONFIG,
  CommissionTier,
} from '@/types/commission';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getToday = () => new Date().toISOString().split('T')[0];

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
  const [data, setData] = useState<CommissionData>(() => {
    const saved = localStorage.getItem('rv-promotor-data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      inicios: [],
      reinicios: [],
      config: DEFAULT_CONFIG,
    };
  });

  const saveData = useCallback((newData: CommissionData) => {
    setData(newData);
    localStorage.setItem('rv-promotor-data', JSON.stringify(newData));
  }, []);

  const addInicio = useCallback((clientName: string, orderNumber: string) => {
    const newRecord: OrderRecord = {
      id: generateId(),
      clientName: clientName.trim(),
      orderNumber: orderNumber.trim(),
      date: getToday(),
    };
    saveData({
      ...data,
      inicios: [...data.inicios, newRecord],
    });
  }, [data, saveData]);

  const addReinicio = useCallback((clientName: string, orderNumber: string) => {
    const newRecord: OrderRecord = {
      id: generateId(),
      clientName: clientName.trim(),
      orderNumber: orderNumber.trim(),
      date: getToday(),
    };
    saveData({
      ...data,
      reinicios: [...data.reinicios, newRecord],
    });
  }, [data, saveData]);

  const removeInicio = useCallback((id: string) => {
    saveData({
      ...data,
      inicios: data.inicios.filter((r) => r.id !== id),
    });
  }, [data, saveData]);

  const removeReinicio = useCallback((id: string) => {
    saveData({
      ...data,
      reinicios: data.reinicios.filter((r) => r.id !== id),
    });
  }, [data, saveData]);

  const updateConfig = useCallback((config: CycleConfig) => {
    saveData({
      ...data,
      config,
    });
  }, [data, saveData]);

  const resetCycle = useCallback(() => {
    saveData({
      inicios: [],
      reinicios: [],
      config: data.config,
    });
  }, [data.config, saveData]);

  const stats = useMemo(() => {
    const iniciosCount = data.inicios.length;
    const reiniciosCount = data.reinicios.length;
    
    const iniciosTiers = getIniciosTiers(data.config.iniciosMeta);
    const reiniciosTiers = getReiniciosTiers(data.config.reiniciosMeta);
    
    const iniciosTier = getCurrentTier(iniciosCount, iniciosTiers);
    const reiniciosTier = getCurrentTier(reiniciosCount, reiniciosTiers);
    
    const iniciosCommission = calculateCommission(iniciosCount, iniciosTiers);
    const reiniciosCommission = calculateCommission(reiniciosCount, reiniciosTiers);
    
    const totalCommission = iniciosCommission + reiniciosCommission;
    
    const iniciosProgress = Math.min((iniciosCount / data.config.iniciosMeta) * 100, 100);
    const reiniciosProgress = Math.min((reiniciosCount / data.config.reiniciosMeta) * 100, 100);

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
  }, [data]);

  return {
    data,
    stats,
    addInicio,
    addReinicio,
    removeInicio,
    removeReinicio,
    updateConfig,
    resetCycle,
  };
};
