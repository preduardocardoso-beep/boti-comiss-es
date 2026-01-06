import { useState, useEffect } from 'react';
import { Settings, Target, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CycleConfig, CommissionTier } from '@/types/commission';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfigPanelProps {
  config: CycleConfig;
  onUpdateConfig: (config: CycleConfig) => void;
  onResetCycle: () => void;
  iniciosTiers: CommissionTier[];
  reiniciosTiers: CommissionTier[];
}

export const ConfigPanel = ({
  config,
  onUpdateConfig,
  onResetCycle,
  iniciosTiers,
  reiniciosTiers,
}: ConfigPanelProps) => {
  const [iniciosMeta, setIniciosMeta] = useState(config.iniciosMeta.toString());
  const [reiniciosMeta, setReiniciosMeta] = useState(config.reiniciosMeta.toString());
  
  // Thresholds for Inícios
  const [inicioGatilho, setInicioGatilho] = useState(config.inicioThresholds.gatilho.toString());
  const [inicioMetaThreshold, setInicioMetaThreshold] = useState(config.inicioThresholds.meta.toString());
  const [inicioSuperMeta, setInicioSuperMeta] = useState(config.inicioThresholds.superMeta.toString());
  
  // Thresholds for Reinícios
  const [reinicioGatilho, setReinicioGatilho] = useState(config.reinicioThresholds.gatilho.toString());
  const [reinicioMetaThreshold, setReinicioMetaThreshold] = useState(config.reinicioThresholds.meta.toString());
  const [reinicioSuperMeta, setReinicioSuperMeta] = useState(config.reinicioThresholds.superMeta.toString());

  useEffect(() => {
    setIniciosMeta(config.iniciosMeta.toString());
    setReiniciosMeta(config.reiniciosMeta.toString());
    setInicioGatilho(config.inicioThresholds.gatilho.toString());
    setInicioMetaThreshold(config.inicioThresholds.meta.toString());
    setInicioSuperMeta(config.inicioThresholds.superMeta.toString());
    setReinicioGatilho(config.reinicioThresholds.gatilho.toString());
    setReinicioMetaThreshold(config.reinicioThresholds.meta.toString());
    setReinicioSuperMeta(config.reinicioThresholds.superMeta.toString());
  }, [config]);

  const handleSave = () => {
    const newConfig: CycleConfig = {
      iniciosMeta: Math.max(1, parseInt(iniciosMeta) || 25),
      reiniciosMeta: Math.max(1, parseInt(reiniciosMeta) || 15),
      inicioThresholds: {
        gatilho: Math.max(1, parseInt(inicioGatilho) || 4),
        meta: Math.max(1, parseInt(inicioMetaThreshold) || 7),
        superMeta: Math.max(1, parseInt(inicioSuperMeta) || 9),
      },
      reinicioThresholds: {
        gatilho: Math.max(1, parseInt(reinicioGatilho) || 4),
        meta: Math.max(1, parseInt(reinicioMetaThreshold) || 9),
        superMeta: Math.max(1, parseInt(reinicioSuperMeta) || 13),
      },
    };
    
    onUpdateConfig(newConfig);
    
    toast({
      title: "Configurações salvas!",
      description: "As metas e gatilhos do ciclo foram atualizados.",
    });
  };

  const handleReset = () => {
    onResetCycle();
    toast({
      title: "Ciclo reiniciado!",
      description: "Todos os registros foram removidos.",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      {/* Metas do Ciclo */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-primary" />
          Metas do Ciclo (Sonho Grande)
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Meta de Inícios
            </label>
            <Input
              type="number"
              min="1"
              value={iniciosMeta}
              onChange={(e) => setIniciosMeta(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Meta de Reinícios
            </label>
            <Input
              type="number"
              min="1"
              value={reiniciosMeta}
              onChange={(e) => setReiniciosMeta(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Gatilhos Inícios */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gatilhos - Inícios
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Gatilho (≥)</label>
            <Input
              type="number"
              min="1"
              value={inicioGatilho}
              onChange={(e) => setInicioGatilho(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(10)}/un</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Meta (≥)</label>
            <Input
              type="number"
              min="1"
              value={inicioMetaThreshold}
              onChange={(e) => setInicioMetaThreshold(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(20)}/un</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Super Meta (≥)</label>
            <Input
              type="number"
              min="1"
              value={inicioSuperMeta}
              onChange={(e) => setInicioSuperMeta(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(35)}/un</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Sonho Grande = Meta do Ciclo ({iniciosMeta}) → {formatCurrency(45)}/un
        </p>
      </div>

      {/* Gatilhos Reinícios */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gatilhos - Reinícios
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Gatilho (≥)</label>
            <Input
              type="number"
              min="1"
              value={reinicioGatilho}
              onChange={(e) => setReinicioGatilho(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(5)}/un</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Meta (≥)</label>
            <Input
              type="number"
              min="1"
              value={reinicioMetaThreshold}
              onChange={(e) => setReinicioMetaThreshold(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(10)}/un</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Super Meta (≥)</label>
            <Input
              type="number"
              min="1"
              value={reinicioSuperMeta}
              onChange={(e) => setReinicioSuperMeta(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-primary font-medium">{formatCurrency(15)}/un</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Sonho Grande = Meta do Ciclo ({reiniciosMeta}) → {formatCurrency(20)}/un
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full h-11">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações
      </Button>

      {/* Current Tiers Display */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Resumo Gatilhos - Inícios
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {iniciosTiers.slice(1).map((tier) => (
            <div key={tier.name} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">{tier.name}</p>
              <p className="text-sm font-medium text-foreground">≥ {tier.threshold}</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(tier.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Resumo Gatilhos - Reinícios
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {reiniciosTiers.slice(1).map((tier) => (
            <div key={tier.name} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">{tier.name}</p>
              <p className="text-sm font-medium text-foreground">≥ {tier.threshold}</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(tier.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full h-11 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Ciclo
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Reiniciar Ciclo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá apagar todos os registros de inícios e reinícios do ciclo atual. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              Sim, reiniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
