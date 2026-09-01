import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeletePaymentMethodDialogProps {
  paymentMethod: {
    id: string;
    name: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeletePaymentMethodDialog({
  paymentMethod,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeletePaymentMethodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete payment method?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {paymentMethod?.name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
