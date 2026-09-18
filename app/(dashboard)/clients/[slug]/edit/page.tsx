import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { ClientForm } from '@/components/clients/ClientForm';

import { getClientBySlug } from '@/actions/clients/getClientBySlug';

type EditClientPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { slug } = await params;

  const result = await getClientBySlug(slug);

  if (!result.success || !result.client) {
    notFound();
  }

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

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Edit client
          </h1>

          <p className="text-sm text-muted-foreground">
            Update the contact and business details for this client.
          </p>
        </div>

        <ClientForm client={result.client} />
      </div>
    </main>
  );
}
