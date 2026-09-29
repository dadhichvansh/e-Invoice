'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type InvoiceItemForm = {
  description: string;
  quantity: string;
  rate: string;
};

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoiceItemsProps = {
  items: InvoiceItemForm[];
  isEditMode: boolean;
  isReadOnly: boolean;
  status: InvoiceStatus;
  discountPercentage: string;
  currencySymbol: string;
  onUpdateItem: (
    index: number,
    field: keyof InvoiceItemForm,
    value: string,
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onDiscountPercentageChange: (value: string) => void;
};

export function InvoiceItems({
  items,
  isEditMode,
  isReadOnly,
  status,
  currencySymbol,
  discountPercentage,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onDiscountPercentageChange,
}: InvoiceItemsProps) {
  const subtotal = items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;

    return total + quantity * rate;
  }, 0);

  const discountAmount = subtotal * ((Number(discountPercentage) || 0) / 100);

  const grandTotal = subtotal - discountAmount;

  return (
    <div className="rounded-2xl border p-6">
      <h2 className="text-lg font-semibold">Invoice Items</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {!isEditMode
          ? 'Add the products or services included in this invoice.'
          : isReadOnly
            ? status === 'PAID'
              ? 'This invoice is paid and its items cannot be modified.'
              : 'This invoice is cancelled and its items cannot be modified.'
            : 'Review and update the items included in this invoice.'}
      </p>

      <div className="mt-6 space-y-3">
        <div className="overflow-x-auto rounded-md border">
          <Table className="min-w-175">
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-32">Quantity</TableHead>
                <TableHead className="w-40">Rate</TableHead>
                <TableHead className="w-40 text-right">Amount</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item, index) => {
                const quantity = Number(item.quantity) || 0;
                const rate = Number(item.rate) || 0;
                const amount = quantity * rate;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(event) =>
                          onUpdateItem(index, 'description', event.target.value)
                        }
                        placeholder="Item description"
                        disabled={isReadOnly}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(event) =>
                          onUpdateItem(index, 'quantity', event.target.value)
                        }
                        disabled={isReadOnly}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate}
                        onChange={(event) =>
                          onUpdateItem(index, 'rate', event.target.value)
                        }
                        placeholder="0.00"
                        disabled={isReadOnly}
                      />
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {amount.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        disabled={items.length === 1 || isReadOnly}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onAddItem}
          className="px-2 text-primary hover:text-primary w-max"
          disabled={isReadOnly}
        >
          + Add item
        </Button>

        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>

              <span className="font-medium">
                {currencySymbol} {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="discount-percentage">Discount (%)</Label>

              <Input
                id="discount-percentage"
                type="number"
                min="0"
                max="100"
                step="any"
                value={discountPercentage}
                onChange={(event) =>
                  onDiscountPercentageChange(event.target.value)
                }
                className="w-28 text-right"
                disabled={isReadOnly}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount Amount</span>

              <span className="font-medium">
                {currencySymbol} {discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Grand Total</span>

                <span className="text-lg font-semibold">
                  {currencySymbol} {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
