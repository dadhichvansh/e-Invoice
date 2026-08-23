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

const recentInvoices = [
  {
    id: 'INV-2026-008',
    client: 'Acme Technologies',
    date: 'Aug 21, 2026',
    amount: '₹18,500.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-007',
    client: 'PixelCraft Studio',
    date: 'Aug 18, 2026',
    amount: '₹12,000.00',
    status: 'Pending',
  },
  {
    id: 'INV-2026-006',
    client: 'Nova Digital',
    date: 'Aug 15, 2026',
    amount: '₹8,500.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-005',
    client: 'BrightStack Solutions',
    date: 'Aug 11, 2026',
    amount: '₹24,000.00',
    status: 'Overdue',
  },
  {
    id: 'INV-2026-004',
    client: 'Vertex Labs',
    date: 'Aug 07, 2026',
    amount: '₹15,000.00',
    status: 'Paid',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Paid') {
    return (
      <Badge className="border-transparent bg-primary/15 text-primary hover:bg-primary/15">
        Paid
      </Badge>
    );
  }

  if (status === 'Overdue') {
    return (
      <Badge className="border-transparent bg-destructive/15 text-destructive hover:bg-destructive/15">
        Overdue
      </Badge>
    );
  }

  return (
    <Badge className="border-border bg-secondary text-muted-foreground hover:bg-secondary">
      Pending
    </Badge>
  );
}

export function RecentInvoices() {
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
              {recentInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="transition-colors hover:bg-secondary/40"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <FileText className="size-4" />
                      </div>

                      <span className="font-medium text-foreground">
                        {invoice.id}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(invoice.client)}
                      </div>

                      <span className="font-medium">{invoice.client}</span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {invoice.date}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>

                  <TableCell className="pr-6 text-right font-semibold whitespace-nowrap">
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-border md:hidden">
          {recentInvoices.map((invoice) => (
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
                    <p className="truncate text-sm font-medium text-foreground">
                      {invoice.id}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {invoice.client}
                    </p>
                  </div>
                </div>

                <StatusBadge status={invoice.status} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 pl-12">
                <span className="text-xs text-muted-foreground">
                  {invoice.date}
                </span>

                <span className="text-sm font-semibold text-foreground">
                  {invoice.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
