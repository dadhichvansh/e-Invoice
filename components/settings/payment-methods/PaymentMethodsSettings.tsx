'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, WalletCards } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { PaymentMethodDialog } from './PaymentMethodDialog';
import { PaymentMethodCard } from './PaymentMethodCard';
import { DeletePaymentMethodDialog } from './DeletePaymentMethodDialog';

import type { PaymentMethodType } from '@/types/payment-method';
import type { Prisma } from '@/lib/db/generated/prisma/client';

import { deletePaymentMethod } from '@/actions/settings/payment-methods/deletePaymentMethod';

interface PaymentMethodsSettingsProps {
  paymentMethods: {
    id: string;
    name: string;
    type: PaymentMethodType;
    details: Prisma.JsonValue;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export function PaymentMethodsSettings({
  paymentMethods,
}: PaymentMethodsSettingsProps) {
  const router = useRouter();

  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] =
    useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodsSettingsProps['paymentMethods'][number] | null
  >(null);

  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<
    PaymentMethodsSettingsProps['paymentMethods'][number] | null
  >(null);

  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    if (!paymentMethodToDelete) {
      return;
    }

    const paymentMethodId = paymentMethodToDelete.id;

    startDeleteTransition(async () => {
      const result = await deletePaymentMethod({
        id: paymentMethodId,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setPaymentMethodToDelete(null);
      router.refresh();
    });
  };

  return (
    <>
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Your payment methods
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add payment instructions that customers can use to pay you.
              </p>
            </div>

            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedPaymentMethod(null);
                setIsPaymentMethodDialogOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add payment method
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <WalletCards className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-foreground">
                No payment methods yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Add a payment method so your customers know how to pay you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((paymentMethod) => (
                <PaymentMethodCard
                  key={paymentMethod.id}
                  paymentMethod={paymentMethod}
                  onEdit={() => {
                    setSelectedPaymentMethod(paymentMethod);
                    setIsPaymentMethodDialogOpen(true);
                  }}
                  onDelete={() => {
                    setPaymentMethodToDelete(paymentMethod);
                  }}
                  disabled={isDeletePending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentMethodDialog
        key={selectedPaymentMethod?.id ?? 'new'}
        open={isPaymentMethodDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPaymentMethodDialogOpen(false);
            setSelectedPaymentMethod(null);
          }
        }}
        paymentMethod={selectedPaymentMethod}
      />

      <DeletePaymentMethodDialog
        paymentMethod={paymentMethodToDelete}
        open={Boolean(paymentMethodToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletePending) {
            setPaymentMethodToDelete(null);
          }
        }}
        onConfirm={handleDelete}
        isPending={isDeletePending}
      />
    </>
  );
}
