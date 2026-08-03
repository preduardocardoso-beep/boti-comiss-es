import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCommission } from '@/hooks/useCommission';
import { useCycleHistory } from '@/hooks/useCycleHistory';
import { getCurrentCycle, getClosingCycle } from '@/lib/getCurrentCycle';
import { Dashboard } from '@/components/Dashboard';
import { OrderForm } from '@/components/OrderForm';
import { OrderList } from '@/components/OrderList';
import { CommissionSummary } from '@/components/CommissionSummary';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ExportButton } from '@/components/ExportButton';
import { FinancialProjection } from '@/components/FinancialProjection';
import { CycleHistoryPanel } from '@/components/CycleHistoryPanel';
import { WeeklyGoalPanel } from '@/components/WeeklyGoalPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, Users, RefreshCw, Settings, Calculator, CalendarDays, History, CalendarRange, Sparkles } from 'lucide-react';
import premiumHero from '@/assets/premium-hero.jpg';


const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    data, 
    stats, 
    loading: dataLoading, 
    addInicio, 
    addReinicio, 
    removeInicio, 
    removeReinicio,
    updateConfig,
    resetCycle
  } = useCommission();
  const { history, loading: historyLoading, saveCycleSnapshot, deleteHistory } = useCycleHistory();
  const currentCycle = getCurrentCycle();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('rv_active_tab') || 'inicios';
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('rv_active_tab', value);
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (!user && !authLoading) {
    return null;
  }

  if (authLoading || dataLoading || historyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Get next tier values for projection
  const getNextTierValue = (tiers: { threshold: number; value: number }[], currentCount: number) => {
    const nextTier = tiers.find(t => t.threshold > currentCount);
    return nextTier ? nextTier.value : tiers[tiers.length - 1]?.value || 0;
  };

  const nextInicioTierValue = getNextTierValue(stats.iniciosTiers, data.inicios.length);
  const nextReinicioTierValue = getNextTierValue(stats.reiniciosTiers, data.reinicios.length);
  
  // Sonho Grande values (last tier)
  const sonhoGrandeInicioValue = stats.iniciosTiers[stats.iniciosTiers.length - 1]?.value || 45;
  const sonhoGrandeReinicioValue = stats.reiniciosTiers[stats.reiniciosTiers.length - 1]?.value || 20;

  const handleSaveCycleBeforeReset = async () => {
    const closingCycle = getClosingCycle();
    const cycleName = closingCycle?.ciclo || currentCycle?.ciclo || `Ciclo ${new Date().toLocaleDateString('pt-BR')}`;
    await saveCycleSnapshot({
      cycleName,
      iniciosCount: stats.iniciosCount,
      reiniciosCount: stats.reiniciosCount,
      iniciosCommission: stats.iniciosCommission,
      reiniciosCommission: stats.reiniciosCommission,
      totalCommission: stats.totalCommission,
      iniciosTierName: stats.iniciosTier.name,
      reiniciosTierName: stats.reiniciosTier.name,
      iniciosData: data.inicios,
      reiniciosData: data.reinicios,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative sm:sticky sm:top-0 sm:z-50 border-b border-border bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <ExportButton 
            inicios={data.inicios}
            reinicios={data.reinicios}
            iniciosTiers={stats.iniciosTiers}
            reiniciosTiers={stats.reiniciosTiers}
            stats={{
              iniciosCount: stats.iniciosCount,
              reiniciosCount: stats.reiniciosCount,
              iniciosCommission: stats.iniciosCommission,
              reiniciosCommission: stats.reiniciosCommission,
              totalCommission: stats.totalCommission,
              iniciosTierName: stats.iniciosTier.name,
              reiniciosTierName: stats.reiniciosTier.name,
            }}
            config={{
              iniciosMeta: data.config.iniciosMeta,
              reiniciosMeta: data.config.reiniciosMeta,
            }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/ciclos')} className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Ciclos</span>
            </Button>
            <span className="text-sm text-muted-foreground hidden md:block truncate max-w-[200px]">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Premium brand hero */}
        <section className="hero-premium shadow-gold">
          <img
            src={premiumHero}
            alt="Fundo premium com tons vinho, dourado e cores das marcas do Grupo Boticário"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={640}
          />
          <div className="brand-strip absolute inset-x-0 top-0 h-1.5 z-20" />
          <div className="relative z-10 px-5 sm:px-10 py-8 sm:py-12">
            <p className="flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Revendedores
            </p>
            <h1 className="mt-2 text-3xl sm:text-5xl font-bold leading-tight text-luxe">
              Grupo Boticário
            </h1>
            <div className="hero-gold-line my-4 max-w-xs" />
            <p className="max-w-lg text-sm sm:text-base text-white/80">
              Painel premium de resultados — acompanhe inícios, reinícios e sua remuneração
              variável com precisão a cada ciclo.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-white/70">
              {['oBoticário', 'Eudora', 'Quem Disse, Berenice?', 'O.U.i', 'Australian Gold'].map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-gold/40 bg-white/5 px-3 py-1 backdrop-blur-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Dashboard

          iniciosCount={stats.iniciosCount}
          reiniciosCount={stats.reiniciosCount}
          iniciosCommission={stats.iniciosCommission}
          reiniciosCommission={stats.reiniciosCommission}
          totalCommission={stats.totalCommission}
          iniciosProgress={stats.iniciosProgress}
          reiniciosProgress={stats.reiniciosProgress}
          iniciosTierName={stats.iniciosTier.name}
          reiniciosTierName={stats.reiniciosTier.name}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="inicios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Inícios</span>
            </TabsTrigger>
            <TabsTrigger value="reinicios" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reinícios</span>
            </TabsTrigger>
            <TabsTrigger value="projecao" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Projeção</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuração</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inicios" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OrderForm onSubmit={addInicio} type="inicio" existingOrders={[...data.inicios, ...data.reinicios]} />
              <CommissionSummary 
                count={data.inicios.length}
                tier={stats.iniciosTier}
                tiers={stats.iniciosTiers}
                commission={stats.iniciosCommission}
                type="inicio"
                cycleMeta={data.config.iniciosMeta}
              />
            </div>
            <OrderList orders={data.inicios} onRemove={removeInicio} type="inicio" />
          </TabsContent>

          <TabsContent value="reinicios" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OrderForm onSubmit={addReinicio} type="reinicio" existingOrders={[...data.inicios, ...data.reinicios]} />
              <CommissionSummary 
                count={data.reinicios.length}
                tier={stats.reiniciosTier}
                tiers={stats.reiniciosTiers}
                commission={stats.reiniciosCommission}
                type="reinicio"
                cycleMeta={data.config.reiniciosMeta}
              />
            </div>
            <OrderList orders={data.reinicios} onRemove={removeReinicio} type="reinicio" />
          </TabsContent>

          <TabsContent value="projecao" className="space-y-6">
            <FinancialProjection
              currentInicios={data.inicios.length}
              currentReinicios={data.reinicios.length}
              inicioTierValue={stats.iniciosTier.value}
              reinicioTierValue={stats.reiniciosTier.value}
              iniciosMeta={data.config.iniciosMeta}
              reiniciosMeta={data.config.reiniciosMeta}
              nextInicioTierValue={nextInicioTierValue}
              nextReinicioTierValue={nextReinicioTierValue}
              sonhoGrandeInicioValue={sonhoGrandeInicioValue}
              sonhoGrandeReinicioValue={sonhoGrandeReinicioValue}
            />
          </TabsContent>

          <TabsContent value="historico">
            <CycleHistoryPanel history={history} onDelete={deleteHistory} />
          </TabsContent>

          <TabsContent value="config">
            <ConfigPanel 
              config={data.config}
              onUpdateConfig={updateConfig}
              onResetCycle={resetCycle}
              onSaveCycleBeforeReset={handleSaveCycleBeforeReset}
              iniciosTiers={stats.iniciosTiers}
              reiniciosTiers={stats.reiniciosTiers}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
