'use client';

import { useActionState, useEffect } from 'react';
import { login, type LoginState } from '@/actions/authentication/login';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginCard } from '@/components/authentication/login/LoginCard';

const initialState: LoginState = {
  success: false,
  message: '',
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.replace('/');
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <LoginCard formAction={formAction} isPending={isPending} />

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          e-Invoice · &copy; Vansh Dadhich {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
