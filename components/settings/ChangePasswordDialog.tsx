'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { updatePassword } from '@/actions/settings/updatePassword';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [visibleFields, setVisibleFields] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setVisibleFields({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const toggleVisibility = (field: PasswordField) => {
    setVisibleFields((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      onOpenChange(false);
      resetForm();

      router.replace('/login');
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">
            <LockKeyhole className="size-5" />
          </div>

          <DialogTitle>Change password</DialogTitle>

          <DialogDescription>
            Enter your current password and choose a new password. You&apos;ll
            be signed out after changing it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <PasswordFieldInput
            id="current-password"
            label="Current password"
            value={currentPassword}
            visible={visibleFields.currentPassword}
            disabled={isPending}
            onChange={setCurrentPassword}
            onToggle={() => toggleVisibility('currentPassword')}
          />

          <PasswordFieldInput
            id="new-password"
            label="New password"
            value={newPassword}
            visible={visibleFields.newPassword}
            disabled={isPending}
            onChange={setNewPassword}
            onToggle={() => toggleVisibility('newPassword')}
          />

          <PasswordFieldInput
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            visible={visibleFields.confirmPassword}
            disabled={isPending}
            onChange={setConfirmPassword}
            onToggle={() => toggleVisibility('confirmPassword')}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                isPending
              }
            >
              {isPending ? 'Changing...' : 'Change password'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PasswordFieldInputProps {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordFieldInput({
  id,
  label,
  value,
  visible,
  disabled,
  onChange,
  onToggle,
}: PasswordFieldInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={
            id === 'current-password' ? 'current-password' : 'new-password'
          }
          disabled={disabled}
          className="pr-10"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
