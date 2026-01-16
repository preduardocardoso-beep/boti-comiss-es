import { TrendingUp, Users, RefreshCw, Target, Award, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
  <div className={`card-premium p-5 ${highlight ? 'ring-2 ring-gold/50' : ''}`}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? 'text-gradient-gold' : 'text-foreground'} animate-count-up`}>
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
}) => (
  <div className="card-premium p-5">
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
      <Progress value={progress} className="h-2.5" />
      <p className="text-right text-xs text-muted-foreground">
        {progress.toFixed(0)}% da meta
      </p>
    </div>
  </div>
);

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
}: DashboardProps) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel Promotores</h1>
          <p className="text-sm text-muted-foreground">Controle de Resultados</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          label="Inícios"
          value={iniciosCount}
          sublabel="no ciclo"
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
