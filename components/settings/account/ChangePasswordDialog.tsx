'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

import { updatePassword } from '@/actions/settings/account/updatePassword';

import { updatePasswordSchema } from '@/lib/validators/settings';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

type PasswordErrors = Partial<Record<PasswordField, string>>;

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<PasswordErrors>({});

  const [visibleFields, setVisibleFields] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setErrors({});

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

  const validateForm = () => {
    const result = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const errors = result.error.issues.reduce((acc, issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as PasswordField;
          acc[field] = issue.message;
        }
        return acc;
      }, {} as PasswordErrors);

      setErrors(errors);
      return false;
    }

    setErrors({});
    return true;
  };

  const clearFieldError = (field: PasswordField) => {
    if (!errors[field]) {
      return;
    }

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    clearFieldError('currentPassword');
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    clearFieldError('newPassword');

    if (errors.confirmPassword && value === confirmPassword) {
      setErrors((previous) => ({
        ...previous,
        confirmPassword: undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    clearFieldError('confirmPassword');

    if (errors.confirmPassword) {
      const result = updatePasswordSchema.safeParse({
        currentPassword,
        newPassword,
        confirmPassword: value,
      });

      if (result.success) {
        setErrors((previous) => ({
          ...previous,
          confirmPassword: undefined,
        }));
      }
    }
  };

  const handleSubmit = () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

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
            error={errors.currentPassword}
            visible={visibleFields.currentPassword}
            disabled={isPending}
            onChange={handleCurrentPasswordChange}
            onToggle={() => toggleVisibility('currentPassword')}
          />

          <PasswordFieldInput
            id="new-password"
            label="New password"
            value={newPassword}
            error={errors.newPassword}
            visible={visibleFields.newPassword}
            disabled={isPending}
            onChange={handleNewPasswordChange}
            onToggle={() => toggleVisibility('newPassword')}
          />

          <PasswordFieldInput
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            error={errors.confirmPassword}
            visible={visibleFields.confirmPassword}
            disabled={isPending}
            onChange={handleConfirmPasswordChange}
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

            <Button type="button" onClick={handleSubmit} disabled={isPending}>
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
  error?: string;
  visible: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordFieldInput({
  id,
  label,
  value,
  error,
  visible,
  disabled,
  onChange,
  onToggle,
}: PasswordFieldInputProps) {
  const errorId = error ? `${id}-error` : undefined;

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
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
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

      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
