'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { InvoiceTable } from './InvoiceTable';

type Invoice = {
  id: string;
  slug: string;
  invoiceNumber: string;
  projectName: string | null;
  clientId: string | null;
  clientName: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  currency: string;
  grandTotal: unknown;
};

type InvoicesProps = {
  invoices: Invoice[];
};

export function Invoices({ invoices }: InvoicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const clients = useMemo(() => {
    const uniqueClients = new Map<string, string>();

    invoices.forEach((invoice) => {
      if (invoice.clientId) {
        uniqueClients.set(invoice.clientId, invoice.clientName);
      }
    });

    return Array.from(uniqueClients.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !query ||
        [
          invoice.invoiceNumber,
          invoice.projectName,
          invoice.clientName,
          invoice.status,
          invoice.currency,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'active'
          ? invoice.status !== 'CANCELLED'
          : statusFilter === 'all' || invoice.status === statusFilter;

      const matchesClient =
        clientFilter === 'all' || invoice.clientId === clientFilter;

      const matchesDate = (() => {
        if (dateFilter === 'all') {
          return true;
        }

        const invoiceDate = new Date(invoice.invoiceDate);
        const now = new Date();

        if (dateFilter === 'this-month') {
          return (
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() === now.getFullYear()
          );
        }

        if (dateFilter === 'last-30-days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          return invoiceDate >= thirtyDaysAgo;
        }

        if (dateFilter === 'last-90-days') {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(now.getDate() - 90);

          return invoiceDate >= ninetyDaysAgo;
        }

        return true;
      })();

      return matchesSearch && matchesStatus && matchesClient && matchesDate;
    });
  }, [invoices, searchQuery, statusFilter, clientFilter, dateFilter]);

  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'active' ||
    clientFilter !== 'all' ||
    dateFilter !== 'all';

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and track your invoices.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            {filteredInvoices.length}{' '}
            {filteredInvoices.length === 1 ? 'invoice' : 'invoices'}
          </p>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search invoices..."
              aria-label="Search invoices"
              className="sm:max-w-xs"
            />

            <Link href="/invoices/new" className="shrink-0">
              <Button className="w-full sm:w-auto">Add invoice</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? 'active')}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter status">
                {(value) => {
                  const labels: Record<string, string> = {
                    active: 'Active',
                    all: 'All statuses',
                    DRAFT: 'Draft',
                    PENDING: 'Pending',
                    PAID: 'Paid',
                    CANCELLED: 'Cancelled',
                  };

                  return labels[value] ?? 'Active';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={clientFilter}
            onValueChange={(value) => setClientFilter(value ?? 'all')}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filter client">
                {(value) => {
                  if (value === 'all') {
                    return 'All clients';
                  }

                  const client = clients.find(([id]) => id === value);

                  return client?.[1] ?? 'All clients';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              <SelectItem value="all">All clients</SelectItem>

              {clients.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={(value) => setDateFilter(value ?? 'all')}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter date">
                {(value) => {
                  const labels: Record<string, string> = {
                    all: 'All dates',
                    'this-month': 'This month',
                    'last-30-days': 'Last 30 days',
                    'last-90-days': 'Last 90 days',
                  };

                  return labels[value] ?? 'All dates';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('active');
                setClientFilter('all');
                setDateFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        <InvoiceTable invoices={filteredInvoices} isSearching={hasFilters} />
      </div>
    </main>
  );
}
