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

import { updateName } from '@/actions/settings/updateName';

interface AccountSettingsProps {
  name: string;
  email: string;
}

export function AccountSettings({ name, email }: AccountSettingsProps) {
  const [accountName, setAccountName] = useState(name);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSaveChanges = () => {
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
              onChange={(event) => setAccountName(event.target.value)}
              placeholder="Your name"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveChanges}
              disabled={isPending || accountName.trim() === name}
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="account-email"
              type="email"
              value={email}
              readOnly
              className="min-w-0"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEmailDialogOpen(true)}
            >
              Change
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

        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Account password
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Use a strong password to keep your account secure.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change password
            </Button>
          </div>
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
