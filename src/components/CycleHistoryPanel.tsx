import { useState, useMemo } from 'react';
import { History, Trash2, Users, RefreshCw, Award, ChevronDown, ChevronUp, FileSpreadsheet, Folder } from 'lucide-react';
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

// Extract numeric cycle ID from a name like "Ciclo 8" / "Ciclo 08/2025"
const extractCycleNumber = (name: string): number => {
  const m = name.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
};

export const CycleHistoryPanel = ({ history, onDelete }: CycleHistoryPanelProps) => {
  const [expandedGroup, setExpandedGroup] = useState<Record<string, boolean>>({});
  const [expandedRecord, setExpandedRecord] = useState<Record<string, boolean>>({});

  // Group by cycle_name, sort cycles desc (Ciclo 8, 7, 6...)
  const groups = useMemo(() => {
    const map = new Map<string, CycleHistoryRecord[]>();
    history.forEach((r) => {
      const list = map.get(r.cycle_name) ?? [];
      list.push(r);
      map.set(r.cycle_name, list);
    });
    return Array.from(map.entries())
      .map(([name, records]) => ({
        name,
        number: extractCycleNumber(name),
        records: records.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      }))
      .sort((a, b) => b.number - a.number);
  }, [history]);

  const toggleGroup = (name: string) =>
    setExpandedGroup((p) => ({ ...p, [name]: !p[name] }));
  const toggleRecord = (id: string) =>
    setExpandedRecord((p) => ({ ...p, [id]: !p[id] }));

  const exportRecord = (record: CycleHistoryRecord) => {
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
    const toRows = (arr: OrderItem[]) =>
      arr.map((o) => [o.resellerCode ?? '', o.clientName ?? '', o.orderNumber ?? '', o.date ?? '']);

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([...header, ...toRows((record.inicios_data as OrderItem[]) ?? [])]),
      'Inícios',
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([...header, ...toRows((record.reinicios_data as OrderItem[]) ?? [])]),
      'Reinícios',
    );

    const safeName = record.cycle_name.replace(/[^\w\-]+/g, '_');
    XLSX.writeFile(wb, `Relatorio_${safeName}_${record.id.slice(0, 6)}.xlsx`);
    toast({ title: 'Planilha exportada!', description: `Arquivo do ${record.cycle_name} baixado.` });
  };

  const exportGroup = (groupName: string, records: CycleHistoryRecord[]) => {
    const wb = XLSX.utils.book_new();

    // Sheet: Resumo consolidado do ciclo
    const totalInicios = records.reduce((s, r) => s + r.inicios_count, 0);
    const totalReinicios = records.reduce((s, r) => s + r.reinicios_count, 0);
    const totalCommission = records.reduce((s, r) => s + Number(r.total_commission), 0);

    const resumo: (string | number)[][] = [
      [`RELATÓRIO CONSOLIDADO - ${groupName}`],
      [''],
      ['Snapshots salvos', records.length],
      ['Total Inícios', totalInicios],
      ['Total Reinícios', totalReinicios],
      ['Comissão Total', formatCurrency(totalCommission)],
      [''],
      ['Histórico de snapshots:'],
      ['Data', 'Inícios', 'Reinícios', 'Comissão'],
      ...records.map((r) => [
        formatDate(r.created_at),
        r.inicios_count,
        r.reinicios_count,
        formatCurrency(Number(r.total_commission)),
      ]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), 'Resumo');

    const header = [['Snapshot', 'Código Revendedor', 'Nome do Cliente', 'Número do Pedido', 'Data']];

    const allInicios = records.flatMap((r) =>
      ((r.inicios_data as OrderItem[]) ?? []).map((o) => [
        formatDate(r.created_at),
        o.resellerCode ?? '',
        o.clientName ?? '',
        o.orderNumber ?? '',
        o.date ?? '',
      ]),
    );
    const allReinicios = records.flatMap((r) =>
      ((r.reinicios_data as OrderItem[]) ?? []).map((o) => [
        formatDate(r.created_at),
        o.resellerCode ?? '',
        o.clientName ?? '',
        o.orderNumber ?? '',
        o.date ?? '',
      ]),
    );

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...header, ...allInicios]), 'Inícios');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...header, ...allReinicios]), 'Reinícios');

    const safeName = groupName.replace(/[^\w\-]+/g, '_');
    XLSX.writeFile(wb, `Consolidado_${safeName}.xlsx`);
    toast({ title: 'Planilha consolidada!', description: `Todos os pedidos do ${groupName} baixados.` });
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
      {groups.map((group) => {
        const isGroupOpen = !!expandedGroup[group.name];
        const totalInicios = group.records.reduce((s, r) => s + r.inicios_count, 0);
        const totalReinicios = group.records.reduce((s, r) => s + r.reinicios_count, 0);
        const totalCommission = group.records.reduce((s, r) => s + Number(r.total_commission), 0);

        return (
          <div key={group.name} className="card-premium overflow-hidden">
            <div className="p-4 bg-primary/5 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <Folder className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{group.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.records.length} {group.records.length === 1 ? 'snapshot' : 'snapshots'} •{' '}
                    {totalInicios} inícios • {totalReinicios} reinícios •{' '}
                    <span className="text-primary font-semibold">{formatCurrency(totalCommission)}</span>
                  </p>
                </div>
                {isGroupOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportGroup(group.name, group.records)}
                className="gap-1.5"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Excel do ciclo</span>
                <span className="sm:hidden">Excel</span>
              </Button>
            </div>

            {isGroupOpen && (
              <div className="p-4 space-y-3 border-t border-border">
                {group.records.map((record) => {
                  const isOpen = !!expandedRecord[record.id];
                  const inicios = (record.inicios_data as OrderItem[]) ?? [];
                  const reinicios = (record.reinicios_data as OrderItem[]) ?? [];

                  return (
                    <div key={record.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          Salvo em {formatDate(record.created_at)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportRecord(record)}
                            className="gap-1.5"
                          >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">Excel</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deletar snapshot?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Este snapshot do {record.cycle_name} será removido permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(record.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
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

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRecord(record.id)}
                        className="w-full justify-center gap-1.5"
                      >
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
      <h4 className="text-sm font-semibold text-foreground mb-2">
        {title} ({rows.length})
      </h4>
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
