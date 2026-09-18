import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

import { ClientForm } from '@/components/clients/ClientForm';

export default async function NewClientPage() {
  await requireAuthentication();

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Clients
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            New client
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new client to use on your invoices.
          </p>
        </div>

        <ClientForm />
      </div>
    </main>
  );
}
