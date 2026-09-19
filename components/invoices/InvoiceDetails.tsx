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

type InvoiceDetailsClient = {
  id: string;
  name: string;
  email: string;
  company: string | null;
};

type InvoiceDetailsCategory = {
  id: string;
  name: string;
  code: string;
};

type InvoiceDetailsCurrency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
};

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoiceDetailsProps = {
  clients: InvoiceDetailsClient[];
  categories: InvoiceDetailsCategory[];
  currencies: InvoiceDetailsCurrency[];

  clientId: string;
  invoiceCategoryId: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  projectName: string;
  projectDescription: string;

  onClientChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: InvoiceStatus) => void;
  onInvoiceDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onProjectDescriptionChange: (value: string) => void;
};

export function InvoiceDetails({
  clients,
  categories,
  currencies,
  clientId,
  invoiceCategoryId,
  status,
  invoiceDate,
  dueDate,
  currency,
  projectName,
  projectDescription,
  onClientChange,
  onCategoryChange,
  onStatusChange,
  onInvoiceDateChange,
  onDueDateChange,
  onCurrencyChange,
  onProjectNameChange,
  onProjectDescriptionChange,
}: InvoiceDetailsProps) {
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-base font-semibold">Invoice Details</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Add the basic details for this invoice.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Client */}
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>

          <Select
            value={clientId}
            onValueChange={(value) => onClientChange(value ?? '')}
          >
            <SelectTrigger id="client" className="w-full">
              <SelectValue placeholder="Select a client">
                {(value) => {
                  const client = clients.find((client) => client.id === value);

                  return client
                    ? client.company
                      ? `${client.name} — ${client.company}`
                      : client.name
                    : 'Select a client';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company
                    ? `${client.name} — ${client.company}`
                    : client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="invoice-category">Category</Label>

          <Select
            value={invoiceCategoryId}
            onValueChange={(value) => onCategoryChange(value ?? '')}
          >
            <SelectTrigger id="invoice-category" className="w-full">
              <SelectValue placeholder="Select a category">
                {(value) => {
                  const category = categories.find(
                    (category) => category.id === value,
                  );

                  return category
                    ? `${category.name} (${category.code})`
                    : 'Select a category';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Invoice Date */}
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Invoice Date</Label>

          <Input
            id="invoice-date"
            type="date"
            value={invoiceDate}
            onChange={(event) => onInvoiceDateChange(event.target.value)}
          />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>

          <Input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>

          <Select
            value={currency}
            onValueChange={(value) => onCurrencyChange(value ?? '')}
            disabled={currencies.length === 0}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue
                placeholder={
                  currencies.length === 0
                    ? 'No currencies available'
                    : 'Select currency'
                }
              >
                {(value) => {
                  const selectedCurrency = currencies.find(
                    (currency) => currency.code === value,
                  );

                  return selectedCurrency
                    ? `${selectedCurrency.symbol} ${selectedCurrency.code} — ${selectedCurrency.name}`
                    : currencies.length === 0
                      ? 'No currencies available'
                      : 'Select currency';
                }}
              </SelectValue>
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
              Add at least one currency in the invoicing settings before
              creating an invoice.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Select the currency for this invoice.
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="invoice-status">Status</Label>

          <Select
            value={status}
            onValueChange={(value) => {
              if (value !== null) {
                onStatusChange(value as InvoiceStatus);
              }
            }}
          >
            <SelectTrigger id="invoice-status" className="w-full">
              <SelectValue placeholder="Select a status">
                {(value) => {
                  const statusLabels: Record<string, string> = {
                    DRAFT: 'Draft',
                    PENDING: 'Pending',
                    PAID: 'Paid',
                    CANCELLED: 'Cancelled',
                  };

                  return statusLabels[value] ?? 'Select a status';
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={4}
            >
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Set the initial status of this invoice.
          </p>
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>

          <Input
            id="project-name"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            placeholder="Enter project name"
          />
        </div>

        {/* Project Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="project-description">Project Description</Label>

          <Textarea
            id="project-description"
            value={projectDescription}
            onChange={(event) => onProjectDescriptionChange(event.target.value)}
            placeholder="Add a description for the project"
            className="min-h-24"
          />
        </div>
      </div>
    </div>
  );
}
