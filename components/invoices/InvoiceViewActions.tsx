'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, FileDown, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { updateInvoiceStatus } from '@/actions/invoices/updateInvoiceStatus';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CancelInvoiceDialog } from '@/components/invoices/CancelInvoiceDialog';

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

type EditableInvoiceStatus = Exclude<InvoiceStatus, 'CANCELLED'>;

type InvoiceViewActionsProps = {
  slug: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatus;
};

const statusLabels: Record<EditableInvoiceStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PAID: 'Paid',
};

export function InvoiceViewActions({
  slug,
  invoiceNumber,
  invoiceStatus,
}: InvoiceViewActionsProps) {
  const [status, setStatus] = useState<InvoiceStatus>(invoiceStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const isCancelled = status === 'CANCELLED';

  async function handleStatusChange(value: string | null) {
    if (!value || value === status || value === 'CANCELLED') {
      return;
    }

    const nextStatus = value as EditableInvoiceStatus;

    setIsUpdatingStatus(true);

    const result = await updateInvoiceStatus(slug, nextStatus);

    if (!result.success) {
      toast.error(result.message);
      setIsUpdatingStatus(false);
      return;
    }

    setStatus(nextStatus);
    toast.success(result.message);

    setIsUpdatingStatus(false);

    window.location.reload();
  }

  async function handlePrint() {
    window.open(`/api/invoice/${slug}/pdf`, '_blank', 'noopener,noreferrer');
  }

  function handleCancelled() {
    setStatus('CANCELLED');
    window.location.reload();
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {!isCancelled && (
          <>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status">
                  {(value) =>
                    statusLabels[value as EditableInvoiceStatus] ?? 'Status'
                  }
                </SelectValue>
              </SelectTrigger>

              <SelectContent
                alignItemWithTrigger={false}
                side="bottom"
                sideOffset={4}
              >
                <SelectItem value="DRAFT">
                  <span className="flex items-center gap-2">Draft</span>
                </SelectItem>

                <SelectItem value="PENDING">
                  <span className="flex items-center gap-2">Pending</span>
                </SelectItem>

                <SelectItem value="PAID">
                  <span className="flex items-center gap-2">Paid</span>
                </SelectItem>
              </SelectContent>
            </Select>

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

        {!isCancelled && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCancelDialogOpen(true)}
            disabled={isUpdatingStatus}
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
