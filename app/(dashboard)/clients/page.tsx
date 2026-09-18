import { ClientsPage } from '@/components/clients/ClientsPage';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export default async function ClientsRoute() {
  const { user } = await requireAuthentication();

  const clients = await prisma.client.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <ClientsPage clients={clients} />;
}
