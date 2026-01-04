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

export interface CycleConfig {
  iniciosMeta: number;
  reiniciosMeta: number;
}

export interface CommissionData {
  inicios: OrderRecord[];
  reinicios: OrderRecord[];
  config: CycleConfig;
}

export const DEFAULT_CONFIG: CycleConfig = {
  iniciosMeta: 25,
  reiniciosMeta: 15,
};

// Gatilhos base para Inícios (Sonho Grande é dinâmico baseado na meta)
export const getIniciosTiers = (meta: number): CommissionTier[] => [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: 4, value: 10 },
  { name: 'Meta', threshold: 7, value: 20 },
  { name: 'Super Meta', threshold: 9, value: 35 },
  { name: 'Sonho Grande', threshold: meta, value: 45 },
];

// Gatilhos base para Reinícios (Sonho Grande é dinâmico baseado na meta)
export const getReiniciosTiers = (meta: number): CommissionTier[] => [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: 4, value: 5 },
  { name: 'Meta', threshold: 9, value: 10 },
  { name: 'Super Meta', threshold: 13, value: 15 },
  { name: 'Sonho Grande', threshold: meta, value: 20 },
];
