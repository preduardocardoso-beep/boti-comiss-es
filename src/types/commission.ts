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

// Gatilhos fixos para Inícios
export const INICIOS_TIERS: CommissionTier[] = [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: 4, value: 10 },
  { name: 'Meta', threshold: 7, value: 20 },
  { name: 'Super Meta', threshold: 9, value: 35 },
  { name: 'Sonho Grande', threshold: 11, value: 45 },
];

// Gatilhos fixos para Reinícios
export const REINICIOS_TIERS: CommissionTier[] = [
  { name: 'Abaixo do Gatilho', threshold: 0, value: 0 },
  { name: 'Gatilho', threshold: 4, value: 5 },
  { name: 'Meta', threshold: 9, value: 10 },
  { name: 'Super Meta', threshold: 13, value: 15 },
  { name: 'Sonho Grande', threshold: 15, value: 20 },
];

export const DEFAULT_CONFIG: CycleConfig = {
  iniciosMeta: 25,
  reiniciosMeta: 15,
};
