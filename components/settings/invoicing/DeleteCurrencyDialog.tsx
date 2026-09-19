'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { deleteCurrency } from '@/actions/settings/invoicing/currency';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteCurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currencyId: string;
  currencyName: string;
  onDeleted: (currencyId: string) => void;
}

export function DeleteCurrencyDialog({
  open,
  onOpenChange,
  currencyId,
  currencyName,
  onDeleted,
}: DeleteCurrencyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteCurrency(currencyId);

    if (!result.success) {
      toast.error(result.message);
      setIsDeleting(false);
      return;
    }

    toast.success(result.message);

    onDeleted(currencyId);

    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete currency?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{currencyName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
