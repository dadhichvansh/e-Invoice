'use client';

import Link from 'next/link';
import { Pencil, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type InvoiceTableInvoice = {
  id: string;
  slug: string;
  invoiceNumber: string;
  projectName: string | null;
  clientName: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  currency: string;
  grandTotal: unknown;
};

type InvoiceTableProps = {
  invoices: InvoiceTableInvoice[];
  isSearching: boolean;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function formatAmount(amount: unknown, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
  };

  return labels[status] ?? status;
}

export function InvoiceTable({ invoices, isSearching }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="mt-4 rounded-lg border">
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm font-medium">
            {isSearching
              ? 'No invoices match your filters.'
              : 'No invoices yet.'}
          </p>

          <p className="text-sm text-muted-foreground">
            {isSearching
              ? 'Try changing your search or filters.'
              : 'Create your first invoice to get started.'}
          </p>

          {!isSearching && (
            <Link href="/invoices/new">
              <Button>Add invoice</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-25 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="font-medium">{invoice.invoiceNumber}</div>
              </TableCell>

              <TableCell>
                <span className="text-muted-foreground">
                  {invoice.projectName || '—'}
                </span>
              </TableCell>

              <TableCell>
                <div className="font-medium">{invoice.clientName}</div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {formatDate(invoice.invoiceDate)}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {formatDate(invoice.dueDate)}
              </TableCell>

              <TableCell>
                <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                  {formatStatus(invoice.status)}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap text-right">
                {formatAmount(invoice.grandTotal, invoice.currency)}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-1">
                  {invoice.status !== 'CANCELLED' && (
                    <>
                      <Link href={`/invoices/${invoice.slug}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${invoice.invoiceNumber}`}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </Link>

                      <Link href={`/invoices/${invoice.slug}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${invoice.invoiceNumber}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                    </>
                  )}

                  {invoice.status === 'CANCELLED' && (
                    <span className="px-2 text-xs text-muted-foreground">
                      Cancelled
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
