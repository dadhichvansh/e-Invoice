'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

import { InvoiceItems, type InvoiceItemForm } from './InvoiceItems';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoicePayment } from './InvoicePayment';

import { createInvoice } from '@/actions/invoices/createInvoice';
import { updateInvoice } from '@/actions/invoices/updateInvoice';

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

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoiceFormItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sortOrder: number;
};

type InvoiceFormInvoice = {
  id: string;
  slug: string;
  invoiceNumber: string;
  clientId: string | null;
  invoiceCategoryId: string | null;
  paymentMethodId: string | null;
  status: InvoiceStatus;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  projectName: string | null;
  projectDescription: string | null;
  discountPercentage: number;
  paymentReference: string | null;
  notes: string | null;
  terms: string | null;
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
  items: InvoiceFormItem[];
};

type InvoiceFormProps = {
  clients: InvoiceFormClient[];
  categories: InvoiceFormCategory[];
  paymentMethods: InvoiceFormPaymentMethod[];
  currencies: InvoiceFormCurrency[];
  defaultCurrency: string;
  defaultPaymentTerms: number;
  defaultNotes: string;
  mode?: 'create' | 'edit';
  initialInvoice?: InvoiceFormInvoice;
};

function formatDateForInput(date: Date) {
  const value = new Date(date);

  return value.toISOString().split('T')[0];
}

export function InvoiceForm({
  clients,
  categories,
  paymentMethods,
  currencies,
  defaultCurrency,
  defaultPaymentTerms,
  defaultNotes,
  mode = 'create',
  initialInvoice,
}: InvoiceFormProps) {
  const router = useRouter();

  const isEditMode = mode === 'edit';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clientId, setClientId] = useState(initialInvoice?.clientId ?? '');

  const [invoiceCategoryId, setInvoiceCategoryId] = useState(
    initialInvoice?.invoiceCategoryId ?? '',
  );

  const [invoiceDate, setInvoiceDate] = useState(() =>
    initialInvoice
      ? formatDateForInput(initialInvoice.invoiceDate)
      : (() => {
          const date = new Date();

          return date.toISOString().split('T')[0];
        })(),
  );

  const [dueDate, setDueDate] = useState(() =>
    initialInvoice
      ? formatDateForInput(initialInvoice.dueDate)
      : (() => {
          const date = new Date();

          date.setDate(date.getDate() + defaultPaymentTerms);

          return date.toISOString().split('T')[0];
        })(),
  );

  const [currency, setCurrency] = useState(
    initialInvoice?.currency ?? defaultCurrency,
  );

  const [status, setStatus] = useState<InvoiceStatus>(
    initialInvoice?.status ?? 'DRAFT',
  );

  const [projectName, setProjectName] = useState(
    initialInvoice?.projectName ?? '',
  );

  const [projectDescription, setProjectDescription] = useState(
    initialInvoice?.projectDescription ?? '',
  );

  const [items, setItems] = useState<InvoiceItemForm[]>(
    initialInvoice
      ? initialInvoice.items.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          rate: String(item.rate),
        }))
      : [
          {
            description: '',
            quantity: '1',
            rate: '',
          },
        ],
  );

  const [discountPercentage, setDiscountPercentage] = useState(
    initialInvoice ? String(initialInvoice.discountPercentage) : '0',
  );

  const [paymentMethodId, setPaymentMethodId] = useState(
    initialInvoice?.paymentMethodId ?? '',
  );

  const [paymentReference, setPaymentReference] = useState(
    initialInvoice?.paymentReference ?? '',
  );

  const [notes, setNotes] = useState(initialInvoice?.notes ?? defaultNotes);

  const [terms, setTerms] = useState(
    initialInvoice?.terms ??
      (defaultPaymentTerms > 0
        ? `Payment is due within ${defaultPaymentTerms} days of the invoice date.`
        : ''),
  );

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

    const invoiceInput = {
      currency,
      status,
      discountPercentage: Number(discountPercentage) || 0,
      paymentReference: paymentReference || null,
      notes: notes || null,
      terms: terms || null,
      items: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
      })),
    };

    if (isEditMode) {
      if (!initialInvoice) {
        toast.error('Invoice details are unavailable.');
        setIsSubmitting(false);
        return;
      }

      const result = await updateInvoice(initialInvoice.slug, invoiceInput);

      if (!result.success) {
        toast.error(result.message);
        setIsSubmitting(false);
        return;
      }

      toast.success(result.message);

      router.push('/invoices');
      return;
    }

    const result = await createInvoice({
      clientId,
      invoiceCategoryId: invoiceCategoryId || null,
      paymentMethodId: paymentMethodId || null,
      invoiceDate: new Date(`${invoiceDate}T00:00:00`),
      dueDate: new Date(`${dueDate}T00:00:00`),
      currency,
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

    router.push('/invoices');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InvoiceDetails
        clients={clients}
        categories={categories}
        currencies={currencies}
        isEditMode={isEditMode}
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
        isEditMode={isEditMode}
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
          {isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
              ? 'Update Invoice'
              : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
