import { TrendingUp, Award, Trophy, Rocket } from 'lucide-react';
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
  tiers,
  commission,
  type,
}: CommissionSummaryProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const nextTier = tiers.find((t) => t.threshold > count);
  
  // Sonho Grande thresholds
  const sonhoGrandeThreshold = type === 'inicio' ? 11 : 15;
  const remainingToSonhoGrande = Math.max(0, sonhoGrandeThreshold - count);
  const reachedSonhoGrande = count >= sonhoGrandeThreshold;

  const getMotivationalMessage = () => {
    if (reachedSonhoGrande) {
      return null; // Will show congratulations card instead
    }
    
    const percentage = (count / sonhoGrandeThreshold) * 100;
    
    if (percentage >= 80) {
      return `Faltam apenas ${remainingToSonhoGrande} ${type === 'inicio' ? 'início' : 'reinício'}${remainingToSonhoGrande > 1 ? 's' : ''} para o Sonho Grande! Você está quase lá! 🔥`;
    } else if (percentage >= 50) {
      return `Faltam ${remainingToSonhoGrande} ${type === 'inicio' ? 'inícios' : 'reinícios'} para o Sonho Grande. Continue assim! 💪`;
    } else if (percentage >= 25) {
      return `Faltam ${remainingToSonhoGrande} ${type === 'inicio' ? 'inícios' : 'reinícios'} para alcançar o Sonho Grande. Você consegue! 🚀`;
    } else {
      return `Faltam ${remainingToSonhoGrande} ${type === 'inicio' ? 'inícios' : 'reinícios'} para o Sonho Grande. Bora começar! ✨`;
    }
  };

  const motivationalMessage = getMotivationalMessage();

  return (
    <div className="space-y-4">
      {/* Congratulations Card - when Sonho Grande is reached */}
      {reachedSonhoGrande && (
        <div className="card-premium p-5 gradient-gold animate-pulse-success">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary-foreground/20">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-foreground">
                🎉 Parabéns! Sonho Grande alcançado!
              </h3>
              <p className="text-sm text-primary-foreground/90">
                Você bateu a meta máxima de {type === 'inicio' ? 'Inícios' : 'Reinícios'}! Incrível trabalho!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message - when still working towards Sonho Grande */}
      {motivationalMessage && (
        <div className="card-premium p-4 border-l-4 border-primary bg-primary/5">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-foreground">
              {motivationalMessage}
            </p>
          </div>
        </div>
      )}

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
