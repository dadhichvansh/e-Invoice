'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

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

import { createPaymentMethod } from '@/actions/settings/payment-methods/createPaymentMethod';

type PaymentMethodType = 'BANK_TRANSFER' | 'UPI' | 'PAYPAL' | 'WISE' | 'OTHER';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
}: AddPaymentMethodDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PaymentMethodType>('BANK_TRANSFER');
  const [details, setDetails] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string[];
    type?: string[];
    details?: string[];
    isDefault?: string[];
  }>({});

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setName('');
    setType('BANK_TRANSFER');
    setDetails('');
    setIsDefault(false);
    setFieldErrors({});
  };

  const handleSubmit = () => {
    setFieldErrors({});

    startTransition(async () => {
      const result = await createPaymentMethod({
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
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>

          <DialogDescription>
            Add payment instructions that can be shown on your invoices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
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

              <SelectContent>
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

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="payment-method-details">Payment details</Label>

            <Textarea
              id="payment-method-details"
              value={details}
              onChange={(event) => {
                setDetails(event.target.value);

                if (fieldErrors.details) {
                  setFieldErrors((current) => ({
                    ...current,
                    details: undefined,
                  }));
                }
              }}
              placeholder={
                'Account Name: ABC Technologies\nBank: HDFC Bank\nAccount Number: XXXXXXXX\nIFSC: HDFC0001234'
              }
              rows={5}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.details?.length)}
            />

            <p className="text-xs text-muted-foreground">
              Enter the payment information your customers need.
            </p>

            {fieldErrors.details?.[0] && (
              <p className="text-xs text-destructive">
                {fieldErrors.details[0]}
              </p>
            )}
          </div>

          {/* Default */}
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
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
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add payment method'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
