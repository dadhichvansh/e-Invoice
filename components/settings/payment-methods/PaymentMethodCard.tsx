import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  CreditCard,
  Globe,
  Pencil,
  Trash2,
  WalletCards,
} from 'lucide-react';
import { PaymentMethodDetails } from './PaymentMethodDetails';
import { PaymentMethodType } from '@/types/payment-method';
import type { Prisma } from '@/lib/db/generated/prisma/client';

interface PaymentMethodCardProps {
  paymentMethod: {
    id: string;
    name: string;
    type: PaymentMethodType;
    details: Prisma.JsonValue;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const paymentMethodTypeLabels: Record<string, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  UPI: 'UPI',
  PAYPAL: 'PayPal',
  WISE: 'Wise',
  OTHER: 'Other',
};

function PaymentMethodIcon({ type }: { type: PaymentMethodType }) {
  switch (type) {
    case 'BANK_TRANSFER':
      return <Building2 className="size-5 text-muted-foreground" />;

    case 'UPI':
      return <CreditCard className="size-5 text-muted-foreground" />;

    case 'PAYPAL':
    case 'WISE':
      return <Globe className="size-5 text-muted-foreground" />;

    default:
      return <WalletCards className="size-5 text-muted-foreground" />;
  }
}

export function PaymentMethodCard({
  paymentMethod,
  onEdit,
  onDelete,
  disabled,
}: PaymentMethodCardProps) {
  return (
    <div className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/30 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        {/* Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <PaymentMethodIcon type={paymentMethod.type} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="wrap-break-word text-sm font-semibold text-foreground">
                  {paymentMethod.name}
                </h3>

                {paymentMethod.isDefault && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Default
                  </Badge>
                )}
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {paymentMethodTypeLabels[paymentMethod.type] ??
                  paymentMethod.type}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={disabled}
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={disabled}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <PaymentMethodDetails
              type={paymentMethod.type}
              details={paymentMethod.details}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
