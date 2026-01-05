import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw, Settings, LogOut, Loader2 } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { OrderForm } from '@/components/OrderForm';
import { OrderList } from '@/components/OrderList';
import { CommissionSummary } from '@/components/CommissionSummary';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ExportButton } from '@/components/ExportButton';
import { useCommission } from '@/hooks/useCommission';
import { useAuth } from '@/hooks/useAuth';

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
    resetCycle,
  } = useCommission();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RV</span>
            </div>
            <span className="font-semibold text-foreground">Promotor</span>
            <div className="ml-auto flex items-center gap-3">
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
                config={data.config}
              />
              <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-6 space-y-6">
        {/* Dashboard */}
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

        {/* Tabs */}
        <Tabs defaultValue="inicios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50">
            <TabsTrigger 
              value="inicios" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full font-medium"
            >
              <Users className="h-4 w-4 mr-2" />
              Inícios
            </TabsTrigger>
            <TabsTrigger 
              value="reinicios"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reinícios
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full font-medium"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuração
            </TabsTrigger>
          </TabsList>

          {/* Inícios Tab */}
          <TabsContent value="inicios" className="space-y-6 animate-slide-up">
            <OrderForm onSubmit={addInicio} type="inicio" />
            <div className="grid lg:grid-cols-2 gap-6">
              <OrderList
                orders={data.inicios}
                onRemove={removeInicio}
                type="inicio"
              />
              <CommissionSummary
                count={stats.iniciosCount}
                tier={stats.iniciosTier}
                commission={stats.iniciosCommission}
                tiers={stats.iniciosTiers}
                type="inicio"
              />
            </div>
          </TabsContent>

          {/* Reinícios Tab */}
          <TabsContent value="reinicios" className="space-y-6 animate-slide-up">
            <OrderForm onSubmit={addReinicio} type="reinicio" />
            <div className="grid lg:grid-cols-2 gap-6">
              <OrderList
                orders={data.reinicios}
                onRemove={removeReinicio}
                type="reinicio"
              />
              <CommissionSummary
                count={stats.reiniciosCount}
                tier={stats.reiniciosTier}
                commission={stats.reiniciosCommission}
                tiers={stats.reiniciosTiers}
                type="reinicio"
              />
            </div>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="animate-slide-up">
            <ConfigPanel
              config={data.config}
              onUpdateConfig={updateConfig}
              onResetCycle={resetCycle}
              iniciosTiers={stats.iniciosTiers}
              reiniciosTiers={stats.reiniciosTiers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
