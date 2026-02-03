export interface CicloData {
  ciclo: string;
  dias: number;
  inicio: string;
  fim: string;
  fimPos: string;
  pagamento: string;
  diaSemanaPgto: string;
  intervalo: number;
}

export const ciclosData: CicloData[] = [
  { ciclo: "C1", dias: 24, inicio: "26/12/2025", fim: "18/01/2026", fimPos: "21/01/2026", pagamento: "27/02/2026", diaSemanaPgto: "sexta-feira", intervalo: 40 },
  { ciclo: "C2", dias: 21, inicio: "19/01/2026", fim: "08/02/2026", fimPos: "11/02/2026", pagamento: "13/03/2026", diaSemanaPgto: "sexta-feira", intervalo: 33 },
  { ciclo: "C3", dias: 21, inicio: "09/02/2026", fim: "01/03/2026", fimPos: "04/03/2026", pagamento: "15/04/2026", diaSemanaPgto: "quarta-feira", intervalo: 45 },
  { ciclo: "C4", dias: 21, inicio: "02/03/2026", fim: "22/03/2026", fimPos: "25/03/2026", pagamento: "30/04/2026", diaSemanaPgto: "quinta-feira", intervalo: 39 },
  { ciclo: "C5", dias: 21, inicio: "23/03/2026", fim: "12/04/2026", fimPos: "15/04/2026", pagamento: "29/05/2026", diaSemanaPgto: "sexta-feira", intervalo: 47 },
  { ciclo: "C6", dias: 28, inicio: "13/04/2026", fim: "10/05/2026", fimPos: "13/05/2026", pagamento: "15/06/2026", diaSemanaPgto: "segunda-feira", intervalo: 36 },
  { ciclo: "C7", dias: 14, inicio: "11/05/2026", fim: "24/05/2026", fimPos: "27/05/2026", pagamento: "30/06/2026", diaSemanaPgto: "terça-feira", intervalo: 37 },
  { ciclo: "C8", dias: 21, inicio: "25/05/2026", fim: "14/06/2026", fimPos: "17/06/2026", pagamento: "15/07/2026", diaSemanaPgto: "quarta-feira", intervalo: 31 },
  { ciclo: "C9", dias: 14, inicio: "15/06/2026", fim: "28/06/2026", fimPos: "01/07/2026", pagamento: "14/08/2026", diaSemanaPgto: "sexta-feira", intervalo: 47 },
  { ciclo: "C10", dias: 21, inicio: "29/06/2026", fim: "19/07/2026", fimPos: "22/07/2026", pagamento: "31/08/2026", diaSemanaPgto: "segunda-feira", intervalo: 43 },
  { ciclo: "C11", dias: 21, inicio: "20/07/2026", fim: "09/08/2026", fimPos: "12/08/2026", pagamento: "15/09/2026", diaSemanaPgto: "terça-feira", intervalo: 37 },
  { ciclo: "C12", dias: 21, inicio: "10/08/2026", fim: "30/08/2026", fimPos: "02/09/2026", pagamento: "15/10/2026", diaSemanaPgto: "quinta-feira", intervalo: 46 },
  { ciclo: "C13", dias: 21, inicio: "31/08/2026", fim: "20/09/2026", fimPos: "23/09/2026", pagamento: "30/10/2026", diaSemanaPgto: "sexta-feira", intervalo: 40 },
  { ciclo: "C14", dias: 22, inicio: "21/09/2026", fim: "12/10/2026", fimPos: "15/10/2026", pagamento: "13/11/2026", diaSemanaPgto: "sexta-feira", intervalo: 32 },
  { ciclo: "C15", dias: 20, inicio: "13/10/2026", fim: "01/11/2026", fimPos: "04/11/2026", pagamento: "15/12/2026", diaSemanaPgto: "terça-feira", intervalo: 44 },
  { ciclo: "C16", dias: 28, inicio: "02/11/2026", fim: "29/11/2026", fimPos: "02/12/2026", pagamento: "15/01/2027", diaSemanaPgto: "sexta-feira", intervalo: 47 },
  { ciclo: "C17", dias: 26, inicio: "30/11/2026", fim: "25/12/2026", fimPos: "28/12/2026", pagamento: "15/02/2027", diaSemanaPgto: "sexta-feira", intervalo: 52 },
];
