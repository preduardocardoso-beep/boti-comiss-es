import { useState, useMemo, useEffect } from 'react';
import { Plus, User, FileText, BadgeCheck, AlertTriangle, Eraser } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderRecord } from '@/types/commission';

type OrderType = 'inicio' | 'reinicio';

interface OrderFormProps {
  onSubmit: (clientName: string, orderNumber: string, resellerCode: string) => void;
  type: OrderType;
  existingOrders: OrderRecord[];
}

interface OrderDraft {
  clientName: string;
  orderNumber: string;
  resellerCode: string;
}

const EMPTY_DRAFT: OrderDraft = {
  clientName: '',
  orderNumber: '',
  resellerCode: '',
};

const getDraftKey = (type: OrderType) => `rv_order_form_draft_${type}`;

const readDraft = (type: OrderType): OrderDraft => {
  if (typeof window === 'undefined') return EMPTY_DRAFT;

  try {
    const rawDraft = localStorage.getItem(getDraftKey(type));
    if (!rawDraft) return EMPTY_DRAFT;

    const parsed = JSON.parse(rawDraft) as Partial<OrderDraft>;

    return {
      clientName: parsed.clientName ?? '',
      orderNumber: parsed.orderNumber ?? '',
      resellerCode: parsed.resellerCode ?? '',
    };
  } catch {
    return EMPTY_DRAFT;
  }
};

export const OrderForm = ({ onSubmit, type, existingOrders }: OrderFormProps) => {
  const draftKey = useMemo(() => getDraftKey(type), [type]);
  const initialDraft = useMemo(() => readDraft(type), [type]);

  const [clientName, setClientName] = useState(initialDraft.clientName);
  const [orderNumber, setOrderNumber] = useState(initialDraft.orderNumber);
  const [resellerCode, setResellerCode] = useState(initialDraft.resellerCode);

  useEffect(() => {
    setClientName(initialDraft.clientName);
    setOrderNumber(initialDraft.orderNumber);
    setResellerCode(initialDraft.resellerCode);
  }, [initialDraft]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      draftKey,
      JSON.stringify({
        clientName,
        orderNumber,
        resellerCode,
      })
    );
  }, [draftKey, clientName, orderNumber, resellerCode]);

  const duplicateWarning = useMemo(() => {
    const code = resellerCode.trim().toLowerCase();
    if (!code) return null;

    const existing = existingOrders.find(
      (o) => o.resellerCode.trim().toLowerCase() === code
    );

    if (!existing) return null;

    return `⚠️ O revendedor "${resellerCode.trim()}" já possui um pedido neste ciclo (Pedido: ${existing.orderNumber} - ${existing.clientName}).`;
  }, [resellerCode, existingOrders]);

  const handleClearForm = () => {
    setClientName('');
    setOrderNumber('');
    setResellerCode('');

    if (typeof window !== 'undefined') {
      localStorage.removeItem(draftKey);
    }

    toast({
      title: 'Campos limpos',
      description: 'Os dados digitados foram apagados com sucesso.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o nome do cliente.',
        variant: 'destructive',
      });
      return;
    }

    if (!orderNumber.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o número do pedido.',
        variant: 'destructive',
      });
      return;
    }

    if (!resellerCode.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o código do revendedor.',
        variant: 'destructive',
      });
      return;
    }

    if (duplicateWarning) {
      toast({
        title: 'Atenção: Revendedor duplicado!',
        description: duplicateWarning,
        variant: 'destructive',
      });
    }

    onSubmit(clientName, orderNumber, resellerCode.trim());

    toast({
      title: type === 'inicio' ? 'Início registrado!' : 'Reinício registrado!',
      description: `Pedido de ${clientName.trim()} adicionado com sucesso.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card-premium p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Novo {type === 'inicio' ? 'Início' : 'Reinício'}
      </h3>

      {duplicateWarning && (
        <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {duplicateWarning}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome do Cliente
          </label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Digite o nome..."
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Número do Pedido
          </label>
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Ex: 123456"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Código do Revendedor
          </label>
          <Input
            value={resellerCode}
            onChange={(e) => setResellerCode(e.target.value)}
            placeholder="Ex: RV12345"
            className="h-11"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" className="w-full h-11 text-base font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Registrar {type === 'inicio' ? 'Início' : 'Reinício'}
        </Button>

        <Button type="button" variant="outline" onClick={handleClearForm} className="w-full sm:w-auto h-11">
          <Eraser className="h-4 w-4 mr-2" />
          Limpar campos
        </Button>
      </div>
    </form>
  );
};
