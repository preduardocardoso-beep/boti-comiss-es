import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { parse, isAfter, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, TrendingUp, Wallet } from 'lucide-react';
import { ciclosData, CicloData } from '@/data/ciclosData';

const Ciclos = () => {
  const navigate = useNavigate();

  // Parse date string in DD/MM/YYYY format
  const parseDate = (dateStr: string): Date => {
    return parse(dateStr, 'dd/MM/yyyy', new Date());
  };

  // Calculate next payment based on current date
  const nextPayment = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureCiclos = ciclosData
      .map(ciclo => ({
        ...ciclo,
        pagamentoDate: parseDate(ciclo.pagamento)
      }))
      .filter(ciclo => isAfter(ciclo.pagamentoDate, today) || ciclo.pagamentoDate.getTime() === today.getTime())
      .sort((a, b) => a.pagamentoDate.getTime() - b.pagamentoDate.getTime());

    if (futureCiclos.length > 0) {
      const next = futureCiclos[0];
      const daysUntil = differenceInDays(next.pagamentoDate, today);
      return { ...next, daysUntil };
    }

    // If no future payments, show the last one
    const lastCiclo = ciclosData[ciclosData.length - 1];
    return {
      ...lastCiclo,
      pagamentoDate: parseDate(lastCiclo.pagamento),
      daysUntil: differenceInDays(parseDate(lastCiclo.pagamento), today)
    };
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const intervals = ciclosData.map(c => c.intervalo);
    const avgInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    const maxInterval = Math.max(...intervals);
    const minInterval = Math.min(...intervals);
    const totalDias = ciclosData.reduce((sum, c) => sum + c.dias, 0);

    return { avgInterval, maxInterval, minInterval, totalDias };
  }, []);

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-lg font-semibold">Ciclos de Pagamento</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Next Payment Highlight Card */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-2 mb-2 text-blue-100">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Próximo Pagamento</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  {nextPayment.pagamento}
                </div>
                <div className="text-lg text-blue-100">
                  {capitalizeFirst(nextPayment.diaSemanaPgto)}
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-semibold">
                  {nextPayment.ciclo}
                </span>
                <span className="text-sm text-blue-100">
                  {nextPayment.daysUntil > 0 
                    ? `Faltam ${nextPayment.daysUntil} dias`
                    : nextPayment.daysUntil === 0 
                      ? 'Hoje!'
                      : `Passou há ${Math.abs(nextPayment.daysUntil)} dias`
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Intervalo Médio</p>
                  <p className="text-lg font-bold">{stats.avgInterval} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maior Intervalo</p>
                  <p className="text-lg font-bold">{stats.maxInterval} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Menor Intervalo</p>
                  <p className="text-lg font-bold">{stats.minInterval} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Wallet className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Ciclos</p>
                  <p className="text-lg font-bold">{ciclosData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendário Completo</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Ciclo</TableHead>
                    <TableHead className="font-semibold text-center">Dias</TableHead>
                    <TableHead className="font-semibold">Início</TableHead>
                    <TableHead className="font-semibold">Fim</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Fim Pós</TableHead>
                    <TableHead className="font-semibold">Pagamento</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Dia</TableHead>
                    <TableHead className="font-semibold text-center hidden lg:table-cell">Intervalo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ciclosData.map((ciclo, index) => {
                    const isNextPayment = ciclo.ciclo === nextPayment.ciclo;
                    return (
                      <TableRow 
                        key={ciclo.ciclo}
                        className={isNextPayment ? 'bg-blue-50 dark:bg-blue-950/30' : ''}
                      >
                        <TableCell className="font-bold text-primary">
                          {ciclo.ciclo}
                        </TableCell>
                        <TableCell className="text-center">{ciclo.dias}</TableCell>
                        <TableCell className="text-muted-foreground">{ciclo.inicio}</TableCell>
                        <TableCell className="text-muted-foreground">{ciclo.fim}</TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell">{ciclo.fimPos}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-medium text-sm">
                            {ciclo.pagamento}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize text-muted-foreground">
                          {ciclo.diaSemanaPgto}
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <span className={`text-sm ${
                            ciclo.intervalo >= 45 
                              ? 'text-destructive font-medium' 
                              : ciclo.intervalo <= 35 
                                ? 'text-green-600 font-medium' 
                                : 'text-muted-foreground'
                          }`}>
                            {ciclo.intervalo}d
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="bg-muted/30">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              <span className="inline-block w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 mr-1 align-middle"></span>
              Pagamento &nbsp;|&nbsp;
              <span className="text-green-600 font-medium">≤35d</span> Intervalo curto &nbsp;|&nbsp;
              <span className="text-destructive font-medium">≥45d</span> Intervalo longo
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Ciclos;
