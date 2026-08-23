import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

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

function getStatusVariant(status: string) {
  switch (status) {
    case 'Paid':
      return 'default';

    case 'Overdue':
      return 'destructive';

    case 'Pending':
    default:
      return 'secondary';
  }
}

export function RecentInvoices() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-6 font-medium">
                    {invoice.id}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {invoice.client}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {invoice.date}
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-6 text-right font-medium whitespace-nowrap">
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
