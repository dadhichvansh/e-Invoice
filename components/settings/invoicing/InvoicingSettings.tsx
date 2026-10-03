'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { InvoiceDefaults } from './InvoiceDefaults';
import { InvoiceCategories } from './InvoiceCategories';
import { CurrencySettings } from './CurrencySettings';
import { DefaultInvoiceNotes } from './DefaultInvoiceNotes';

import { updateInvoicingSettings } from '@/actions/settings/invoicing/invoicingSettings';

import { invoicingSettingsSchema } from '@/lib/validators/invoicingSettings';

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

type InvoicingField = keyof InvoicingFormData;

type InvoicingErrors = Partial<Record<InvoicingField, string | undefined>>;

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
  const [initialFormData, setInitialFormData] = useState<InvoicingFormData>(
    getInitialFormData(settings),
  );

  const [formData, setFormData] = useState<InvoicingFormData>(initialFormData);

  const [errors, setErrors] = useState<InvoicingErrors>({});

  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    formData.invoicePrefix !== initialFormData.invoicePrefix ||
    formData.defaultCurrency !== initialFormData.defaultCurrency ||
    formData.defaultPaymentTerms !== initialFormData.defaultPaymentTerms ||
    formData.defaultNotes !== initialFormData.defaultNotes;

  const handleChange = (field: InvoicingField, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const result = invoicingSettingsSchema.safeParse({
      invoicePrefix: formData.invoicePrefix,
      defaultCurrency: formData.defaultCurrency,
      defaultPaymentTerms:
        formData.defaultPaymentTerms === ''
          ? NaN
          : Number(formData.defaultPaymentTerms),
      defaultNotes: formData.defaultNotes,
    });

    if (!result.success) {
      const fieldErrors: InvoicingErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === 'string' &&
          field in formData &&
          !fieldErrors[field as InvoicingField]
        ) {
          fieldErrors[field as InvoicingField] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSaveChanges = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateInvoicingSettings({
        invoicePrefix: formData.invoicePrefix,
        defaultCurrency: formData.defaultCurrency,
        defaultPaymentTerms: Number(formData.defaultPaymentTerms),
        defaultNotes: formData.defaultNotes,
      });

      if (!result.success) {
        setErrors(result.fieldErrors);

        toast.error(result.message);
        return;
      }

      setInitialFormData(formData);
      setErrors({});

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
        errors={{
          invoicePrefix: errors.invoicePrefix,
          defaultCurrency: errors.defaultCurrency,
          defaultPaymentTerms: errors.defaultPaymentTerms,
        }}
        isSaving={isSaving}
      />

      {/* Invoice categories */}
      <InvoiceCategories categories={categories} />

      {/* Currency settings */}
      <CurrencySettings currencies={currencies} />

      {/* Default invoice notes */}
      <DefaultInvoiceNotes
        value={formData.defaultNotes}
        onChange={(value) => handleChange('defaultNotes', value)}
        error={errors.defaultNotes}
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
