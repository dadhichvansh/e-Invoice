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

type ClientsProps = {
  clients: Client[];
};

export function Clients({ clients }: ClientsProps) {
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </p>

          <div className="flex w-full gap-2 sm:max-w-sm">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clients..."
              aria-label="Search clients"
            />

            <Link href="/clients/new" className="shrink-0">
              <Button>Add client</Button>
            </Link>
          </div>
        </div>

        <ClientTable clients={filteredClients} isSearching={isSearching} />
      </div>
    </main>
  );
}
