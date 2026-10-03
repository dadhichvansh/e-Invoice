'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { PaymentMethodType } from '@/types/payment-method';
import type { Prisma } from '@/lib/db/generated/prisma/client';

import { createPaymentMethod } from '@/actions/settings/payment-methods/createPaymentMethod';
import { updatePaymentMethod } from '@/actions/settings/payment-methods/updatePaymentMethod';

interface PaymentMethodToEdit {
  id: string;
  name: string;
  type: PaymentMethodType;
  details: Prisma.JsonValue;
  isDefault: boolean;
}

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod?: PaymentMethodToEdit | null;
}

const paymentMethodTypes: {
  value: PaymentMethodType;
  label: string;
}[] = [
  {
    value: 'BANK_TRANSFER',
    label: 'Bank Transfer',
  },
  {
    value: 'UPI',
    label: 'UPI',
  },
  {
    value: 'PAYPAL',
    label: 'PayPal',
  },
  {
    value: 'WISE',
    label: 'Wise',
  },
  {
    value: 'OTHER',
    label: 'Other',
  },
];

function getInitialFormState(paymentMethod?: PaymentMethodToEdit | null) {
  const details = paymentMethod?.details;

  const isObject =
    typeof details === 'object' && details !== null && !Array.isArray(details);

  return {
    name: paymentMethod?.name ?? '',
    type: paymentMethod?.type ?? 'BANK_TRANSFER',
    isDefault: paymentMethod?.isDefault ?? false,

    bankTransferDetails: {
      accountHolderName:
        isObject && typeof details.accountHolderName === 'string'
          ? details.accountHolderName
          : '',
      bankName:
        isObject && typeof details.bankName === 'string'
          ? details.bankName
          : '',
      accountNumber:
        isObject && typeof details.accountNumber === 'string'
          ? details.accountNumber
          : '',
      ifsc: isObject && typeof details.ifsc === 'string' ? details.ifsc : '',
      swift: isObject && typeof details.swift === 'string' ? details.swift : '',
    },

    upiDetails: {
      upiId: isObject && typeof details.upiId === 'string' ? details.upiId : '',
    },

    paypalDetails: {
      email: isObject && typeof details.email === 'string' ? details.email : '',
    },

    wiseDetails: {
      email: isObject && typeof details.email === 'string' ? details.email : '',
    },

    otherDetails: {
      instructions:
        isObject && typeof details.instructions === 'string'
          ? details.instructions
          : '',
    },
  };
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  paymentMethod,
}: PaymentMethodDialogProps) {
  const router = useRouter();

  const initialFormState = getInitialFormState(paymentMethod);

  const [name, setName] = useState(initialFormState.name);

  const [type, setType] = useState<PaymentMethodType>(initialFormState.type);

  const [bankTransferDetails, setBankTransferDetails] = useState(
    initialFormState.bankTransferDetails,
  );

  const [upiDetails, setUpiDetails] = useState(initialFormState.upiDetails);

  const [paypalDetails, setPaypalDetails] = useState(
    initialFormState.paypalDetails,
  );

  const [wiseDetails, setWiseDetails] = useState(initialFormState.wiseDetails);

  const [otherDetails, setOtherDetails] = useState(
    initialFormState.otherDetails,
  );

  const [isDefault, setIsDefault] = useState(initialFormState.isDefault);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string[];
    type?: string[];
    details?: {
      accountHolderName?: string[];
      bankName?: string[];
      accountNumber?: string[];
      ifsc?: string[];
      swift?: string[];
      upiId?: string[];
      email?: string[];
      instructions?: string[];
    };
    isDefault?: string[];
  }>({});

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setFieldErrors({});

    let details:
      | {
          accountHolderName: string;
          bankName: string;
          accountNumber: string;
          ifsc: string;
          swift?: string;
        }
      | {
          upiId: string;
        }
      | {
          email: string;
        }
      | {
          instructions: string;
        };

    switch (type) {
      case 'BANK_TRANSFER':
        details = bankTransferDetails;
        break;

      case 'UPI':
        details = upiDetails;
        break;

      case 'PAYPAL':
        details = paypalDetails;
        break;

      case 'WISE':
        details = wiseDetails;
        break;

      case 'OTHER':
        details = otherDetails;
        break;
    }

    startTransition(async () => {
      const result = paymentMethod
        ? await updatePaymentMethod({
            id: paymentMethod.id,
            name,
            type,
            details,
            isDefault,
          })
        : await createPaymentMethod({
            name,
            type,
            details,
            isDefault,
          });

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {paymentMethod ? 'Edit payment method' : 'Add payment method'}
          </DialogTitle>

          <DialogDescription>
            {paymentMethod
              ? 'Update the payment instructions shown on your invoices.'
              : 'Add payment instructions that can be shown on your invoices.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="payment-method-name">Name</Label>

            <Input
              id="payment-method-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);

                if (fieldErrors.name) {
                  setFieldErrors((current) => ({
                    ...current,
                    name: undefined,
                  }));
                }
              }}
              placeholder="Business Bank Account"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.name?.length)}
            />

            {fieldErrors.name?.[0] && (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="payment-method-type">Type</Label>

            <Select
              value={type}
              onValueChange={(value) => {
                if (value) {
                  setType(value as PaymentMethodType);

                  if (fieldErrors.type) {
                    setFieldErrors((current) => ({
                      ...current,
                      type: undefined,
                      details: undefined,
                    }));
                  }
                }
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="payment-method-type"
                className="w-full"
                aria-invalid={Boolean(fieldErrors.type?.length)}
              >
                <SelectValue>
                  {
                    paymentMethodTypes.find(
                      (methodType) => methodType.value === type,
                    )?.label
                  }
                </SelectValue>
              </SelectTrigger>

              <SelectContent
                side="bottom"
                align="start"
                sideOffset={4}
                alignItemWithTrigger={false}
              >
                {paymentMethodTypes.map((methodType) => (
                  <SelectItem key={methodType.value} value={methodType.value}>
                    {methodType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldErrors.type?.[0] && (
              <p className="text-xs text-destructive">{fieldErrors.type[0]}</p>
            )}
          </div>

          {/* Payment details */}
          {type === 'BANK_TRANSFER' && (
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Bank transfer details
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Enter the bank account details your customers need for
                  payment.
                </p>
              </div>

              <div className="sm:col-span-2">
                {/* Account holder name */}
                <div className="space-y-2">
                  <Label htmlFor="account-holder-name">
                    Account holder name
                  </Label>

                  <Input
                    id="account-holder-name"
                    value={bankTransferDetails.accountHolderName}
                    onChange={(event) => {
                      setBankTransferDetails((current) => ({
                        ...current,
                        accountHolderName: event.target.value,
                      }));

                      if (fieldErrors.details?.accountHolderName) {
                        setFieldErrors((current) => ({
                          ...current,
                          details: {
                            ...current.details,
                            accountHolderName: undefined,
                          },
                        }));
                      }
                    }}
                    placeholder="John Doe"
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.details?.accountHolderName?.length,
                    )}
                    className="mt-1.5 mb-3.5"
                  />

                  {fieldErrors.details?.accountHolderName?.[0] && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.details.accountHolderName[0]}
                    </p>
                  )}
                </div>

                {/* Bank name */}
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank name</Label>

                  <Input
                    id="bank-name"
                    value={bankTransferDetails.bankName}
                    onChange={(event) => {
                      setBankTransferDetails((current) => ({
                        ...current,
                        bankName: event.target.value,
                      }));

                      if (fieldErrors.details?.bankName) {
                        setFieldErrors((current) => ({
                          ...current,
                          details: {
                            ...current.details,
                            bankName: undefined,
                          },
                        }));
                      }
                    }}
                    placeholder="HDFC Bank"
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.details?.bankName?.length,
                    )}
                    className="mt-1.5 mb-3.5"
                  />

                  {fieldErrors.details?.bankName?.[0] && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.details.bankName[0]}
                    </p>
                  )}
                </div>

                {/* Account number */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="account-number">Account number</Label>

                  <Input
                    id="account-number"
                    value={bankTransferDetails.accountNumber}
                    onChange={(event) => {
                      setBankTransferDetails((current) => ({
                        ...current,
                        accountNumber: event.target.value,
                      }));

                      if (fieldErrors.details?.accountNumber) {
                        setFieldErrors((current) => ({
                          ...current,
                          details: {
                            ...current.details,
                            accountNumber: undefined,
                          },
                        }));
                      }
                    }}
                    placeholder="1234567890"
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.details?.accountNumber?.length,
                    )}
                    className="mt-1.5 mb-3.5"
                  />

                  {fieldErrors.details?.accountNumber?.[0] && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.details.accountNumber[0]}
                    </p>
                  )}
                </div>

                {/* IFSC */}
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC code</Label>

                  <Input
                    id="ifsc"
                    value={bankTransferDetails.ifsc}
                    onChange={(event) => {
                      setBankTransferDetails((current) => ({
                        ...current,
                        ifsc: event.target.value,
                      }));

                      if (fieldErrors.details?.ifsc) {
                        setFieldErrors((current) => ({
                          ...current,
                          details: {
                            ...current.details,
                            ifsc: undefined,
                          },
                        }));
                      }
                    }}
                    placeholder="HDFC0001234"
                    disabled={isPending}
                    aria-invalid={Boolean(fieldErrors.details?.ifsc?.length)}
                    className="mt-1.5 mb-3.5"
                  />

                  {fieldErrors.details?.ifsc?.[0] && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.details.ifsc[0]}
                    </p>
                  )}
                </div>

                {/* SWIFT */}
                <div className="space-y-2">
                  <Label htmlFor="swift">
                    SWIFT code
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>

                  <Input
                    id="swift"
                    value={bankTransferDetails.swift}
                    onChange={(event) => {
                      setBankTransferDetails((current) => ({
                        ...current,
                        swift: event.target.value,
                      }));

                      if (fieldErrors.details?.swift) {
                        setFieldErrors((current) => ({
                          ...current,
                          details: {
                            ...current.details,
                            swift: undefined,
                          },
                        }));
                      }
                    }}
                    placeholder="HDFCINBB"
                    disabled={isPending}
                    aria-invalid={Boolean(fieldErrors.details?.swift?.length)}
                    className="mt-1.5 mb-1.5"
                  />

                  {fieldErrors.details?.swift?.[0] && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.details.swift[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'UPI' && (
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  UPI details
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the UPI ID customers should use for payment.
                </p>
              </div>

              <Label htmlFor="upi-id">UPI ID</Label>

              <Input
                id="upi-id"
                value={upiDetails.upiId}
                onChange={(event) => {
                  setUpiDetails({
                    upiId: event.target.value,
                  });

                  if (fieldErrors.details?.upiId) {
                    setFieldErrors((current) => ({
                      ...current,
                      details: {
                        ...current.details,
                        upiId: undefined,
                      },
                    }));
                  }
                }}
                placeholder="business@upi"
                disabled={isPending}
                aria-invalid={Boolean(fieldErrors.details?.upiId?.length)}
                className="mt-3.5"
              />

              {fieldErrors.details?.upiId?.[0] && (
                <p className="text-xs text-destructive">
                  {fieldErrors.details.upiId[0]}
                </p>
              )}
            </div>
          )}

          {type === 'PAYPAL' && (
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  PayPal details
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the PayPal email address customers should use for
                  payment.
                </p>
              </div>

              <Label htmlFor="paypal-email">PayPal email</Label>

              <Input
                id="paypal-email"
                type="email"
                value={paypalDetails.email}
                onChange={(event) => {
                  setPaypalDetails({
                    email: event.target.value,
                  });

                  if (fieldErrors.details?.email) {
                    setFieldErrors((current) => ({
                      ...current,
                      details: {
                        ...current.details,
                        email: undefined,
                      },
                    }));
                  }
                }}
                placeholder="payments@example.com"
                disabled={isPending}
                aria-invalid={Boolean(fieldErrors.details?.email?.length)}
                className="mt-3.5"
              />

              {fieldErrors.details?.email?.[0] && (
                <p className="text-xs text-destructive">
                  {fieldErrors.details.email[0]}
                </p>
              )}
            </div>
          )}

          {type === 'WISE' && (
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Wise details
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the Wise email address customers should use for payment.
                </p>
              </div>

              <Label htmlFor="wise-email">Wise email</Label>

              <Input
                id="wise-email"
                type="email"
                value={wiseDetails.email}
                onChange={(event) => {
                  setWiseDetails({
                    email: event.target.value,
                  });

                  if (fieldErrors.details?.email) {
                    setFieldErrors((current) => ({
                      ...current,
                      details: {
                        ...current.details,
                        email: undefined,
                      },
                    }));
                  }
                }}
                placeholder="payments@example.com"
                disabled={isPending}
                aria-invalid={Boolean(fieldErrors.details?.email?.length)}
                className="mt-3.5"
              />

              {fieldErrors.details?.email?.[0] && (
                <p className="text-xs text-destructive">
                  {fieldErrors.details.email[0]}
                </p>
              )}
            </div>
          )}

          {type === 'OTHER' && (
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Payment instructions
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Provide any payment instructions your customers should follow.
                </p>
              </div>

              <Label htmlFor="payment-instructions">Payment instructions</Label>

              <Textarea
                id="payment-instructions"
                value={otherDetails.instructions}
                onChange={(event) => {
                  setOtherDetails({
                    instructions: event.target.value,
                  });

                  if (fieldErrors.details?.instructions) {
                    setFieldErrors((current) => ({
                      ...current,
                      details: {
                        ...current.details,
                        instructions: undefined,
                      },
                    }));
                  }
                }}
                placeholder="Enter any payment instructions your customers need."
                rows={5}
                disabled={isPending}
                aria-invalid={Boolean(
                  fieldErrors.details?.instructions?.length,
                )}
                className="my-3.5"
              />

              <p className="text-xs text-muted-foreground">
                Provide the payment instructions customers should follow.
              </p>

              {fieldErrors.details?.instructions?.[0] && (
                <p className="text-xs text-destructive">
                  {fieldErrors.details.instructions[0]}
                </p>
              )}
            </div>
          )}

          {/* Default */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(event) => setIsDefault(event.target.checked)}
              disabled={isPending}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />

            <span className="space-y-0.5">
              <span className="block text-sm font-medium">Set as default</span>

              <span className="block text-xs text-muted-foreground">
                Use this payment method as the default option on invoices.
              </span>
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending
              ? paymentMethod
                ? 'Saving...'
                : 'Adding...'
              : paymentMethod
                ? 'Save changes'
                : 'Add payment method'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
