import { useMemo, useState, useEffect } from 'react';
import { CalendarRange, Target, Users, RefreshCw, Trophy, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { OrderRecord } from '@/types/commission';

interface WeeklyGoalPanelProps {
  inicios: OrderRecord[];
  reinicios: OrderRecord[];
}

const STORAGE_KEY = 'rv_meta_semanal';

const startOfWeek = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // week starts Monday
  date.setDate(date.getDate() + diff);
  return date;
};

const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export const WeeklyGoalPanel = ({ inicios, reinicios }: WeeklyGoalPanelProps) => {
  const [metaSemanal, setMetaSemanal] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 10;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(metaSemanal));
  }, [metaSemanal]);

  const week = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const inWeek = (o: OrderRecord) => {
      if (!o.date) return false;
      const [y, m, d] = o.date.split('-').map(Number);
      if (!y || !m || !d) return false;
      const date = new Date(y, m - 1, d);
      return date >= start && date <= end;
    };

    const iniciosSemana = inicios.filter(inWeek);
    const reiniciosSemana = reinicios.filter(inWeek);
    const total = iniciosSemana.length + reiniciosSemana.length;
    const restante = Math.max(0, metaSemanal - total);
    const progresso = metaSemanal > 0 ? Math.min(100, (total / metaSemanal) * 100) : 0;

    return {
      start,
      end,
      iniciosSemana,
      reiniciosSemana,
      total,
      restante,
      progresso,
      atingida: metaSemanal > 0 && total >= metaSemanal,
      excedente: Math.max(0, total - metaSemanal),
    };
  }, [inicios, reinicios, metaSemanal]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-gold shadow-gold">
          <CalendarRange className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Meta Semanal</h2>
          <p className="text-sm text-muted-foreground">
            Semana de {fmt(week.start)} a {fmt(week.end)} — atualiza a cada novo início ou reinício
          </p>
        </div>
      </div>

      <Card className="card-premium border-2 border-gold/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-gold" />
            Quantidade almejada nesta semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="meta-semanal">Meta (pedidos)</Label>
            <Input
              id="meta-semanal"
              type="number"
              min={0}
              value={metaSemanal}
              onChange={(e) => setMetaSemanal(Math.max(0, Number(e.target.value)))}
              className="text-lg font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" /> Inícios
              </p>
              <p className="text-2xl font-bold text-primary">{week.iniciosSemana.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Reinícios
              </p>
              <p className="text-2xl font-bold text-primary">{week.reiniciosSemana.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary border border-border">
              <p className="text-xs text-muted-foreground mb-1">Registrados</p>
              <p className="text-2xl font-bold text-foreground">{week.total}</p>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                week.atingida
                  ? 'bg-gold/10 border-gold/40'
                  : 'bg-destructive/5 border-destructive/20'
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Minus className="h-3 w-3" /> Faltam
              </p>
              <p className={`text-2xl font-bold ${week.atingida ? 'text-gold' : 'text-destructive'}`}>
                {week.restante}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso da semana</span>
              <span className="font-semibold">{week.progresso.toFixed(0)}%</span>
            </div>
            <Progress value={week.progresso} className="h-3" />
          </div>

          {week.atingida ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl gradient-primary text-primary-foreground">
              <Trophy className="h-5 w-5 text-gold" />
              <span className="font-semibold">
                Meta semanal alcançada!{week.excedente > 0 ? ` +${week.excedente} acima da meta` : ''}
              </span>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Faltam <strong className="text-foreground">{week.restante}</strong> pedidos para bater a meta desta semana.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
