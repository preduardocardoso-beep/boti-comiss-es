import { useState } from 'react';
import { History, Trash2, Users, RefreshCw, Award, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { CycleHistoryRecord } from '@/hooks/useCycleHistory';
import { Button } from '@/components/ui/button';
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

interface CycleHistoryPanelProps {
  history: CycleHistoryRecord[];
  onDelete: (id: string) => void;
}

interface OrderItem {
  clientName?: string;
  orderNumber?: string;
  resellerCode?: string;
  date?: string;
}

export const CycleHistoryPanel = ({ history, onDelete }: CycleHistoryPanelProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const exportCycle = (record: CycleHistoryRecord) => {
    const wb = XLSX.utils.book_new();

    const resumo = [
      ['RELATÓRIO DO CICLO'],
      [''],
      ['Ciclo', record.cycle_name],
      ['Salvo em', formatDate(record.created_at)],
      [''],
      ['Inícios', record.inicios_count, 'Faixa', record.inicios_tier_name ?? '-', 'Comissão', formatCurrency(record.inicios_commission)],
      ['Reinícios', record.reinicios_count, 'Faixa', record.reinicios_tier_name ?? '-', 'Comissão', formatCurrency(record.reinicios_commission)],
      ['TOTAL', '', '', '', '', formatCurrency(record.total_commission)],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), 'Resumo');

    const header = [['Código Revendedor', 'Nome do Cliente', 'Número do Pedido', 'Data']];
    const iniciosRows = (record.inicios_data as OrderItem[]).map((o) => [
      o.resellerCode ?? '', o.clientName ?? '', o.orderNumber ?? '', o.date ?? '',
    ]);
    const reiniciosRows = (record.reinicios_data as OrderItem[]).map((o) => [
      o.resellerCode ?? '', o.clientName ?? '', o.orderNumber ?? '', o.date ?? '',
    ]);

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...header, ...iniciosRows]), 'Inícios');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...header, ...reiniciosRows]), 'Reinícios');

    const safeName = record.cycle_name.replace(/[^\w\-]+/g, '_');
    XLSX.writeFile(wb, `Relatorio_${safeName}.xlsx`);
    toast({ title: 'Planilha exportada!', description: `Arquivo do ${record.cycle_name} baixado.` });
  };

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
      {history.map((record) => {
        const isOpen = !!expanded[record.id];
        const inicios = (record.inicios_data as OrderItem[]) ?? [];
        const reinicios = (record.reinicios_data as OrderItem[]) ?? [];

        return (
          <div key={record.id} className="card-premium p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1 rounded-lg bg-primary/10">
                  <span className="text-sm font-bold text-primary">{record.cycle_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(record.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => exportCycle(record)} className="gap-1.5">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden sm:inline">Excel</span>
                </Button>
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
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="px-2 py-1 rounded bg-primary/10 text-primary">Inícios: {record.inicios_tier_name}</span>
                <span className="px-2 py-1 rounded bg-primary/10 text-primary">Reinícios: {record.reinicios_tier_name}</span>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={() => toggle(record.id)} className="w-full justify-center gap-1.5">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isOpen ? 'Ocultar detalhes' : 'Ver pedidos detalhados'}
            </Button>

            {isOpen && (
              <div className="space-y-4 pt-2 border-t border-border">
                <DetailsTable title="Inícios" rows={inicios} />
                <DetailsTable title="Reinícios" rows={reinicios} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const DetailsTable = ({ title, rows }: { title: string; rows: OrderItem[] }) => {
  if (!rows.length) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-xs text-muted-foreground">Nenhum pedido registrado.</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">{title} ({rows.length})</h4>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-2 py-1.5 font-medium">Cód. Revendedor</th>
              <th className="px-2 py-1.5 font-medium">Cliente</th>
              <th className="px-2 py-1.5 font-medium">Pedido</th>
              <th className="px-2 py-1.5 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-2 py-1.5 font-mono">{r.resellerCode || '-'}</td>
                <td className="px-2 py-1.5">{r.clientName || '-'}</td>
                <td className="px-2 py-1.5 font-mono">{r.orderNumber || '-'}</td>
                <td className="px-2 py-1.5">{r.date || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
