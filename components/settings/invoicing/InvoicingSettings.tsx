'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { InvoiceDefaults } from './InvoiceDefaults';
import { InvoiceCategories } from './InvoiceCategories';
import { DefaultInvoiceNotes } from './DefaultInvoiceNotes';

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
}: InvoicingSettingsProps) {
  const [formData, setFormData] = useState<InvoicingFormData>(
    getInitialFormData(settings),
  );

  const handleChange = (field: keyof InvoicingFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
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
      />

      {/* Invoice categories */}
      <InvoiceCategories categories={categories} />

      {/* Default invoice notes */}
      <DefaultInvoiceNotes
        value={formData.defaultNotes}
        onChange={(value) => handleChange('defaultNotes', value)}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <Button type="button" className="w-full sm:w-auto" disabled>
          Save changes
        </Button>
      </div>
    </div>
  );
}
