import { History, Trash2, Users, RefreshCw, Award } from 'lucide-react';
import { CycleHistoryRecord } from '@/hooks/useCycleHistory';
import { Button } from '@/components/ui/button';
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

interface CycleHistoryPanelProps {
  history: CycleHistoryRecord[];
  onDelete: (id: string) => void;
}

export const CycleHistoryPanel = ({ history, onDelete }: CycleHistoryPanelProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (history.length === 0) {
    return (
      <div className="card-premium p-8 text-center">
        <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum histórico</h3>
        <p className="text-sm text-muted-foreground">
          Os relatórios dos ciclos anteriores aparecerão aqui após você reiniciar um ciclo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <div key={record.id} className="card-premium p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-lg bg-primary/10">
                <span className="text-sm font-bold text-primary">{record.cycle_name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(record.created_at)}</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar relatório?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O relatório do {record.cycle_name} será removido permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(record.id)} className="bg-destructive hover:bg-destructive/90">
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Inícios</p>
                <p className="text-sm font-bold text-foreground">{record.inicios_count}</p>
                <p className="text-xs text-primary">{formatCurrency(record.inicios_commission)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <RefreshCw className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Reinícios</p>
                <p className="text-sm font-bold text-foreground">{record.reinicios_count}</p>
                <p className="text-xs text-primary">{formatCurrency(record.reinicios_commission)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Award className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-primary">{formatCurrency(record.total_commission)}</p>
              </div>
            </div>
          </div>

          {record.inicios_tier_name && record.reinicios_tier_name && (
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary">Inícios: {record.inicios_tier_name}</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary">Reinícios: {record.reinicios_tier_name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
