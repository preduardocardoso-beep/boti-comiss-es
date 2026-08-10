import { FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { OrderRecord, CommissionTier } from '@/types/commission';

type ReportScope = 'todos' | 'inicio' | 'inicio_off';

interface ExportButtonProps {
  inicios: OrderRecord[];
  iniciosNormal?: OrderRecord[];
  iniciosOff?: OrderRecord[];
  reinicios: OrderRecord[];
  iniciosTiers: CommissionTier[];
  reiniciosTiers: CommissionTier[];
  stats: {
    iniciosCount: number;
    reiniciosCount: number;
    iniciosCommission: number;
    reiniciosCommission: number;
    totalCommission: number;
    iniciosTierName: string;
    reiniciosTierName: string;
    iniciosNormalCount?: number;
    iniciosOffCount?: number;
  };
  config: {
    iniciosMeta: number;
    reiniciosMeta: number;
  };
}

export const ExportButton = ({
  inicios,
  iniciosNormal,
  iniciosOff,
  reinicios,
  iniciosTiers,
  reiniciosTiers,
  stats,
  config,
}: ExportButtonProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const listNormal = iniciosNormal ?? inicios.filter((r) => !r.isOff);
  const listOff = iniciosOff ?? inicios.filter((r) => r.isOff);

  const handleExport = (scope: ReportScope = 'todos') => {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Resumo Geral
    const resumoData = [
      ['RELATÓRIO RV PROMOTOR'],
      [''],
      ['Data do Relatório', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['RESUMO DO CICLO'],
      ['Total de Inícios (Normal + Off)', stats.iniciosCount],
      ['Inícios Normais', stats.iniciosNormalCount ?? listNormal.length],
      ['Inícios Off', stats.iniciosOffCount ?? listOff.length],
      ['Faixa Inícios', stats.iniciosTierName],
      ['Comissão Inícios', formatCurrency(stats.iniciosCommission)],
      [''],
      ['Total de Reinícios', stats.reiniciosCount],
      ['Faixa Reinícios', stats.reiniciosTierName],
      ['Comissão Reinícios', formatCurrency(stats.reiniciosCommission)],
      [''],
      ['TOTAL GERAL', formatCurrency(stats.totalCommission)],
      [''],
      ['METAS DO CICLO'],
      ['Meta Inícios', config.iniciosMeta],
      ['Meta Reinícios', config.reiniciosMeta],
      [''],
      ['FILTRO DO RELATÓRIO', scope === 'todos' ? 'Todos os Inícios' : scope === 'inicio' ? 'Apenas Início Normal' : 'Apenas Início Off'],
    ];
    const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');

    // Sheet 2: Inícios (conforme filtro)
    const iniciosHeader = [['Tipo', 'Nome do Cliente', 'Código do Revendedor', 'Número do Pedido', 'Data']];
    const toRows = (rows: OrderRecord[]) =>
      rows.map((r) => [r.isOff ? 'Início Off' : 'Início', r.clientName, r.resellerCode || '-', r.orderNumber, r.date]);

    if (scope === 'todos' || scope === 'inicio') {
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([...iniciosHeader, ...toRows(listNormal)]),
        'Inícios Normais'
      );
    }
    if (scope === 'todos' || scope === 'inicio_off') {
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([...iniciosHeader, ...toRows(listOff)]),
        'Inícios Off'
      );
    }
    if (scope === 'todos') {
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([...iniciosHeader, ...toRows(inicios)]),
        'Inícios (Geral)'
      );
    }

    // Sheet 3: Reinícios
    const reiniciosHeader = [['Nome do Cliente', 'Número do Pedido', 'Data']];
    const reiniciosRows = reinicios.map((r) => [r.clientName, r.orderNumber, r.date]);
    const reiniciosSheet = XLSX.utils.aoa_to_sheet([...reiniciosHeader, ...reiniciosRows]);
    XLSX.utils.book_append_sheet(workbook, reiniciosSheet, 'Reinícios');

    // Sheet 4: Gatilhos Inícios
    const gatilhosIniciosHeader = [['Faixa', 'Quantidade Mínima', 'Valor por Unidade']];
    const gatilhosIniciosRows = iniciosTiers.slice(1).map((t) => [
      t.name,
      `≥ ${t.threshold}`,
      formatCurrency(t.value),
    ]);
    const gatilhosIniciosSheet = XLSX.utils.aoa_to_sheet([...gatilhosIniciosHeader, ...gatilhosIniciosRows]);
    XLSX.utils.book_append_sheet(workbook, gatilhosIniciosSheet, 'Gatilhos Inícios');

    // Sheet 5: Gatilhos Reinícios
    const gatilhosReiniciosHeader = [['Faixa', 'Quantidade Mínima', 'Valor por Unidade']];
    const gatilhosReiniciosRows = reiniciosTiers.slice(1).map((t) => [
      t.name,
      `≥ ${t.threshold}`,
      formatCurrency(t.value),
    ]);
    const gatilhosReiniciosSheet = XLSX.utils.aoa_to_sheet([...gatilhosReiniciosHeader, ...gatilhosReiniciosRows]);
    XLSX.utils.book_append_sheet(workbook, gatilhosReiniciosSheet, 'Gatilhos Reinícios');

    // Download
    const suffix = scope === 'inicio' ? '_Inicio_Normal' : scope === 'inicio_off' ? '_Inicio_Off' : '';
    const fileName = `Relatorio_RV_Promotor${suffix}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: 'Relatório exportado!',
      description: `Arquivo ${fileName} baixado com sucesso.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar Excel</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Relatórios</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('todos')}>
          Geral (Início + Início Off)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('inicio')}>Apenas Início Normal</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('inicio_off')}>Apenas Início Off</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
