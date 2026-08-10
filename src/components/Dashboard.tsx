import { TrendingUp, Users, RefreshCw, Target, Award, Sparkles, CalendarDays } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getCurrentCycle } from '@/lib/getCurrentCycle';
import { WorldCupBanner, GoalCelebration, isWorldCupActive } from '@/components/WorldCupAnimation';


interface DashboardProps {
  iniciosCount: number;
  reiniciosCount: number;
  iniciosCommission: number;
  reiniciosCommission: number;
  totalCommission: number;
  iniciosProgress: number;
  reiniciosProgress: number;
  iniciosTierName: string;
  reiniciosTierName: string;
  iniciosNormalCount?: number;
  iniciosOffCount?: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  sublabel,
  iconColor = 'text-primary',
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
  iconColor?: string;
  highlight?: boolean;
}) => (
  <div className={`card-premium p-4 sm:p-5 ${highlight ? 'ring-2 ring-gold/50' : ''}`}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? 'text-gradient-gold' : 'text-foreground'}`}>
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
      <div className={`p-2.5 rounded-xl ${highlight ? 'gradient-gold' : 'bg-primary/10'}`}>
        <Icon className={`h-5 w-5 ${highlight ? 'text-primary-foreground' : iconColor}`} />
      </div>
    </div>
  </div>
);

const ProgressCard = ({
  label,
  current,
  progress,
  tierName,
}: {
  label: string;
  current: number;
  progress: number;
  tierName: string;
}) => {
  const wc = typeof window !== 'undefined' && isWorldCupActive();
  const milestone =
    wc && progress >= 90
      ? '⚽ Falta muito pouco para marcar esse gol.'
      : wc && progress >= 75
      ? '🏁 Você está entrando na reta final rumo à vitória.'
      : null;

  return (
    <div className="card-premium p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`badge-faixa ${
          tierName === 'Sonho Grande' ? 'bg-gold text-primary-foreground' :
          tierName === 'Super Meta' ? 'bg-primary text-primary-foreground' :
          tierName === 'Meta' ? 'bg-primary/80 text-primary-foreground' :
          tierName === 'Gatilho' ? 'bg-primary/60 text-primary-foreground' :
          'bg-muted text-muted-foreground'
        }`}>
          {tierName}
        </span>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Progress value={progress} className="h-2.5" />
          {wc && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.min(100, progress)}%`,
                background:
                  'linear-gradient(90deg, rgba(255,223,0,0) 0%, rgba(255,223,0,0.55) 60%, rgba(255,255,255,0.85) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          )}
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {progress.toFixed(0)}% da meta
        </p>
        {milestone && (
          <p className="text-xs font-semibold text-primary">{milestone}</p>
        )}
      </div>
    </div>
  );
};


export const Dashboard = ({
  iniciosCount,
  reiniciosCount,
  iniciosCommission,
  reiniciosCommission,
  totalCommission,
  iniciosProgress,
  reiniciosProgress,
  iniciosTierName,
  reiniciosTierName,
  iniciosNormalCount,
  iniciosOffCount,
}: DashboardProps) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const currentCycle = getCurrentCycle();

  return (
    <div className="space-y-6">
      {/* Banner Copa (auto-remove após 19/07) */}
      <WorldCupBanner />

      {/* Celebrações de meta */}
      <GoalCelebration tierName={iniciosTierName} storageKey="wc_celebrated_inicios" />
      <GoalCelebration tierName={reiniciosTierName} storageKey="wc_celebrated_reinicios" />

      {/* Aviso informativo */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground">
        <span>⚠️</span>
        <span>Uso exclusivamente informativo — não substitui validação oficial de RV ou faturamento.</span>
      </div>


      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl gradient-primary shrink-0">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Painel Promotores</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Controle de Resultados</p>
          </div>
        </div>
        {currentCycle && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <CalendarDays className="h-5 w-5 text-primary shrink-0" />
            <div className="text-right">
              <p className="text-sm font-bold text-primary leading-tight">{currentCycle.ciclo}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{currentCycle.inicio} - {currentCycle.fim}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 isolate">
        <StatCard
          icon={Users}
          label="Inícios"
          value={iniciosCount}
          sublabel={
            iniciosOffCount !== undefined && iniciosNormalCount !== undefined
              ? `Normal: ${iniciosNormalCount} • Off: ${iniciosOffCount}`
              : 'no ciclo'
          }
        />
        <StatCard
          icon={TrendingUp}
          label="Comissão Inícios"
          value={formatCurrency(iniciosCommission)}
        />
        <StatCard
          icon={RefreshCw}
          label="Reinícios"
          value={reiniciosCount}
          sublabel="no ciclo"
        />
        <StatCard
          icon={TrendingUp}
          label="Comissão Reinícios"
          value={formatCurrency(reiniciosCommission)}
        />
        <StatCard
          icon={Award}
          label="Total Geral"
          value={formatCurrency(totalCommission)}
          highlight
        />
        <StatCard
          icon={Target}
          label="Pedidos"
          value={iniciosCount + reiniciosCount}
          sublabel="total"
        />
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <ProgressCard
          label="Progresso Inícios"
          current={iniciosCount}
          progress={iniciosProgress}
          tierName={iniciosTierName}
        />
        <ProgressCard
          label="Progresso Reinícios"
          current={reiniciosCount}
          progress={reiniciosProgress}
          tierName={reiniciosTierName}
        />
      </div>
    </div>
  );
};
