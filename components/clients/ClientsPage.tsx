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

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>

            <p className="text-sm text-muted-foreground">
              Manage your clients and their contact details.
            </p>
          </div>

          <Link href="/clients/new">
            <Button>Add client</Button>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </p>

          <div className="w-full max-w-sm">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clients..."
              aria-label="Search clients"
            />
          </div>
        </div>

        <ClientTable clients={filteredClients} />
      </div>
    </main>
  );
}
