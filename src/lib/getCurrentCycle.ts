import { parse, isWithinInterval, isAfter } from 'date-fns';
import { ciclosData, CicloData } from '@/data/ciclosData';

export const getCurrentCycle = (): CicloData | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const ciclo of ciclosData) {
    const inicio = parse(ciclo.inicio, 'dd/MM/yyyy', new Date());
    const fim = parse(ciclo.fim, 'dd/MM/yyyy', new Date());
    if (isWithinInterval(today, { start: inicio, end: fim })) {
      return ciclo;
    }
  }

  // If not in any cycle, return the next upcoming one
  for (const ciclo of ciclosData) {
    const inicio = parse(ciclo.inicio, 'dd/MM/yyyy', new Date());
    if (isAfter(inicio, today)) {
      return ciclo;
    }
  }

  return ciclosData[ciclosData.length - 1];
};
