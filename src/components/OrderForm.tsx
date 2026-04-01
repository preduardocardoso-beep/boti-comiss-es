import { useState } from 'react';
import { Plus, User, FileText, BadgeCheck, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderRecord } from '@/types/commission';

interface OrderFormProps {
  onSubmit: (clientName: string, orderNumber: string, resellerCode: string) => void;
  type: 'inicio' | 'reinicio';
  existingOrders: OrderRecord[];
}

export const OrderForm = ({ onSubmit, type, existingOrders }: OrderFormProps) => {
  const [clientName, setClientName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [resellerCode, setResellerCode] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const checkDuplicate = (code: string) => {
    if (!code.trim()) {
      setDuplicateWarning(null);
      return;
    }
    const existing = existingOrders.find(
      (o) => o.resellerCode.toLowerCase() === code.trim().toLowerCase()
    );
    if (existing) {
      setDuplicateWarning(
        `⚠️ O revendedor "${code.trim()}" já possui um pedido neste ciclo (Pedido: ${existing.orderNumber} - ${existing.clientName}).`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleResellerCodeChange = (value: string) => {
    setResellerCode(value);
    checkDuplicate(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do cliente.",
        variant: "destructive",
      });
      return;
    }
    
    if (!orderNumber.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o número do pedido.",
        variant: "destructive",
      });
      return;
    }

    if (!resellerCode.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o código do revendedor.",
        variant: "destructive",
      });
      return;
    }

    // Show warning toast if duplicate but still allow submission
    if (duplicateWarning) {
      toast({
        title: "Atenção: Revendedor duplicado!",
        description: duplicateWarning,
        variant: "destructive",
      });
    }

    onSubmit(clientName, orderNumber, resellerCode.trim());
    setClientName('');
    setOrderNumber('');
    setResellerCode('');
    setDuplicateWarning(null);
    
    toast({
      title: type === 'inicio' ? "Início registrado!" : "Reinício registrado!",
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
            onChange={(e) => handleResellerCodeChange(e.target.value)}
            placeholder="Ex: RV12345"
            className="h-11"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full h-11 text-base font-semibold">
        <Plus className="h-4 w-4 mr-2" />
        Registrar {type === 'inicio' ? 'Início' : 'Reinício'}
      </Button>
    </form>
  );
};
