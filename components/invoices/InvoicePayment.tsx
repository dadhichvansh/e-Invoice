'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type InvoicePaymentMethod = {
  id: string;
  name: string;
  type: string;
};

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoicePaymentProps = {
  paymentMethods: InvoicePaymentMethod[];
  isEditMode: boolean;
  isReadOnly: boolean;
  status: InvoiceStatus;
  paymentMethodId: string;
  paymentReference: string;
  notes: string;
  terms: string;
  onPaymentMethodChange: (value: string) => void;
  onPaymentReferenceChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
};

export function InvoicePayment({
  paymentMethods,
  isEditMode,
  isReadOnly,
  status,
  paymentMethodId,
  paymentReference,
  notes,
  terms,
  onPaymentMethodChange,
  onPaymentReferenceChange,
  onNotesChange,
  onTermsChange,
}: InvoicePaymentProps) {
  return (
    <div className="rounded-2xl border p-6">
      <h2 className="text-lg font-semibold">Payment & Notes</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {!isEditMode
          ? 'Add payment information and any additional notes.'
          : isReadOnly
            ? status === 'PAID'
              ? 'This invoice is paid and its payment details cannot be modified.'
              : 'This invoice is cancelled and its payment details cannot be modified.'
            : 'Review and update the payment information and additional notes.'}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="payment-method">
            Payment Method <span className="text-destructive">*</span>
          </Label>

          <Select
            value={paymentMethodId}
            onValueChange={(value) => onPaymentMethodChange(value ?? '')}
            disabled={isEditMode}
          >
            <SelectTrigger id="payment-method" className="w-full">
              <SelectValue placeholder="Select a payment method">
                {(value) => {
                  const paymentMethod = paymentMethods.find(
                    (paymentMethod) => paymentMethod.id === value,
                  );

                  return paymentMethod
                    ? paymentMethod.name
                    : 'Select a payment method';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              {paymentMethods.map((paymentMethod) => (
                <SelectItem key={paymentMethod.id} value={paymentMethod.id}>
                  {paymentMethod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEditMode && (
          <div className="space-y-2">
            <Label htmlFor="payment-reference">
              Payment Reference{' '}
              {status === 'PAID' && <span className="text-destructive">*</span>}
            </Label>

            <Input
              id="payment-reference"
              value={paymentReference}
              onChange={(event) => onPaymentReferenceChange(event.target.value)}
              placeholder="e.g. UTR123456789012"
              disabled={isReadOnly}
            />

            {status === 'PAID' && !paymentReference && (
              <p className="text-xs text-muted-foreground">
                A payment reference is required before marking this invoice as
                paid.
              </p>
            )}
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>

          <Textarea
            id="notes"
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Add notes for your client"
            className="min-h-24"
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="terms">Terms & Conditions</Label>

          <Textarea
            id="terms"
            value={terms}
            onChange={(event) => onTermsChange(event.target.value)}
            placeholder="Add terms and conditions for this invoice"
            className="min-h-24"
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}
