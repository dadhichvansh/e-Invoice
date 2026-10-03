'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ChangeEmailDialog } from './ChangeEmailDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';

import { updateName } from '@/actions/settings/account/updateName';

import { updateNameSchema } from '@/lib/validators/settings';

interface AccountSettingsProps {
  name: string;
  email: string;
}

export function AccountSettings({ name, email }: AccountSettingsProps) {
  const router = useRouter();

  const [accountName, setAccountName] = useState(name);
  const [nameError, setNameError] = useState<string | undefined>();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const validateName = () => {
    const result = updateNameSchema.safeParse({
      name: accountName,
    });

    if (!result.success) {
      const error = result.error.issues[0].message;

      setNameError(error ?? 'Please enter a valid name.');
      return false;
    }

    setNameError(undefined);
    return true;
  };

  const handleNameChange = (value: string) => {
    setAccountName(value);

    if (nameError) {
      const result = updateNameSchema.safeParse({
        name: value,
      });

      if (result.success) {
        setNameError(undefined);
      }
    }
  };

  const handleNameBlur = () => {
    if (!accountName.trim()) {
      return;
    }

    validateName();
  };

  const handleSaveChanges = () => {
    const isValid = validateName();

    if (!isValid) {
      return;
    }

    startTransition(async () => {
      const result = await updateName({
        name: accountName,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const isNameUnchanged = accountName.trim() === name;

  return (
    <>
      {/* Personal information */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the name associated with your account.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Name</Label>

            <Input
              id="account-name"
              value={accountName}
              onChange={(event) => handleNameChange(event.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g. John Doe"
              disabled={isPending}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'account-name-error' : undefined}
            />

            {nameError && (
              <p id="account-name-error" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveChanges}
              disabled={isPending || isNameUnchanged}
            >
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email address */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Email address
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your email address is used to sign in to your account.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col items-end justify-between gap-2 sm:flex-row">
            <div className="space-y-2 w-full">
              <Label htmlFor="account-email">Email</Label>

              <Input id="account-email" type="email" value={email} readOnly />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEmailDialogOpen(true)}
            >
              Change email
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Changing your email requires verification and will sign you out of
            your account.
          </p>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Password
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Change your account password.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col items-end justify-between gap-2 sm:flex-row">
            <div className="space-y-2 w-full">
              <Label htmlFor="account-password">Password</Label>

              <Input
                id="account-password"
                type="password"
                value="•••••••••••"
                readOnly
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change password
            </Button>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Use a strong password to keep your account secure.
          </p>
        </CardContent>
      </Card>

      <ChangeEmailDialog
        currentEmail={email}
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </>
  );
}
