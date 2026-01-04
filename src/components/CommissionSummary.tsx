import { DollarSign, TrendingUp, Award } from 'lucide-react';
import { CommissionTier } from '@/types/commission';

interface CommissionSummaryProps {
  count: number;
  tier: CommissionTier;
  commission: number;
  tiers: CommissionTier[];
  type: 'inicio' | 'reinicio';
}

export const CommissionSummary = ({
  count,
  tier,
  commission,
  tiers,
  type,
}: CommissionSummaryProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const nextTier = tiers.find((t) => t.threshold > count);

  return (
    <div className="space-y-4">
      {/* Current Stats */}
      <div className="card-premium p-5">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">
          Resumo do Ciclo
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {type === 'inicio' ? 'Inícios' : 'Reinícios'}
            </p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(tier.value)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">por unidade</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gradient-gold">
              {formatCurrency(commission)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </div>
        </div>
      </div>

      {/* Current Tier */}
      <div className="card-premium p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              tier.name === 'Sonho Grande' ? 'gradient-gold' :
              tier.name === 'Super Meta' ? 'gradient-primary' :
              tier.name === 'Meta' ? 'bg-primary/80' :
              tier.name === 'Gatilho' ? 'bg-primary/60' :
              'bg-muted'
            }`}>
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faixa atual</p>
              <p className="font-semibold text-foreground">{tier.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(tier.value)}
            </p>
            <p className="text-xs text-muted-foreground">por {type}</p>
          </div>
        </div>
        
        {nextTier && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">
                +{nextTier.threshold - count}
              </span>{' '}
              para {nextTier.name} ({formatCurrency(nextTier.value)}/un)
            </p>
          </div>
        )}
      </div>

      {/* Tiers Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Tabela de Faixas
          </h4>
        </div>
        <div className="divide-y divide-border">
          {tiers.slice(1).map((t) => (
            <div
              key={t.name}
              className={`p-4 flex items-center justify-between ${
                tier.name === t.name ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  tier.name === t.name ? 'bg-primary animate-pulse-success' :
                  count >= t.threshold ? 'bg-primary' : 'bg-muted'
                }`} />
                <span className={`font-medium ${
                  tier.name === t.name ? 'text-primary' : 'text-foreground'
                }`}>
                  {t.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  ≥ {t.threshold}
                </span>
                <span className="ml-4 font-semibold text-foreground">
                  {formatCurrency(t.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
