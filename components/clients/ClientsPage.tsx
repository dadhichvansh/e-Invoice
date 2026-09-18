'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ClientTable } from '@/components/clients/ClientTable';

type Client = {
  id: string;
  name: string;
  slug: string;
  email: string;
  company: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  website: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ClientsPageProps = {
  clients: Client[];
};

export function ClientsPage({ clients }: ClientsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      return [
        client.name,
        client.email,
        client.company,
        client.phone,
        client.city,
        client.state,
        client.country,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [clients, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Clients
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your clients and their contact details.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </p>

        <div className="w-full max-w-sm flex gap-2 items-center mb-4">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search clients..."
            aria-label="Search clients"
          />

          <Link href="/clients/new">
            <Button>Add client</Button>
          </Link>
        </div>
      </div>

      <ClientTable clients={filteredClients} isSearching={isSearching} />
    </main>
  );
}
