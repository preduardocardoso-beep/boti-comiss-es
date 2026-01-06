export interface OrderRecord {
  id: string;
  clientName: string;
  orderNumber: string;
  date: string;
}

export interface CommissionTier {
  name: string;
  threshold: number;
  value: number;
}

export interface TierThresholds {
  gatilho: number;
  meta: number;
  superMeta: number;
}

export interface CycleConfig {
  iniciosMeta: number;
  reiniciosMeta: number;
  inicioThresholds: TierThresholds;
  reinicioThresholds: TierThresholds;
}

export interface CommissionData {
  inicios: OrderRecord[];
  reinicios: OrderRecord[];
  config: CycleConfig;
}

export const DEFAULT_INICIO_THRESHOLDS: TierThresholds = {
  gatilho: 4,
  meta: 7,
  superMeta: 9,
};

export const DEFAULT_REINICIO_THRESHOLDS: TierThresholds = {
  gatilho: 4,
  meta: 9,
  superMeta: 13,
};

export const DEFAULT_CONFIG: CycleConfig = {
  iniciosMeta: 25,
  reiniciosMeta: 15,
  inicioThresholds: DEFAULT_INICIO_THRESHOLDS,
  reinicioThresholds: DEFAULT_REINICIO_THRESHOLDS,
};

// Gatilhos para Inícios (Sonho Grande é dinâmico baseado na meta)
export const getIniciosTiers = (meta: number, thresholds: TierThresholds): CommissionTier[] => [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: thresholds.gatilho, value: 10 },
  { name: 'Meta', threshold: thresholds.meta, value: 20 },
  { name: 'Super Meta', threshold: thresholds.superMeta, value: 35 },
  { name: 'Sonho Grande', threshold: meta, value: 45 },
];

// Gatilhos para Reinícios (Sonho Grande é dinâmico baseado na meta)
export const getReiniciosTiers = (meta: number, thresholds: TierThresholds): CommissionTier[] => [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: thresholds.gatilho, value: 5 },
  { name: 'Meta', threshold: thresholds.meta, value: 10 },
  { name: 'Super Meta', threshold: thresholds.superMeta, value: 15 },
  { name: 'Sonho Grande', threshold: meta, value: 20 },
];
