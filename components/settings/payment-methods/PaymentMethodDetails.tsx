import { Mail } from 'lucide-react';

import type { Prisma } from '@/lib/db/generated/prisma/client';

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function maskAccountNumber(accountNumber: string) {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `••••${accountNumber.slice(-4)}`;
}

export function PaymentMethodDetails({
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
      const accountHolderName =
        typeof details.accountHolderName === 'string'
          ? details.accountHolderName
          : null;

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
          {accountHolderName && (
            <div>
              <p className="text-xs text-muted-foreground">
                Account holder name
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {accountHolderName}
              </p>
            </div>
          )}

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
