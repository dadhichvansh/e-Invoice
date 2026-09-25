import { FileText, Mail, MapPin, Phone, UserRound } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { InvoiceViewActions } from './InvoiceViewActions';
import { Badge } from '../ui/badge';

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoiceViewItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sortOrder: number;
};

type InvoiceViewInvoice = {
  id: string;
  slug: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  projectName: string | null;
  projectDescription: string | null;
  discountPercentage: number;
  discountAmount: number;
  paymentReference: string | null;
  notes: string | null;
  terms: string | null;
  subtotal: number;
  grandTotal: number;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  clientCity: string | null;
  clientState: string | null;
  clientPostalCode: string | null;
  clientCountry: string | null;
  paymentMethodName: string | null;
  paymentMethodType:
    | 'BANK_TRANSFER'
    | 'UPI'
    | 'PAYPAL'
    | 'WISE'
    | 'OTHER'
    | null;
  paymentMethodDetails: unknown;
  invoiceCategoryName: string | null;
  invoiceCategoryCode: string | null;
  items: InvoiceViewItem[];
};

type InvoiceViewBusinessProfile = {
  businessName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
};

type InvoiceViewCurrency = {
  code: string;
  name: string;
  symbol: string;
};

type InvoiceViewProps = {
  invoice: InvoiceViewInvoice;
  businessProfile: InvoiceViewBusinessProfile | null;
  currency: InvoiceViewCurrency | null;
};

