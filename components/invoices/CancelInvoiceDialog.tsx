'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { cancelInvoice } from '@/actions/invoices/cancelInvoice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CancelInvoiceDialogProps = {
  invoiceSlug: string;
  invoiceNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled?: () => void;
};

export function CancelInvoiceDialog({
  invoiceSlug,
  invoiceNumber,
  open,
  onOpenChange,
  onCancelled,
}: CancelInvoiceDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleCancel() {
    setIsCancelling(true);

    try {
      const result = await cancelInvoice(invoiceSlug);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onCancelled?.();
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel invoice?</DialogTitle>

          <DialogDescription>
            Invoice {invoiceNumber} will be marked as cancelled and preserved in
            your records. It will no longer be available for editing.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCancelling}
          >
            Keep invoice
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
