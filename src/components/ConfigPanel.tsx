import { useState, useEffect } from 'react';
import { Settings, Target, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CycleConfig, getIniciosTiers, getReiniciosTiers, CommissionTier } from '@/types/commission';
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

  const handleSave = () => {
    const newInicios = parseInt(iniciosMeta) || 25;
    const newReinicios = parseInt(reiniciosMeta) || 15;
    
    onUpdateConfig({
      iniciosMeta: Math.max(1, newInicios),
      reiniciosMeta: Math.max(1, newReinicios),
    });
    
    toast({
      title: "Configurações salvas!",
      description: "As metas do ciclo foram atualizadas.",
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
      {/* Config Form */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-primary" />
          Metas do Ciclo
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
        
        <Button onClick={handleSave} className="w-full mt-6 h-11">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Fixed Tiers Info */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gatilhos - Inícios (Sonho Grande = Meta)
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
          Gatilhos - Reinícios (Sonho Grande = Meta)
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
