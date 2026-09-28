import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type RecentInvoice = {
  id: string;
  slug: string;
  invoiceNumber: string;
  clientName: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';
  currency: string;
  grandTotal: number;
};

type RecentInvoicesProps = {
  invoices: RecentInvoice[];
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({ status }: { status: RecentInvoice['status'] }) {
  if (status === 'PAID') {
    return (
      <Badge className="border-transparent bg-primary/15 text-primary hover:bg-primary/15">
        Paid
      </Badge>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <Badge className="border-transparent bg-destructive/15 text-destructive hover:bg-destructive/15">
        Cancelled
      </Badge>
    );
  }

  if (status === 'DRAFT') {
    return (
      <Badge className="border-border bg-secondary text-muted-foreground hover:bg-secondary">
        Draft
      </Badge>
    );
  }

  return (
    <Badge className="border-border bg-secondary text-muted-foreground hover:bg-secondary">
      Pending
    </Badge>
  );
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card className="overflow-hidden rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-6">
        <div>
          <CardTitle>Recent Invoices</CardTitle>

          <CardDescription>
            Your latest invoices and their payment status.
          </CardDescription>
        </div>

        <Link
          href="/invoices"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>

      <CardContent className="px-0">
        {/* Desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="transition-colors hover:bg-secondary/40"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <FileText className="size-4" />
                      </div>

                      <Link
                        href={`/invoices/${invoice.slug}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(invoice.clientName)}
                      </div>

                      <span className="font-medium">{invoice.clientName}</span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(invoice.invoiceDate)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>

                  <TableCell className="pr-6 text-right font-semibold whitespace-nowrap">
                    {formatAmount(invoice.grandTotal, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-border md:hidden">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="px-5 py-4 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <FileText className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/invoices/${invoice.slug}`}
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      {invoice.invoiceNumber}
                    </Link>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {invoice.clientName}
                    </p>
                  </div>
                </div>

                <StatusBadge status={invoice.status} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 pl-12">
                <span className="text-xs text-muted-foreground">
                  {formatDate(invoice.invoiceDate)}
                </span>

                <span className="text-sm font-semibold text-foreground">
                  {formatAmount(invoice.grandTotal, invoice.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No invoices found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
