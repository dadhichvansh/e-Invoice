import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ClientView } from '@/components/clients/ClientView';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { getClientBySlug } from '@/actions/clients/getClientBySlug';

interface ViewClientPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ViewClientPage({ params }: ViewClientPageProps) {
  const { slug } = await params;

  await requireAuthentication();

  const clientResult = await getClientBySlug(slug);

  if (!clientResult.client) {
    return (
      <main className="p-4 sm:p-6 lg:p-9">
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
              Client not found
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {clientResult.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-9">
      <div className="w-full space-y-5">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Clients
        </Link>

        <ClientView client={clientResult.client} />
      </div>
    </main>
  );
}
