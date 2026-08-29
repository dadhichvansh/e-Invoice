'use client';

import { Plus, WalletCards } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog';

interface PaymentMethodsSettingsProps {
  paymentMethods: {
    id: string;
    name: string;
    type: string;
    details: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export function PaymentMethodsSettings({
  paymentMethods,
}: PaymentMethodsSettingsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
                setIsAddDialogOpen(true);
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
              {/* Payment method list will be implemented next */}
              {paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id} className="rounded-xl border p-4">
                  <p className="font-medium">{paymentMethod.name}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {paymentMethod.type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
