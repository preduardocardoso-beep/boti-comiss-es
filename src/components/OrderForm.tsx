import { useState } from 'react';
import { Plus, User, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface OrderFormProps {
  onSubmit: (clientName: string, orderNumber: string) => void;
  type: 'inicio' | 'reinicio';
}

export const OrderForm = ({ onSubmit, type }: OrderFormProps) => {
  const [clientName, setClientName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

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

    onSubmit(clientName, orderNumber);
    setClientName('');
    setOrderNumber('');
    
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
      
      <div className="grid sm:grid-cols-2 gap-4">
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
      </div>
      
      <Button type="submit" className="w-full h-11 text-base font-semibold">
        <Plus className="h-4 w-4 mr-2" />
        Registrar {type === 'inicio' ? 'Início' : 'Reinício'}
      </Button>
    </form>
  );
};
