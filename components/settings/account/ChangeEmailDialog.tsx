'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MailCheck } from 'lucide-react';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../ui/input-otp';

import { requestEmailChange } from '@/actions/settings/requestEmailChange';
import { verifyEmailChange } from '@/actions/settings/verifyEmailChange';

interface ChangeEmailDialogProps {
  currentEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'email' | 'verification';

export function ChangeEmailDialog({
  currentEmail,
  open,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const [step, setStep] = useState<Step>('email');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep('email');
      setNewEmail('');
      setCode('');
      setVerificationId(null);
      setCooldown(0);
    }

    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleRequestCode = () => {
    startTransition(async () => {
      const result = await requestEmailChange({
        newEmail,
      });

      if (!result.success) {
        toast.error(result.message);

        if (result.cooldownSeconds) {
          setCooldown(result.cooldownSeconds);
        }

        return;
      }

      setVerificationId(result.verificationId);
      setCooldown(result.cooldownSeconds ?? 60);
      setStep('verification');

      toast.success(result.message);
    });
  };

  const handleVerifyCode = () => {
    if (!verificationId) {
      return;
    }

    startTransition(async () => {
      const result = await verifyEmailChange({
        verificationId,
        code,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);

      router.replace('/login');
    });
  };

  const handleBack = () => {
    if (isPending) {
      return;
    }

    setStep('email');
    setCode('');
  };

  const handleResend = () => {
    if (cooldown > 0 || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await requestEmailChange({
        newEmail,
      });

      if (!result.success) {
        toast.error(result.message);

        if (result.cooldownSeconds) {
          setCooldown(result.cooldownSeconds);
        }

        return;
      }

      setVerificationId(result.verificationId);
      setCooldown(result.cooldownSeconds ?? 60);
      setCode('');

      toast.success(result.message);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'email' ? (
          <>
            <DialogHeader>
              <DialogTitle>Change email address</DialogTitle>

              <DialogDescription>
                Enter your new email address. We&apos;ll send a verification
                code to confirm ownership.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Current email</Label>

                <Input value={currentEmail} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">New email address</Label>

                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isPending}
                />
              </div>

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
                  onClick={handleRequestCode}
                  disabled={!newEmail.trim() || isPending}
                >
                  {isPending ? 'Sending code...' : 'Send code'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">
                <MailCheck className="size-5" />
              </div>

              <DialogTitle>Verify your new email</DialogTitle>

              <DialogDescription>
                We&apos;ve sent a 6-digit verification code to{' '}
                <span className="font-medium text-foreground">{newEmail}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email-verification-code">
                  Verification code
                </Label>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    disabled={isPending}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    containerClassName="w-full"
                  >
                    <InputOTPGroup className="w-full justify-around gap-2">
                      {Array.from({ length: 6 }, (_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="size-11 rounded-lg border border-border text-lg font-medium first:rounded-lg last:rounded-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isPending}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  <ArrowLeft className="size-3.5" />
                  Change email
                </button>
              </div>

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
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6 || isPending}
                >
                  {isPending ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