const statusLabels: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatMoney(
  amount: number,
  currency: InvoiceViewCurrency | null,
  currencyCode: string,
) {
  if (currency) {
    return `${currency.symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function getStatusClassName(status: InvoiceStatus) {
  switch (status) {
    case 'PAID':
      return 'border-green-200 bg-green-50 text-green-700';

    case 'PENDING':
      return 'border-amber-200 bg-amber-50 text-amber-700';

    case 'CANCELLED':
      return 'border-red-200 bg-red-50 text-red-700';

    case 'DRAFT':
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function formatPaymentMethodType(
  type: InvoiceViewInvoice['paymentMethodType'],
) {
  if (!type) {
    return null;
  }

  switch (type) {
    case 'BANK_TRANSFER':
      return 'Bank Transfer';

    case 'UPI':
      return 'UPI';

    case 'PAYPAL':
      return 'PayPal';

    case 'WISE':
      return 'Wise';

    case 'OTHER':
      return 'Other';

    default:
      return type;
  }
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\_-]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPaymentDetails(details: unknown) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return [];
  }

  return Object.entries(details as Record<string, unknown>)
    .filter(
      ([, value]) =>
        value !== null && value !== undefined && String(value).trim() !== '',
    )
    .map(([key, value]) => ({
      label: humanizeKey(key),
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
}

export function InvoiceView({
  invoice,
  businessProfile,
  currency,
}: InvoiceViewProps) {
  const businessName = businessProfile?.businessName?.trim() || 'Your Business';

  const businessAddress = [
    businessProfile?.address,
    businessProfile?.city,
    businessProfile?.state,
    businessProfile?.postalCode,
    businessProfile?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const clientAddress = [
    invoice.clientAddress,
    invoice.clientCity,
    invoice.clientState,
    invoice.clientPostalCode,
    invoice.clientCountry,
  ]
    .filter(Boolean)
    .join(', ');

  const paymentDetails = formatPaymentDetails(invoice.paymentMethodDetails);

  const hasPaymentInformation =
    invoice.paymentMethodName ||
    invoice.paymentMethodType ||
    invoice.paymentReference ||
    paymentDetails.length > 0;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {invoice.invoiceNumber}
              </h1>

              <Badge
                variant="outline"
                className={getStatusClassName(invoice.status)}
              >
                {statusLabels[invoice.status]}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>Issued {formatDate(invoice.invoiceDate)}</span>
              <span aria-hidden="true">·</span>
              <span>Due {formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>

        <InvoiceViewActions
          slug={invoice.slug}
          invoiceNumber={invoice.invoiceNumber}
          invoiceStatus={invoice.status}
        />
      </div>

      {/* Invoice Document */}
      <article
        id="invoice-document"
        className="overflow-hidden rounded-2xl border bg-background shadow-sm"
      >
        {/* Invoice Header */}
        <section className="border-b bg-primary/4 px-5 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            {/* Business */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Invoice
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {businessName}
              </h2>

              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {businessAddress && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} /> {businessAddress}
                  </p>
                )}

                {businessProfile?.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} /> {businessProfile.email}
                  </p>
                )}

                {businessProfile?.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} /> {businessProfile.phone}
                  </p>
                )}

                {businessProfile?.website && <p>{businessProfile.website}</p>}
              </div>
            </div>

            {/* Invoice metadata */}
            <div className="min-w-48 lg:text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Invoice #
              </p>

              <p className="mt-1 text-lg font-semibold text-foreground">
                {invoice.invoiceNumber}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Issue Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(invoice.invoiceDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Due Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>

                {invoice.invoiceCategoryName && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {invoice.invoiceCategoryName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Client + Project */}
        <section className="px-5 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-primary" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Billed To
                </p>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold text-foreground">
                  {invoice.clientName}
                </p>

                {invoice.clientCompany && (
                  <p className="text-muted-foreground">
                    {invoice.clientCompany}
                  </p>
                )}

                {clientAddress && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin size={12} /> {clientAddress}
                  </p>
                )}

                <div className="pt-1 text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} /> {invoice.clientEmail}
                  </p>

                  {invoice.clientPhone && (
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} /> {invoice.clientPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {(invoice.projectName || invoice.projectDescription) && (
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Project
                  </p>
                </div>

                {invoice.projectName && (
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {invoice.projectName}
                  </p>
                )}

                {invoice.projectDescription && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {invoice.projectDescription}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Items */}
        <section className="px-5 pb-7 sm:px-8 lg:px-10">
          <div className="overflow-x-auto rounded-xl border">
            <Table className="min-w-160">
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead className="h-auto px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </TableHead>

                  <TableHead className="h-auto w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Qty
                  </TableHead>

                  <TableHead className="h-auto w-36 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rate
                  </TableHead>

                  <TableHead className="h-auto w-40 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-4 font-medium text-foreground">
                      {item.description}
                    </TableCell>

                    <TableCell className="px-4 py-4 text-right text-muted-foreground">
                      {item.quantity.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })}
                    </TableCell>

                    <TableCell className="px-4 py-4 text-right text-muted-foreground">
                      {formatMoney(item.rate, currency, invoice.currency)}
                    </TableCell>

                    <TableCell className="px-4 py-4 text-right font-medium text-foreground">
                      {formatMoney(item.amount, currency, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-md space-y-3">
              <div className="flex items-center justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Subtotal</span>

                <span className="font-medium text-foreground">
                  {formatMoney(invoice.subtotal, currency, invoice.currency)}
                </span>
              </div>

              {invoice.discountPercentage > 0 && (
                <div className="flex items-center justify-between gap-8 text-sm">
                  <span className="text-muted-foreground">
                    Discount ({invoice.discountPercentage}%)
                  </span>

                  <span className="font-medium text-foreground">
                    -
                    {formatMoney(
                      invoice.discountAmount,
                      currency,
                      invoice.currency,
                    )}
                  </span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex items-center justify-between gap-8 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground">
                  <span className="font-semibold">Grand Total</span>

                  <span className="text-lg font-bold">
                    {formatMoney(
                      invoice.grandTotal,
                      currency,
                      invoice.currency,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Information */}
        {hasPaymentInformation && (
          <section className="border-t px-5 py-7 sm:px-8 lg:px-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Payment Information
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  {invoice.paymentMethodType && (
                    <div className="flex flex-wrap gap-x-2">
                      <span className="text-muted-foreground">Type:</span>

                      <span className="font-medium text-foreground">
                        {formatPaymentMethodType(invoice.paymentMethodType)}
                      </span>
                    </div>
                  )}

                  {invoice.paymentReference && (
                    <div className="flex flex-wrap gap-x-2">
                      <span className="text-muted-foreground">Reference:</span>

                      <span className="font-medium text-foreground">
                        {invoice.paymentReference}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {paymentDetails.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Payment Details
                  </p>

                  <div className="mt-3 space-y-2 text-sm">
                    {paymentDetails.map((detail) => (
                      <div
                        key={detail.label}
                        className="flex flex-wrap gap-x-2"
                      >
                        <span className="text-muted-foreground">
                          {detail.label === 'Ifsc'
                            ? detail.label.toUpperCase()
                            : detail.label}
                          :
                        </span>

                        <span className="break-all font-medium text-foreground">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <section className="border-t px-5 py-7 sm:px-8 lg:px-10">
            <div className="grid gap-8 md:grid-cols-2">
              {invoice.notes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Notes
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {invoice.notes}
                  </p>
                </div>
              )}

              {invoice.terms && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Terms & Conditions
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {invoice.terms}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t px-5 py-5 text-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            Thank you for your business.
          </p>
        </footer>
      </article>
    </div>
  );
}
