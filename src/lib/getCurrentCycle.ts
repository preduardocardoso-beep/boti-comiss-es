import { parse, isWithinInterval, isAfter, isBefore } from 'date-fns';
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

/**
 * Returns the cycle that should be used when saving a snapshot
 * (the cycle that is being closed). If today is past a cycle's `fim`
 * but a newer cycle has already started, we still want the older one
 * that is being finalized — within the post-cycle grace window (`fimPos`).
 */
export const getClosingCycle = (): CicloData | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Prefer the earliest cycle whose `fimPos` is still >= today and `inicio` <= today.
  // This favors the cycle being closed over a newly opened one.
  for (const ciclo of ciclosData) {
    const inicio = parse(ciclo.inicio, 'dd/MM/yyyy', new Date());
    const fimPos = parse(ciclo.fimPos, 'dd/MM/yyyy', new Date());
    if (!isBefore(today, inicio) && !isAfter(today, fimPos)) {
      return ciclo;
    }
  }

  // Fallback: most recently ended cycle
  const past = ciclosData
    .map((c) => ({ c, fim: parse(c.fim, 'dd/MM/yyyy', new Date()) }))
    .filter((x) => !isAfter(x.fim, today))
    .sort((a, b) => b.fim.getTime() - a.fim.getTime());
  if (past.length > 0) return past[0].c;

  return getCurrentCycle();
};
