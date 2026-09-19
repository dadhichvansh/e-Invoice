'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { InvoiceDefaults } from './InvoiceDefaults';
import { InvoiceCategories } from './InvoiceCategories';
import { DefaultInvoiceNotes } from './DefaultInvoiceNotes';

import { updateInvoicingSettings } from '@/actions/settings/invoicing/invoicingSettings';
import { CurrencySettings } from './CurrencySettings';

interface InvoicingSettingsProps {
  settings: {
    invoicePrefix: string | null;
    defaultCurrency: string | null;
    defaultPaymentTerms: number | null;
    defaultNotes: string | null;
  } | null;

  categories: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];

  currencies: {
    id: string;
    symbol: string;
    code: string;
    name: string;
  }[];
}

interface InvoicingFormData {
  invoicePrefix: string;
  defaultCurrency: string;
  defaultPaymentTerms: string;
  defaultNotes: string;
}

function getInitialFormData(
  settings: InvoicingSettingsProps['settings'],
): InvoicingFormData {
  return {
    invoicePrefix: settings?.invoicePrefix ?? '',
    defaultCurrency: settings?.defaultCurrency ?? 'INR',
    defaultPaymentTerms:
      settings?.defaultPaymentTerms !== null &&
      settings?.defaultPaymentTerms !== undefined
        ? String(settings.defaultPaymentTerms)
        : '',
    defaultNotes: settings?.defaultNotes ?? '',
  };
}

export function InvoicingSettings({
  settings,
  categories,
  currencies,
}: InvoicingSettingsProps) {
  const initialFormData = getInitialFormData(settings);

  const [formData, setFormData] = useState<InvoicingFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    formData.invoicePrefix !== initialFormData.invoicePrefix ||
    formData.defaultCurrency !== initialFormData.defaultCurrency ||
    formData.defaultPaymentTerms !== initialFormData.defaultPaymentTerms ||
    formData.defaultNotes !== initialFormData.defaultNotes;

  const handleChange = (field: keyof InvoicingFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const result = await updateInvoicingSettings({
        invoicePrefix: formData.invoicePrefix,
        defaultCurrency: formData.defaultCurrency,
        defaultPaymentTerms: Number(formData.defaultPaymentTerms),
        defaultNotes: formData.defaultNotes,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice defaults */}
      <InvoiceDefaults
        data={{
          invoicePrefix: formData.invoicePrefix,
          defaultCurrency: formData.defaultCurrency,
          defaultPaymentTerms: formData.defaultPaymentTerms,
        }}
        onChange={handleChange}
        currencies={currencies}
      />

      {/* Invoice categories */}
      <InvoiceCategories categories={categories} />

      {/* Currency settings */}
      <CurrencySettings currencies={currencies} />

      {/* Default invoice notes */}
      <DefaultInvoiceNotes
        value={formData.defaultNotes}
        onChange={(value) => handleChange('defaultNotes', value)}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleSaveChanges}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
