import { Trash2, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderRecord } from '@/types/commission';

interface OrderListProps {
  orders: OrderRecord[];
  onRemove: (id: string) => void;
  type: 'inicio' | 'reinicio';
}

export const OrderList = ({ orders, onRemove, type }: OrderListProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="card-premium p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum {type === 'inicio' ? 'início' : 'reinício'} registrado neste ciclo.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">
          Registros ({orders.length})
        </h3>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {order.clientName}
              </p>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {order.orderNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(order.date)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(order.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
