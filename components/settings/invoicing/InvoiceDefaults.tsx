import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InvoiceDefaultsProps {
  data: {
    invoicePrefix: string;
    defaultCurrency: string;
    defaultPaymentTerms: string;
  };

  currencies: {
    id: string;
    code: string;
    name: string;
    symbol: string;
  }[];

  onChange: (
    field: 'invoicePrefix' | 'defaultCurrency' | 'defaultPaymentTerms',
    value: string,
  ) => void;
}

export function InvoiceDefaults({
  data,
  currencies,
  onChange,
}: InvoiceDefaultsProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Invoice defaults
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure the default values used when creating new invoices.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Invoice prefix */}
          <div className="space-y-2">
            <Label htmlFor="invoice-prefix">Invoice prefix</Label>

            <Input
              id="invoice-prefix"
              value={data.invoicePrefix}
              onChange={(event) =>
                onChange('invoicePrefix', event.target.value)
              }
              placeholder="e.g., INV"
            />

            <p className="text-xs text-muted-foreground">
              Used at the beginning of generated invoice numbers.
            </p>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="default-currency">Default currency</Label>

            <Select
              value={data.defaultCurrency}
              onValueChange={(value) => {
                if (value !== null) {
                  onChange('defaultCurrency', value);
                }
              }}
              disabled={currencies.length === 0}
            >
              <SelectTrigger id="default-currency" className="w-full">
                <SelectValue
                  placeholder={
                    currencies.length === 0
                      ? 'No currencies available'
                      : 'Select currency'
                  }
                />
              </SelectTrigger>

              <SelectContent
                alignItemWithTrigger={false}
                side="bottom"
                sideOffset={4}
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.code}>
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-center">{currency.symbol}</span>

                      <span>
                        {currency.code} — {currency.name}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currencies.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Add at least one currency in the Currencies section before
                selecting a default currency.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Used as the default currency for new invoices.
              </p>
            )}
          </div>

          {/* Payment terms */}
          <div className="space-y-2">
            <Label htmlFor="default-payment-terms">Default payment terms</Label>

            <div className="flex items-center gap-2">
              <Input
                id="default-payment-terms"
                type="number"
                min="0"
                value={data.defaultPaymentTerms}
                onChange={(event) =>
                  onChange('defaultPaymentTerms', event.target.value)
                }
                placeholder="e.g., 7"
              />

              <span className="shrink-0 text-sm text-muted-foreground">
                days
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Invoices will be due{' '}
              {data.defaultPaymentTerms
                ? `${data.defaultPaymentTerms} days`
                : 'after the specified number of days'}{' '}
              after they are issued.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
