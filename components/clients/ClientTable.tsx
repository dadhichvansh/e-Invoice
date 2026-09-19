'use client';

import Link from 'next/link';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DeleteClientDialog } from './DeleteClientDialog';

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

type ClientTableProps = {
  clients: Client[];
  isSearching: boolean;
};

export function ClientTable({ clients, isSearching }: ClientTableProps) {
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  if (clients.length === 0) {
    return (
      <div className="mt-4 rounded-lg border">
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm font-medium">
            {isSearching ? 'No clients match your search.' : 'No clients yet.'}
          </p>

          <p className="text-sm text-muted-foreground">
            {isSearching
              ? 'Try a different search term.'
              : 'Add your first client to get started.'}
          </p>

          {!isSearching && (
            <Link href="/clients/new">
              <Button>Add client</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-25 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.map((client) => {
              const location = [client.city, client.country]
                .filter(Boolean)
                .join(', ');

              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="font-medium">{client.name}</div>
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground">
                      {client.company || '—'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} /> {client.email}
                      </div>

                      {client.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Phone size={13} /> {client.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground">
                      {location || '—'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link href={`/clients/${client.slug}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${client.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        aria-label={`Delete ${client.name}`}
                        onClick={() => setClientToDelete(client)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DeleteClientDialog
        clientId={clientToDelete?.id ?? ''}
        clientName={clientToDelete?.name ?? ''}
        open={clientToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setClientToDelete(null);
          }
        }}
      />
    </>
  );
}
