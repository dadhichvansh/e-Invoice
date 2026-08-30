'use client';

import { useState } from 'react';
import {
  Building2,
  CreditCard,
  Globe,
  Mail,
  Pencil,
  Plus,
  WalletCards,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { PaymentMethodDialog } from './PaymentMethodDialog';

import type { Prisma } from '@/lib/db/generated/prisma/client';
import type { PaymentMethodType } from '@/types/payment-method';

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

const paymentMethodTypeLabels: Record<string, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  UPI: 'UPI',
  PAYPAL: 'PayPal',
  WISE: 'Wise',
  OTHER: 'Other',
};

function getPaymentMethodIcon(type: string) {
  switch (type) {
    case 'BANK_TRANSFER':
      return Building2;

    case 'UPI':
      return CreditCard;

    case 'PAYPAL':
    case 'WISE':
      return Globe;

    default:
      return WalletCards;
  }
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function maskAccountNumber(accountNumber: string) {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `••••${accountNumber.slice(-4)}`;
}

function PaymentMethodDetails({
  type,
  details,
}: {
  type: string;
  details: Prisma.JsonValue;
}) {
  if (!isJsonObject(details)) {
    return null;
  }

  switch (type) {
    case 'BANK_TRANSFER': {
      const bankName =
        typeof details.bankName === 'string' ? details.bankName : null;

      const accountNumber =
        typeof details.accountNumber === 'string'
          ? details.accountNumber
          : null;

      const ifsc = typeof details.ifsc === 'string' ? details.ifsc : null;

      const swift = typeof details.swift === 'string' ? details.swift : null;

      return (
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {bankName && (
            <div>
              <p className="text-xs text-muted-foreground">Bank</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {bankName}
              </p>
            </div>
          )}

          {accountNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Account number</p>
              <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                {maskAccountNumber(accountNumber)}
              </p>
            </div>
          )}

          {ifsc && (
            <div>
              <p className="text-xs text-muted-foreground">IFSC</p>
              <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                {ifsc}
              </p>
            </div>
          )}

          {swift && (
            <div>
              <p className="text-xs text-muted-foreground">SWIFT</p>
              <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                {swift}
              </p>
            </div>
          )}
        </div>
      );
    }

    case 'UPI': {
      const upiId = typeof details.upiId === 'string' ? details.upiId : null;

      return upiId ? (
        <div>
          <p className="text-xs text-muted-foreground">UPI ID</p>

          <p className="mt-0.5 break-all text-sm font-medium text-foreground">
            {upiId}
          </p>
        </div>
      ) : null;
    }

    case 'PAYPAL':
    case 'WISE': {
      const email = typeof details.email === 'string' ? details.email : null;

      return email ? (
        <div className="flex min-w-0 items-start gap-2">
          <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Email</p>

            <p className="mt-0.5 break-all text-sm font-medium text-foreground">
              {email}
            </p>
          </div>
        </div>
      ) : null;
    }

    case 'OTHER': {
      const instructions =
        typeof details.instructions === 'string' ? details.instructions : null;

      return instructions ? (
        <div>
          <p className="text-xs text-muted-foreground">Payment instructions</p>

          <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground">
            {instructions}
          </p>
        </div>
      ) : null;
    }

    default:
      return null;
  }
}

export function PaymentMethodsSettings({
  paymentMethods,
}: PaymentMethodsSettingsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<
    PaymentMethodsSettingsProps['paymentMethods'][number] | null
  >(null);

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
                setPaymentMethodToEdit(null);
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
              {paymentMethods.map((paymentMethod) => {
                const Icon = getPaymentMethodIcon(paymentMethod.type);

                return (
                  <div
                    key={paymentMethod.id}
                    className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/30 sm:p-5"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="wrap-break-word text-sm font-semibold text-foreground">
                                {paymentMethod.name}
                              </h3>

                              {paymentMethod.isDefault && (
                                <Badge
                                  variant="secondary"
                                  className="shrink-0 text-xs"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {paymentMethodTypeLabels[paymentMethod.type] ??
                                paymentMethod.type}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => {
                              setPaymentMethodToEdit(paymentMethod);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Button>
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
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentMethodDialog
        key={paymentMethodToEdit?.id ?? 'new'}
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setPaymentMethodToEdit(null);
          }
        }}
        paymentMethod={paymentMethodToEdit}
      />
    </>
  );
}
