import { useState, useMemo, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Rocket, Trophy, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialProjectionProps {
  currentInicios: number;
  currentReinicios: number;
  inicioTierValue: number;
  reinicioTierValue: number;
  iniciosMeta: number;
  reiniciosMeta: number;
  nextInicioTierValue: number;
  nextReinicioTierValue: number;
  sonhoGrandeInicioValue: number;
  sonhoGrandeReinicioValue: number;
}

export const FinancialProjection = ({
  currentInicios,
  currentReinicios,
  inicioTierValue,
  reinicioTierValue,
  iniciosMeta,
  reiniciosMeta,
  nextInicioTierValue,
  nextReinicioTierValue,
  sonhoGrandeInicioValue,
  sonhoGrandeReinicioValue,
}: FinancialProjectionProps) => {
  // Editable fields
  const [metaFinanceira, setMetaFinanceira] = useState(3000);
  const [valorPorInicio, setValorPorInicio] = useState(inicioTierValue);
  const [valorPorReinicio, setValorPorReinicio] = useState(reinicioTierValue);

  // Update values when tier values change
  useEffect(() => {
    setValorPorInicio(inicioTierValue);
    setValorPorReinicio(reinicioTierValue);
  }, [inicioTierValue, reinicioTierValue]);

  // Calculations
  const calculations = useMemo(() => {
    const ganhoAtualInicios = currentInicios * valorPorInicio;
    const ganhoAtualReinicios = currentReinicios * valorPorReinicio;
    const ganhoAtual = ganhoAtualInicios + ganhoAtualReinicios;
    
    // Calculate remaining to reach goal
    const faltaParaMeta = Math.max(0, metaFinanceira - ganhoAtual);
    
    // Calculate needed actions to reach goal
    const iniciosNecessarios = valorPorInicio > 0 ? Math.ceil(faltaParaMeta / valorPorInicio) : 0;
    const reiniciosNecessarios = valorPorReinicio > 0 ? Math.ceil(faltaParaMeta / valorPorReinicio) : 0;
    
    // Progress percentage
    const progressoPercentual = metaFinanceira > 0 ? Math.min(100, (ganhoAtual / metaFinanceira) * 100) : 0;
    
    // Projected earnings at Sonho Grande
    const ganhoProjetadoSonhoGrande = (iniciosMeta * sonhoGrandeInicioValue) + (reiniciosMeta * sonhoGrandeReinicioValue);
    
    // Next tier projected gains
    const ganhoProximoNivel = (currentInicios * nextInicioTierValue) + (currentReinicios * nextReinicioTierValue);
    
    // Meta achieved flags
    const metaAtingida = ganhoAtual >= metaFinanceira;
    
    return {
      ganhoAtualInicios,
      ganhoAtualReinicios,
      ganhoAtual,
      faltaParaMeta,
      iniciosNecessarios,
      reiniciosNecessarios,
      progressoPercentual,
      ganhoProjetadoSonhoGrande,
      ganhoProximoNivel,
      metaAtingida,
    };
  }, [
    currentInicios, 
    currentReinicios, 
    valorPorInicio, 
    valorPorReinicio, 
    metaFinanceira,
    iniciosMeta,
    reiniciosMeta,
    nextInicioTierValue,
    nextReinicioTierValue,
    sonhoGrandeInicioValue,
    sonhoGrandeReinicioValue,
  ]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getMotivationalMessage = () => {
    const { progressoPercentual, faltaParaMeta, iniciosNecessarios, metaAtingida, ganhoProjetadoSonhoGrande } = calculations;
    
    if (metaAtingida) {
      return {
        message: "🎉 Parabéns! Você alcançou sua meta financeira!",
        type: "success"
      };
    }
    
    if (progressoPercentual >= 80) {
      return {
        message: `🔥 Você está a ${formatCurrency(faltaParaMeta)} de alcançar sua meta! Só mais ${iniciosNecessarios} inícios!`,
        type: "hot"
      };
    }
    
    if (progressoPercentual >= 50) {
      return {
        message: `💪 Metade do caminho! Faltam ${formatCurrency(faltaParaMeta)} para sua meta.`,
        type: "progress"
      };
    }
    
    return {
      message: `🚀 Se continuar nesse ritmo, seu Sonho Grande renderá ${formatCurrency(ganhoProjetadoSonhoGrande)}!`,
      type: "start"
    };
  };

  const motivational = getMotivationalMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-gold">
          <Target className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Projeção Financeira</h2>
          <p className="text-sm text-muted-foreground">Mapa de metas e ganhos</p>
        </div>
      </div>

      {/* Motivational Banner */}
      <div className={`p-4 rounded-xl ${
        motivational.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
        motivational.type === 'hot' ? 'bg-orange-500/10 border border-orange-500/30' :
        motivational.type === 'progress' ? 'bg-blue-500/10 border border-blue-500/30' :
        'bg-primary/10 border border-primary/30'
      }`}>
        <p className="text-center font-medium text-foreground">{motivational.message}</p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Meta Financeira Final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={metaFinanceira}
                onChange={(e) => setMetaFinanceira(Number(e.target.value))}
                className="pl-10 text-lg font-semibold"
                min={0}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Valor por Início
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={valorPorInicio}
                onChange={(e) => setValorPorInicio(Number(e.target.value))}
                className="pl-10 text-lg font-semibold"
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Atualiza conforme faixa atual</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Valor por Reinício
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={valorPorReinicio}
                onChange={(e) => setValorPorReinicio(Number(e.target.value))}
                className="pl-10 text-lg font-semibold"
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Atualiza conforme faixa atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Dashboard */}
      <Card className="card-premium overflow-hidden">
        <div className={`h-1 ${calculations.metaAtingida ? 'bg-green-500' : 'gradient-primary'}`} />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progresso até a Meta</span>
              <span className={`text-sm font-bold ${calculations.metaAtingida ? 'text-green-500' : 'text-primary'}`}>
                {calculations.progressoPercentual.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={calculations.progressoPercentual} 
              className={`h-4 ${calculations.metaAtingida ? '[&>div]:bg-green-500' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(calculations.ganhoAtual)}</span>
              <span>{formatCurrency(metaFinanceira)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Ganho Atual</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(calculations.ganhoAtual)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentInicios} inícios + {currentReinicios} reinícios
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Falta para Meta</span>
            </div>
            <p className={`text-xl font-bold ${calculations.metaAtingida ? 'text-green-500' : 'text-foreground'}`}>
              {calculations.metaAtingida ? '✓ Atingida!' : formatCurrency(calculations.faltaParaMeta)}
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Próximo Nível</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(calculations.ganhoProximoNivel)}</p>
            <p className="text-xs text-muted-foreground mt-1">Ganho projetado</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">Sonho Grande</span>
            </div>
            <p className="text-xl font-bold text-gradient-gold">{formatCurrency(calculations.ganhoProjetadoSonhoGrande)}</p>
            <p className="text-xs text-muted-foreground mt-1">Meta máxima</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Needed Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card-premium border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inícios Necessários</p>
                <p className="text-3xl font-bold text-foreground">{calculations.iniciosNecessarios}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  para alcançar {formatCurrency(metaFinanceira)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reinícios Necessários</p>
                <p className="text-3xl font-bold text-foreground">{calculations.reiniciosNecessarios}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  para alcançar {formatCurrency(metaFinanceira)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <ArrowRight className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Projection Table */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            Projeção por Faixa de Comissão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Faixa</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Valor/Início</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Valor/Reinício</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Projeção Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-medium">Gatilho</td>
                  <td className="text-right text-foreground">R$ 10,00</td>
                  <td className="text-right text-foreground">R$ 5,00</td>
                  <td className="text-right text-foreground font-medium">
                    {formatCurrency((iniciosMeta * 10) + (reiniciosMeta * 5))}
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-medium">Meta</td>
                  <td className="text-right text-foreground">R$ 20,00</td>
                  <td className="text-right text-foreground">R$ 10,00</td>
                  <td className="text-right text-foreground font-medium">
                    {formatCurrency((iniciosMeta * 20) + (reiniciosMeta * 10))}
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-medium">Super Meta</td>
                  <td className="text-right text-foreground">R$ 35,00</td>
                  <td className="text-right text-foreground">R$ 15,00</td>
                  <td className="text-right text-foreground font-medium">
                    {formatCurrency((iniciosMeta * 35) + (reiniciosMeta * 15))}
                  </td>
                </tr>
                <tr className="bg-gold/10">
                  <td className="py-3 font-bold text-gold flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Sonho Grande
                  </td>
                  <td className="text-right text-gold font-medium">R$ 45,00</td>
                  <td className="text-right text-gold font-medium">R$ 20,00</td>
                  <td className="text-right text-gold font-bold">
                    {formatCurrency(calculations.ganhoProjetadoSonhoGrande)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Message */}
      <Card className="card-premium bg-gradient-to-r from-primary/5 to-gold/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground">
              {calculations.metaAtingida ? (
                <>🏆 Você já alcançou sua meta de {formatCurrency(metaFinanceira)}!</>
              ) : (
                <>Faltam apenas <span className="text-primary font-bold">{calculations.iniciosNecessarios} inícios</span> para chegar aos {formatCurrency(metaFinanceira)}</>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Ganho atual: {formatCurrency(calculations.ganhoAtual)} | 
              Meta Sonho Grande: {formatCurrency(calculations.ganhoProjetadoSonhoGrande)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
