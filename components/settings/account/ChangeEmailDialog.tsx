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

import { requestEmailChange } from '@/actions/settings/account/requestEmailChange';
import { verifyEmailChange } from '@/actions/settings/account/verifyEmailChange';

import {
  requestEmailChangeSchema,
  verifyEmailChangeSchema,
} from '@/lib/validators/settings';
import { EMAIL_CHANGE_VERIFICATION_CODE_EXPIRY_MS } from '@/lib/constants/authentication';

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
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const [isRequestingCode, startRequestTransition] = useTransition();
  const [isVerifyingCode, startVerifyTransition] = useTransition();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep('email');
      setNewEmail('');
      setEmailError(undefined);
      setCode('');
      setCodeError(undefined);
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

  const validateEmail = () => {
    const result = requestEmailChangeSchema.safeParse({
      newEmail,
    });

    if (!result.success) {
      const error = result.error.issues[0].message;

      setEmailError(error ?? 'Please enter a valid email address.');
      return false;
    }

    setEmailError(undefined);
    return true;
  };

  const handleEmailChange = (value: string) => {
    setNewEmail(value);

    if (emailError) {
      const result = requestEmailChangeSchema.safeParse({
        newEmail: value,
      });

      if (result.success) {
        setEmailError(undefined);
      }
    }
  };

  const handleEmailBlur = () => {
    if (!newEmail.trim()) {
      return;
    }

    validateEmail();
  };

  const validateCode = () => {
    const result = verifyEmailChangeSchema.safeParse({
      verificationId: verificationId ?? '',
      code,
    });

    if (!result.success) {
      const error = result.error.issues[0].message;

      setCodeError(error ?? 'Please enter a valid 6-digit verification code.');
      return false;
    }

    setCodeError(undefined);
    return true;
  };

  const handleCodeChange = (value: string) => {
    setCode(value);

    if (codeError) {
      const result = verifyEmailChangeSchema.safeParse({
        verificationId: verificationId ?? '',
        code: value,
      });

      if (result.success) {
        setCodeError(undefined);
      }
    }
  };

  const handleRequestCode = () => {
    const isValid = validateEmail();

    if (!isValid) {
      return;
    }

    startRequestTransition(async () => {
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

    const isValid = validateCode();

    if (!isValid) {
      return;
    }

    startVerifyTransition(async () => {
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
    if (isRequestingCode || isVerifyingCode) {
      return;
    }

    setStep('email');
    setCode('');
    setCodeError(undefined);
  };

  const handleResend = () => {
    if (cooldown > 0 || isRequestingCode || isVerifyingCode) {
      return;
    }

    const isValid = validateEmail();

    if (!isValid) {
      setStep('email');
      return;
    }

    startRequestTransition(async () => {
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
      setCodeError(undefined);

      toast.success(result.message);
    });
  };

  const handleCancel = () => {
    if (isRequestingCode || isVerifyingCode) {
      return;
    }

    handleOpenChange(false);
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
                  onChange={(event) => handleEmailChange(event.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="e.g. john.doe@example.com"
                  autoComplete="email"
                  disabled={isRequestingCode || isVerifyingCode}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'new-email-error' : undefined}
                />

                {emailError && (
                  <p id="new-email-error" className="text-sm text-destructive">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isRequestingCode || isVerifyingCode}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={isRequestingCode}
                >
                  {isRequestingCode ? 'Sending code...' : 'Send code'}
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
                <span className="font-medium text-foreground">{newEmail}</span>{' '}
                (Expires in{' '}
                {EMAIL_CHANGE_VERIFICATION_CODE_EXPIRY_MS / 1000 / 60} minutes).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email-verification-code">
                  Enter your verification code below
                </Label>

                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    disabled={isRequestingCode || isVerifyingCode}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    containerClassName="w-full"
                    aria-invalid={!!codeError}
                    aria-describedby={
                      codeError ? 'email-verification-code-error' : undefined
                    }
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

                {codeError && (
                  <p
                    id="email-verification-code-error"
                    className="text-center text-sm text-destructive"
                  >
                    {codeError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isRequestingCode || isVerifyingCode}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : isRequestingCode
                      ? 'Requesting code...'
                      : 'Resend code'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isRequestingCode || isVerifyingCode}
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
                  onClick={handleCancel}
                  disabled={isRequestingCode || isVerifyingCode}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || isRequestingCode}
                >
                  {isVerifyingCode ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
