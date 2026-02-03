import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCommission } from '@/hooks/useCommission';
import { Dashboard } from '@/components/Dashboard';
import { OrderForm } from '@/components/OrderForm';
import { OrderList } from '@/components/OrderList';
import { CommissionSummary } from '@/components/CommissionSummary';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ExportButton } from '@/components/ExportButton';
import { FinancialProjection } from '@/components/FinancialProjection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, Users, RefreshCw, Settings, Calculator, CalendarDays } from 'lucide-react';

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

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  if (authLoading || dataLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/ciclos')} className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Ciclos</span>
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
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

        <Tabs defaultValue="inicios" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
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
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuração</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inicios" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OrderForm onSubmit={addInicio} type="inicio" />
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
              <OrderForm onSubmit={addReinicio} type="reinicio" />
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

          <TabsContent value="config">
            <ConfigPanel 
              config={data.config}
              onUpdateConfig={updateConfig}
              onResetCycle={resetCycle}
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
