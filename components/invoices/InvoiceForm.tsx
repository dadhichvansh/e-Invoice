'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

import { InvoiceItems, type InvoiceItemForm } from './InvoiceItems';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoicePayment } from './InvoicePayment';

import { createInvoice } from '@/actions/invoices/createInvoice';

type InvoiceFormClient = {
  id: string;
  name: string;
  email: string;
  company: string | null;
};

type InvoiceFormCategory = {
  id: string;
  name: string;
  code: string;
};

type InvoiceFormPaymentMethod = {
  id: string;
  name: string;
  type: string;
};

type InvoiceFormCurrency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
};

type InvoiceFormProps = {
  clients: InvoiceFormClient[];
  categories: InvoiceFormCategory[];
  paymentMethods: InvoiceFormPaymentMethod[];
  currencies: InvoiceFormCurrency[];
  defaultCurrency: string;
  defaultPaymentTerms: number;
  defaultNotes: string;
};

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

export function InvoiceForm({
  clients,
  categories,
  paymentMethods,
  currencies,
  defaultCurrency,
  defaultPaymentTerms,
  defaultNotes,
}: InvoiceFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState('');
  const [invoiceCategoryId, setInvoiceCategoryId] = useState('');

  const [invoiceDate, setInvoiceDate] = useState(() => {
    const date = new Date();

    return date.toISOString().split('T')[0];
  });

  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();

    date.setDate(date.getDate() + defaultPaymentTerms);

    return date.toISOString().split('T')[0];
  });

  const [currency, setCurrency] = useState(defaultCurrency);
  const [status, setStatus] = useState<InvoiceStatus>('DRAFT');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [items, setItems] = useState<InvoiceItemForm[]>([
    {
      description: '',
      quantity: '1',
      rate: '',
    },
  ]);

  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState(defaultNotes);
  const [terms, setTerms] = useState('');

  function updateItem(
    index: number,
    field: keyof InvoiceItemForm,
    value: string,
  ) {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        description: '',
        quantity: '1',
        rate: '',
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const result = await createInvoice({
      clientId,
      invoiceCategoryId: invoiceCategoryId || null,
      paymentMethodId: paymentMethodId || null,
      invoiceDate: new Date(`${invoiceDate}T00:00:00`),
      dueDate: new Date(`${dueDate}T00:00:00`),
      currency,
      status,
      projectName: projectName || null,
      projectDescription: projectDescription || null,
      discountPercentage: Number(discountPercentage) || 0,
      paymentReference: paymentReference || null,
      notes: notes || null,
      terms: terms || null,
      items: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
      })),
    });

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);

    router.push(`/invoices`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InvoiceDetails
        clients={clients}
        categories={categories}
        currencies={currencies}
        clientId={clientId}
        invoiceCategoryId={invoiceCategoryId}
        status={status}
        invoiceDate={invoiceDate}
        dueDate={dueDate}
        currency={currency}
        projectName={projectName}
        projectDescription={projectDescription}
        onClientChange={setClientId}
        onCategoryChange={setInvoiceCategoryId}
        onStatusChange={setStatus}
        onInvoiceDateChange={setInvoiceDate}
        onDueDateChange={setDueDate}
        onCurrencyChange={setCurrency}
        onProjectNameChange={setProjectName}
        onProjectDescriptionChange={setProjectDescription}
      />

      <InvoiceItems
        items={items}
        discountPercentage={discountPercentage}
        onUpdateItem={updateItem}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onDiscountPercentageChange={setDiscountPercentage}
      />

      <InvoicePayment
        paymentMethods={paymentMethods}
        paymentMethodId={paymentMethodId}
        paymentReference={paymentReference}
        notes={notes}
        terms={terms}
        onPaymentMethodChange={setPaymentMethodId}
        onPaymentReferenceChange={setPaymentReference}
        onNotesChange={setNotes}
        onTermsChange={setTerms}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
