import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { OrderRecord, CommissionTier } from '@/types/commission';

interface ExportButtonProps {
  inicios: OrderRecord[];
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
  };
  config: {
    iniciosMeta: number;
    reiniciosMeta: number;
  };
}

export const ExportButton = ({
  inicios,
  reinicios,
  iniciosTiers,
  reiniciosTiers,
  stats,
  config,
}: ExportButtonProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Resumo Geral
    const resumoData = [
      ['RELATÓRIO RV PROMOTOR'],
      [''],
      ['Data do Relatório', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['RESUMO DO CICLO'],
      ['Total de Inícios', stats.iniciosCount],
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
    ];
    const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');

    // Sheet 2: Inícios
    const iniciosHeader = [['Nome do Cliente', 'Número do Pedido', 'Data']];
    const iniciosRows = inicios.map((r) => [r.clientName, r.orderNumber, r.date]);
    const iniciosSheet = XLSX.utils.aoa_to_sheet([...iniciosHeader, ...iniciosRows]);
    XLSX.utils.book_append_sheet(workbook, iniciosSheet, 'Inícios');

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
    const fileName = `Relatorio_RV_Promotor_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: 'Relatório exportado!',
      description: `Arquivo ${fileName} baixado com sucesso.`,
    });
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <FileSpreadsheet className="h-4 w-4" />
      Exportar Excel
    </Button>
  );
};
