'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileDown, Pencil, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { CancelInvoiceDialog } from '@/components/invoices/CancelInvoiceDialog';

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type InvoiceViewActionsProps = {
  slug: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatus;
};

export function InvoiceViewActions({
  slug,
  invoiceNumber,
  invoiceStatus,
}: InvoiceViewActionsProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const isStatusLocked =
    invoiceStatus === 'PAID' || invoiceStatus === 'CANCELLED';

  function handlePrint() {
    window.open(`/api/invoice/${slug}/pdf`, '_blank', 'noopener,noreferrer');
  }

  function handleCancelled() {
    window.location.reload();
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {!isStatusLocked && (
          <>
            <Link href={`/invoices/${slug}/edit`}>
              <Button variant="outline">
                <Pencil className="size-4" />
                Edit
              </Button>
            </Link>
          </>
        )}

        <Button type="button" variant="outline" onClick={handlePrint}>
          <FileDown className="size-4" />
          Download
        </Button>

        {!isStatusLocked && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCancelDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <XCircle className="size-4" />
            Cancel
          </Button>
        )}
      </div>

      <CancelInvoiceDialog
        invoiceSlug={slug}
        invoiceNumber={invoiceNumber}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onCancelled={handleCancelled}
      />
    </>
  );
}
