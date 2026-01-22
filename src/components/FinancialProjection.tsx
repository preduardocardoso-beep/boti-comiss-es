import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Target, TrendingUp, DollarSign, Rocket, Trophy, Star, ArrowRight, Sparkles, Percent, AlertTriangle, CheckCircle, PartyPopper, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import confetti from 'canvas-confetti';

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
  // Load saved values from localStorage
  const loadSavedValue = (key: string, defaultValue: number) => {
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : defaultValue;
  };

  // Editable fields with persistence
  const [metaFinanceira, setMetaFinanceira] = useState(() => loadSavedValue('projecao_metaFinanceira', 2000));
  const [valorPorInicio, setValorPorInicio] = useState(() => loadSavedValue('projecao_valorPorInicio', 45));
  const [valorPorReinicio, setValorPorReinicio] = useState(() => loadSavedValue('projecao_valorPorReinicio', 20));
  const [percentualInicio, setPercentualInicio] = useState(() => loadSavedValue('projecao_percentualInicio', 65));
  const [sonhoGrande, setSonhoGrande] = useState(() => loadSavedValue('projecao_sonhoGrande', 5000));
  const [hasShownCelebration, setHasShownCelebration] = useState(false);

  // Derived percentage
  const percentualReinicio = 100 - percentualInicio;
  const percentuaisValidos = percentualInicio >= 0 && percentualInicio <= 100;

  // Update values when tier values change
  useEffect(() => {
    if (inicioTierValue > 0) setValorPorInicio(inicioTierValue);
    if (reinicioTierValue > 0) setValorPorReinicio(reinicioTierValue);
  }, [inicioTierValue, reinicioTierValue]);

  // Celebration confetti effect
  const triggerCelebration = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#006B3F', '#FFD700', '#00A86B', '#FFFFFF'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#006B3F', '#FFD700', '#00A86B', '#FFFFFF'],
      });
    }, 250);
  }, []);

  // Calculations
  const calculations = useMemo(() => {
    // Valores projetados via percentual
    const valorViaInicio = metaFinanceira * (percentualInicio / 100);
    const valorViaReinicio = metaFinanceira * (percentualReinicio / 100);
    
    // Quantidade necessária para atingir meta com estratégia mesclada
    const iniciosNecessarios = valorPorInicio > 0 ? Math.ceil(valorViaInicio / valorPorInicio) : 0;
    const reiniciosNecessarios = valorPorReinicio > 0 ? Math.ceil(valorViaReinicio / valorPorReinicio) : 0;
    
    // Total projetado real (baseado nas quantidades arredondadas)
    const totalProjetado = (iniciosNecessarios * valorPorInicio) + (reiniciosNecessarios * valorPorReinicio);
    
    // Ganho atual
    const ganhoAtualInicios = currentInicios * valorPorInicio;
    const ganhoAtualReinicios = currentReinicios * valorPorReinicio;
    const ganhoAtual = ganhoAtualInicios + ganhoAtualReinicios;
    
    // Progresso até meta
    const faltaParaMeta = Math.max(0, metaFinanceira - ganhoAtual);
    const progressoPercentual = metaFinanceira > 0 ? Math.min(100, (ganhoAtual / metaFinanceira) * 100) : 0;
    
    // Inícios e reinícios restantes considerando atual
    const iniciosFaltando = Math.max(0, iniciosNecessarios - currentInicios);
    const reiniciosFaltando = Math.max(0, reiniciosNecessarios - currentReinicios);
    
    // Meta flags
    const metaAtingida = ganhoAtual >= metaFinanceira;
    const ultrapassouMeta = ganhoAtual > metaFinanceira;
    
    // Sonho Grande calculations
    const valorViaSonhoGrandeInicio = sonhoGrande * (percentualInicio / 100);
    const valorViaSonhoGrandeReinicio = sonhoGrande * (percentualReinicio / 100);
    const iniciosSonhoGrande = valorPorInicio > 0 ? Math.ceil(valorViaSonhoGrandeInicio / valorPorInicio) : 0;
    const reiniciosSonhoGrande = valorPorReinicio > 0 ? Math.ceil(valorViaSonhoGrandeReinicio / valorPorReinicio) : 0;
    const totalSonhoGrande = (iniciosSonhoGrande * valorPorInicio) + (reiniciosSonhoGrande * valorPorReinicio);
    const diferencaSonhoGrande = totalSonhoGrande - totalProjetado;
    
    // Projeção próximo nível
    const ganhoProximoNivel = (currentInicios * nextInicioTierValue) + (currentReinicios * nextReinicioTierValue);
    const ganhoProjetadoSonhoGrandeTier = (iniciosMeta * sonhoGrandeInicioValue) + (reiniciosMeta * sonhoGrandeReinicioValue);
    
    return {
      valorViaInicio,
      valorViaReinicio,
      iniciosNecessarios,
      reiniciosNecessarios,
      totalProjetado,
      ganhoAtualInicios,
      ganhoAtualReinicios,
      ganhoAtual,
      faltaParaMeta,
      progressoPercentual,
      iniciosFaltando,
      reiniciosFaltando,
      metaAtingida,
      ultrapassouMeta,
      iniciosSonhoGrande,
      reiniciosSonhoGrande,
      totalSonhoGrande,
      diferencaSonhoGrande,
      ganhoProximoNivel,
      ganhoProjetadoSonhoGrandeTier,
    };
  }, [
    currentInicios, 
    currentReinicios, 
    valorPorInicio, 
    valorPorReinicio, 
    metaFinanceira,
    percentualInicio,
    percentualReinicio,
    sonhoGrande,
    iniciosMeta,
    reiniciosMeta,
    nextInicioTierValue,
    nextReinicioTierValue,
    sonhoGrandeInicioValue,
    sonhoGrandeReinicioValue,
  ]);

  // Trigger celebration when goal is achieved
  useEffect(() => {
    if (calculations.metaAtingida && !hasShownCelebration) {
      triggerCelebration();
      setHasShownCelebration(true);
    }
  }, [calculations.metaAtingida, hasShownCelebration, triggerCelebration]);

  // Reset celebration flag when meta changes significantly
  useEffect(() => {
    if (!calculations.metaAtingida) {
      setHasShownCelebration(false);
    }
  }, [calculations.metaAtingida]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getMotivationalMessage = () => {
    const { progressoPercentual, faltaParaMeta, iniciosFaltando, reiniciosFaltando, metaAtingida, ultrapassouMeta, totalSonhoGrande } = calculations;
    
    if (ultrapassouMeta) {
      return {
        message: "🏆 Incrível! Você ULTRAPASSOU sua meta financeira!",
        type: "success"
      };
    }
    
    if (metaAtingida) {
      return {
        message: "🎉 Parabéns! Você alcançou sua meta financeira!",
        type: "success"
      };
    }
    
    if (progressoPercentual >= 80) {
      return {
        message: `🔥 Você está a ${formatCurrency(faltaParaMeta)} de alcançar sua meta! Faltam ${iniciosFaltando} inícios e ${reiniciosFaltando} reinícios!`,
        type: "hot"
      };
    }
    
    if (progressoPercentual >= 50) {
      return {
        message: `💪 Metade do caminho! Com ${percentualInicio}% Início e ${percentualReinicio}% Reinício, você alcança ${formatCurrency(calculations.totalProjetado)}`,
        type: "progress"
      };
    }
    
    return {
      message: `🚀 Estratégia equilibrada: ${percentualInicio}% Início / ${percentualReinicio}% Reinício. Sonho Grande renderá ${formatCurrency(totalSonhoGrande)}!`,
      type: "start"
    };
  };

  const motivational = getMotivationalMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-gold">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Projeção Financeira</h2>
            <p className="text-sm text-muted-foreground">Estratégia com percentual Início / Reinício</p>
          </div>
        </div>
        <Button
          onClick={() => {
            localStorage.setItem('projecao_metaFinanceira', metaFinanceira.toString());
            localStorage.setItem('projecao_valorPorInicio', valorPorInicio.toString());
            localStorage.setItem('projecao_valorPorReinicio', valorPorReinicio.toString());
            localStorage.setItem('projecao_percentualInicio', percentualInicio.toString());
            localStorage.setItem('projecao_sonhoGrande', sonhoGrande.toString());
            toast.success('Alterações salvas com sucesso!');
          }}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Celebration Banner when goal achieved */}
      {calculations.metaAtingida && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 via-primary to-green-600 p-6 animate-scale-in">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZjIwIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex flex-col items-center gap-3 text-white">
            <div className="flex items-center gap-2 animate-fade-in">
              <PartyPopper className="h-8 w-8 animate-bounce" />
              <Trophy className="h-10 w-10 text-yellow-300 drop-shadow-lg animate-pulse" />
              <PartyPopper className="h-8 w-8 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <h3 className="text-2xl font-bold text-center drop-shadow-md">
              {calculations.ultrapassouMeta ? '🏆 META ULTRAPASSADA!' : '🎉 META ATINGIDA!'}
            </h3>
            <p className="text-lg font-medium text-white/90 text-center">
              Você alcançou {formatCurrency(calculations.ganhoAtual)} de {formatCurrency(metaFinanceira)}!
            </p>
            {calculations.ultrapassouMeta && (
              <div className="mt-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm animate-fade-in">
                <span className="font-semibold">+{formatCurrency(calculations.ganhoAtual - metaFinanceira)} acima da meta! 🚀</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Motivational Banner (only when goal not achieved) */}
      {!calculations.metaAtingida && (
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          motivational.type === 'hot' ? 'bg-orange-500/10 border border-orange-500/30' :
          motivational.type === 'progress' ? 'bg-blue-500/10 border border-blue-500/30' :
          'bg-primary/10 border border-primary/30'
        }`}>
          <p className="text-center font-medium text-foreground">{motivational.message}</p>
        </div>
      )}

      {/* Percentage Control */}
      <Card className="card-premium border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            Distribuição Percentual da Estratégia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Início: <strong>{percentualInicio}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Reinício: <strong>{percentualReinicio}%</strong></span>
            </div>
          </div>
          
          <Slider
            value={[percentualInicio]}
            onValueChange={(value) => setPercentualInicio(value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100% Reinício</span>
            <span>Equilibrado</span>
            <span>100% Início</span>
          </div>
          
          {percentuaisValidos ? (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Soma dos percentuais = 100% ✓</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Erro: percentuais devem somar 100%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Controls Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Meta Financeira
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
            <p className="text-xs text-muted-foreground mt-1">Padrão: R$ 45,00</p>
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
            <p className="text-xs text-muted-foreground mt-1">Padrão: R$ 20,00</p>
          </CardContent>
        </Card>

      </div>

      {/* Calculated Values Panel */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Cálculos Automáticos (Meta: {formatCurrency(metaFinanceira)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">Valor via Início ({percentualInicio}%)</p>
              <p className="text-xl font-bold text-green-500">{formatCurrency(calculations.valorViaInicio)}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-muted-foreground mb-1">Valor via Reinício ({percentualReinicio}%)</p>
              <p className="text-xl font-bold text-blue-500">{formatCurrency(calculations.valorViaReinicio)}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">Inícios Necessários</p>
              <p className="text-xl font-bold text-green-500">{calculations.iniciosNecessarios}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-muted-foreground mb-1">Reinícios Necessários</p>
              <p className="text-xl font-bold text-blue-500">{calculations.reiniciosNecessarios}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Dashboard */}
      <Card className="card-premium overflow-hidden">
        <div className={`h-2 ${calculations.ultrapassouMeta ? 'bg-gradient-to-r from-green-500 to-gold' : calculations.metaAtingida ? 'bg-green-500' : 'gradient-primary'}`} />
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
              <span>Atual: {formatCurrency(calculations.ganhoAtual)}</span>
              <span>Meta: {formatCurrency(metaFinanceira)}</span>
            </div>
            
            {calculations.ultrapassouMeta && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-center">
                <p className="text-green-500 font-medium">🎯 Meta ultrapassada em {formatCurrency(calculations.ganhoAtual - metaFinanceira)}!</p>
              </div>
            )}
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
              <span className="text-xs text-muted-foreground">Total Projetado</span>
            </div>
            <p className="text-xl font-bold text-primary">{formatCurrency(calculations.totalProjetado)}</p>
            <p className="text-xs text-muted-foreground mt-1">Com estratégia atual</p>
          </CardContent>
        </Card>

      </div>

      {/* Actions Needed Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card-premium border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inícios Restantes</p>
                <p className="text-3xl font-bold text-foreground">{calculations.iniciosFaltando}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  de {calculations.iniciosNecessarios} necessários ({percentualInicio}%)
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
                <p className="text-sm text-muted-foreground mb-1">Reinícios Restantes</p>
                <p className="text-3xl font-bold text-foreground">{calculations.reiniciosFaltando}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  de {calculations.reiniciosNecessarios} necessários ({percentualReinicio}%)
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Summary Message */}
      <Card className="card-premium bg-gradient-to-r from-primary/5 to-gold/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-foreground">
              Com <span className="text-green-500 font-bold">{percentualInicio}% Início</span> e{' '}
              <span className="text-blue-500 font-bold">{percentualReinicio}% Reinício</span>, você alcança{' '}
              <span className="text-primary font-bold">{formatCurrency(calculations.totalProjetado)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {calculations.metaAtingida ? (
                <>🏆 Meta atingida! Continue para alcançar o Sonho Grande de {formatCurrency(sonhoGrande)}</>
              ) : (
                <>Faltam <span className="text-green-500 font-medium">{calculations.iniciosFaltando} inícios</span> e{' '}
                <span className="text-blue-500 font-medium">{calculations.reiniciosFaltando} reinícios</span> para bater a meta</>
              )}
            </p>
            <p className="text-xs text-muted-foreground italic">
              ⚡ Estratégia equilibrada e sustentável ativada
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
