import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '../ui/badge';

import { InvoiceViewActions } from './InvoiceViewActions';

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
  invoiceCategoryDescription: string | null;
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
    .replace(/[_-]/g, ' ')
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

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {invoice.invoiceNumber}
            </h1>

            <Badge
              variant="outline"
              className={`${getStatusClassName(invoice.status)} p-3 text-sm rounded-lg font-bold`}
            >
              {statusLabels[invoice.status].toUpperCase()}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage invoice details
          </p>
        </div>

        <InvoiceViewActions
          slug={invoice.slug}
          invoiceNumber={invoice.invoiceNumber}
          invoiceStatus={invoice.status}
        />
      </div>

      {/* Overview */}
      <section className="rounded-2xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Overview
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Key information about this invoice
              </p>
            </div>

            {invoice.invoiceCategoryName && (
              <Badge
                variant="secondary"
                className="shrink-0 flex items-end gap-2 flex-col"
              >
                {invoice.invoiceCategoryName}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs text-muted-foreground">Invoice Date</p>

            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              {formatDate(invoice.invoiceDate)}
            </p>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs text-muted-foreground">Due Date</p>

            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              {formatDate(invoice.dueDate)}
            </p>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs text-muted-foreground">Total Amount</p>

            <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
              {formatMoney(invoice.grandTotal, currency, invoice.currency)}
            </p>
          </div>
        </div>
      </section>

      {/* People & Project */}
      <div
        className={
          invoice.projectName || invoice.projectDescription
            ? 'grid gap-5 lg:grid-cols-2'
            : 'grid gap-5'
        }
      >
        {/* Client */}
        <section className="rounded-2xl border bg-background">
          <div className="border-b px-5 py-4 sm:px-6">
            <SectionHeader
              icon={UserRound}
              title="Client"
              description="The recipient of this invoice"
            />
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="space-y-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {invoice.clientName}
                </p>

                {invoice.clientCompany && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {invoice.clientCompany}
                  </p>
                )}
              </div>

              <div className="space-y-2.5 text-sm text-muted-foreground">
                {clientAddress && (
                  <p className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />

                    <span>{clientAddress}</span>
                  </p>
                )}

                <p className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 size-3.5 shrink-0" />

                  <span className="break-all">{invoice.clientEmail}</span>
                </p>

                {invoice.clientPhone && (
                  <p className="flex items-center gap-2.5">
                    <Phone className="size-3.5 shrink-0" />

                    <span>{invoice.clientPhone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project */}
        {(invoice.projectName || invoice.projectDescription) && (
          <section className="rounded-2xl border bg-background">
            <div className="border-b px-5 py-4 sm:px-6">
              <SectionHeader
                icon={FileText}
                title="Project"
                description="Context associated with this invoice"
              />
            </div>

            <div className="px-5 py-5 sm:px-6">
              {invoice.projectName && (
                <p className="text-base font-semibold text-foreground">
                  {invoice.projectName}
                </p>
              )}

              {invoice.projectDescription && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {invoice.projectDescription}
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Business Information */}
      <section className="rounded-2xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <SectionHeader
            icon={FileText}
            title="Business Information"
            description="Business details associated with this invoice"
          />
        </div>

        <div className="grid gap-x-8 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Business Name</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {businessName}
            </p>
          </div>

          {businessProfile?.email && (
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-foreground">
                {businessProfile.email}
              </p>
            </div>
          )}

          {businessProfile?.phone && (
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {businessProfile.phone}
              </p>
            </div>
          )}

          {businessProfile?.website && (
            <div>
              <p className="text-xs text-muted-foreground">Website</p>
              <p className="mt-1 break-all text-sm font-medium text-foreground">
                {businessProfile.website}
              </p>
            </div>
          )}

          {businessAddress && (
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs text-muted-foreground">Address</p>

              <p className="mt-1 flex items-start gap-2 text-sm font-medium text-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

                <span>{businessAddress}</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Line Items */}
      <section className="rounded-2xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Line Items
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Products and services included in this invoice
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-160">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground">
                    Description
                  </TableHead>

                  <TableHead className="h-10 w-24 px-4 text-right text-xs font-medium text-muted-foreground">
                    Qty
                  </TableHead>

                  <TableHead className="h-10 w-36 px-4 text-right text-xs font-medium text-muted-foreground">
                    Rate
                  </TableHead>

                  <TableHead className="h-10 w-40 px-4 text-right text-xs font-medium text-muted-foreground">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3.5 font-medium text-foreground">
                      {item.description}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right text-sm text-muted-foreground">
                      {item.quantity.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right text-sm text-muted-foreground">
                      {formatMoney(item.rate, currency, invoice.currency)}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right text-sm font-medium text-foreground">
                      {formatMoney(item.amount, currency, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Financial Summary */}
          <div className="mt-5 flex justify-end">
            <div className="w-full max-w-sm">
              <div className="space-y-2.5">
                <InfoRow
                  label="Subtotal"
                  value={formatMoney(
                    invoice.subtotal,
                    currency,
                    invoice.currency,
                  )}
                />

                {invoice.discountPercentage > 0 && (
                  <InfoRow
                    label={`Discount (${invoice.discountPercentage}%)`}
                    value={
                      <>
                        -
                        {formatMoney(
                          invoice.discountAmount,
                          currency,
                          invoice.currency,
                        )}
                      </>
                    }
                  />
                )}

                <div className="border-t pt-3">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Total
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {currency?.name || invoice.currency}
                      </p>
                    </div>

                    <p className="text-xl font-bold tracking-tight text-foreground">
                      {formatMoney(
                        invoice.grandTotal,
                        currency,
                        invoice.currency,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      {hasPaymentInformation && (
        <section className="rounded-2xl border bg-background">
          <div className="border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Payment Information
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Payment method and reference information
              </p>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-5 sm:px-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Payment Method
              </p>

              <div className="mt-3 divide-y">
                {invoice.paymentMethodName && (
                  <InfoRow label="Name" value={invoice.paymentMethodName} />
                )}

                {invoice.paymentMethodType && (
                  <InfoRow
                    label="Type"
                    value={formatPaymentMethodType(invoice.paymentMethodType)}
                  />
                )}

                {invoice.paymentReference && (
                  <InfoRow label="Reference" value={invoice.paymentReference} />
                )}
              </div>
            </div>

            {paymentDetails.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Payment Details
                </p>

                <div className="mt-3 divide-y">
                  {paymentDetails.map((detail) => (
                    <InfoRow
                      key={detail.label}
                      label={detail.label === 'Ifsc' ? 'IFSC' : detail.label}
                      value={detail.value}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid gap-5 md:grid-cols-2">
          {invoice.notes && (
            <section className="rounded-2xl border bg-background">
              <div className="border-b px-5 py-4 sm:px-6">
                <h2 className="text-sm font-semibold text-foreground">Notes</h2>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {invoice.notes}
                </p>
              </div>
            </section>
          )}

          {invoice.terms && (
            <section className="rounded-2xl border bg-background">
              <div className="border-b px-5 py-4 sm:px-6">
                <h2 className="text-sm font-semibold text-foreground">
                  Terms & Conditions
                </h2>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {invoice.terms}
                </p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
